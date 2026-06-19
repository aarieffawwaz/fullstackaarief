import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorsService } from './authors.service';

// ini "Controller" di pattern MVC. tugasnya cuma nerima request dari browser,
// terus panggil Service (yg isinya logic & query db), abis itu render View (.hbs).
// controller sendiri gak ada logic database, biar rapi & gampang ditest
@Controller('authors')
@UseGuards(AuthGuard) // semua route disini wajib login dulu (AuthGuard yg ngecek)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  // GET /authors -> halaman list semua author, sekalian ada fitur search
  // contoh: /authors?q=tere -> bakal cari yang namanya mengandung "tere"
  @Get()
  async index(@Query('q') q: string, @Res() res: Response) {
    const authors = await this.authorsService.findAll(q);
    return res.render('authors/index', { authors, q: q || '' });
  }

  // GET /authors/new -> nampilin form tambah author (kosong)
  @Get('new')
  newForm(@Res() res: Response) {
    return res.render('authors/form', { author: null, action: '/authors' });
  }

  // POST /authors -> proses simpen author baru, abis itu redirect ke list
  // (pake form HTML biasa, bukan fetch/axios, makanya pake redirect bukan return json)
  @Post()
  async create(
    @Body('name') name: string,
    @Body('bio') bio: string,
    @Res() res: Response,
  ) {
    await this.authorsService.create({ name, bio });
    return res.redirect('/authors');
  }

  // GET /authors/:id -> halaman detail 1 author, sekalian nampilin daftar
  // buku-buku punya author ini (manfaatin relasi one-to-many nya)
  @Get(':id')
  async detail(@Param('id') id: string, @Res() res: Response) {
    const author = await this.authorsService.findOne(+id);
    return res.render('authors/detail', { author });
  }

  @Get(':id/edit')
  async editForm(@Param('id') id: string, @Res() res: Response) {
    const author = await this.authorsService.findOne(+id);
    return res.render('authors/form', {
      author,
      action: `/authors/${id}/edit`,
    });
  }

  @Post(':id/edit')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('bio') bio: string,
    @Res() res: Response,
  ) {
    await this.authorsService.update(+id, { name, bio });
    return res.redirect(`/authors/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.authorsService.remove(+id);
    return res.redirect('/authors');
  }
}
