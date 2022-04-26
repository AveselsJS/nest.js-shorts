/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
	
  @UsePipes(new ValidationPipe())
	@Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login)
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    } else {
      return this.authService.createUser(dto);
    }
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.login, dto.password);
    return this.authService.login(user.email);
  }
}
