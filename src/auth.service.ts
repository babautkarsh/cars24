import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './user-role.enum';

@Injectable()
export class AuthService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'apple',
      role: UserRole.ADMIN,
    },
    {
      userId: 2,
      username: 'johnny',
      password: 'banana',
      role: UserRole.SUPERUSER,
    },
    {
      userId: 3,
      username: 'johsua',
      password: 'orange',
      role: UserRole.USER,
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(
      (user) => user.username === username && user.password === password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      role: user.role,
    };
  }
}
