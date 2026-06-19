import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly username = 'admin';
  private readonly password = 'admin123';

  validateUser(username: string, password: string): boolean {
    return username === this.username && password === this.password;
  }
}
