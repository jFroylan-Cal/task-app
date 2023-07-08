import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}
  async singIn(createUserDto: CreateUserDto) {
    const trans = await this._startTransaction();
    try {
      const { password, email, username, lastName, name } = createUserDto;
      const user = this.userRepository.create({
        email: email,
        userName: username,
        lastName: lastName,
        name: name,
        password: bcrypt.hashSync(password, 10),
      });
      await trans.manager.save(user);
      await trans.commitTransaction();
      await trans.release();
      return { token: this._getJwtToken({ id: user.id }) };
    } catch (error) {
      await trans.rollbackTransaction();
      await trans.release();
      this._handleErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    if (bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return true;
  }

  private _handleErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Check servers errors');
  }

  private _getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async _startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
