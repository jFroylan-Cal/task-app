import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, email, username, lastName, name } = createUserDto;
      const user = this.userRepository.create({
        email: email,
        userName: username,
        lastName: lastName,
        name: name,
        password: bcrypt.hashSync(password, 10),
      });
      this.userRepository.save(user);
      return { user };
    } catch (error) {}
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
}
