import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

// ini guard buat protect halaman Author & Book.
// dipasang pake @UseGuards(AuthGuard) di authors.controller.ts & books.controller.ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    // kalo session.user ada artinya udah login (di-set pas POST /login sukses)
    if (req.session && req.session.user) {
      return true;
    }

    // belum login? tendang balik ke halaman login, jangan kasih lanjut ke controller
    res.redirect('/login');
    return false;
  }
}
