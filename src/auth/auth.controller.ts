import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

// controller buat fitur login/logout. ini gak dipasang AuthGuard
// (soalnya kalo dipasang, orang yg belum login gak akan bisa akses /login -> infinite redirect)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET /login -> kalo udah ada session, gausah liat form lagi langsung lempar ke /authors
  @Get('login')
  showLogin(@Req() req: Request, @Res() res: Response) {
    if (req.session && req.session.user) {
      return res.redirect('/authors');
    }
    return res.render('login', { error: null });
  }

  // POST /login -> cek username/password ke AuthService (masih hardcoded admin/admin123).
  // kalo benar, simpen username ke session (ini yg dicek AuthGuard nanti).
  // kalo salah, render ulang halaman login + pesan error (bukan throw exception,
  // soalnya mau tetep nampilin page bukan error json)
  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (this.authService.validateUser(username, password)) {
      req.session.user = username;
      return res.redirect('/authors');
    }
    return res.render('login', { error: 'Username atau password salah.' });
  }

  // POST /logout -> hapus session, balik ke halaman login
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}
