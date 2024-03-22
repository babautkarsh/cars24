import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 401, description: 'Invalid username or password' })
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If credentials are valid, call AuthService to generate JWT token
    const token = await this.authService.login(user);

    // Return the token
    return token;
  }

  @Post('refresh')
  @Post('refresh-token')
  async refreshToken(@Request() req) {
    const refreshToken = req.body.refreshToken;
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiBody({ type: String })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Retrieved user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }
}
