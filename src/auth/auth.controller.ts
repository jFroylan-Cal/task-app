import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.singIn(createUserDto);
  }

  @Post('login')
  login(@Body() logInDto: LoginUserDto) {
    return this.authService.login(logInDto);
  }
}
