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
import { BooksService } from './books.service';
import { AuthorsService } from '../authors/authors.service';

// sama kayak AuthorsController, ini Controller buat resource Book.
// butuh AuthorsService juga soalnya form tambah/edit book ada dropdown pilih author
@Controller('books')
@UseGuards(AuthGuard)
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}

  // GET /books -> list semua buku + search by judul (?q=...), tiap baris
  // udah sekalian ikut nama author-nya (relasi many-to-one)
  @Get()
  async index(@Query('q') q: string, @Res() res: Response) {
    const books = await this.booksService.findAll(q);
    return res.render('books/index', { books, q: q || '' });
  }

  // GET /books/new -> form tambah buku. perlu ambil semua author dulu
  // buat ngisi pilihan dropdown <select authorId>
  @Get('new')
  async newForm(@Res() res: Response) {
    const authors = await this.authorsService.findAll();
    return res.render('books/form', { book: null, authors, action: '/books' });
  }

  @Post()
  async create(
    @Body('title') title: string,
    @Body('year') year: string,
    @Body('authorId') authorId: string,
    @Res() res: Response,
  ) {
    await this.booksService.create({
      title,
      year: +year,
      authorId: +authorId,
    });
    return res.redirect('/books');
  }

  // GET /books/:id -> halaman detail 1 buku, sekalian nampilin nama author-nya
  @Get(':id')
  async detail(@Param('id') id: string, @Res() res: Response) {
    const book = await this.booksService.findOne(+id);
    return res.render('books/detail', { book });
  }

  @Get(':id/edit')
  async editForm(@Param('id') id: string, @Res() res: Response) {
    const book = await this.booksService.findOne(+id);
    const authors = await this.authorsService.findAll();
    return res.render('books/form', {
      book,
      authors,
      action: `/books/${id}/edit`,
    });
  }

  @Post(':id/edit')
  async update(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('year') year: string,
    @Body('authorId') authorId: string,
    @Res() res: Response,
  ) {
    await this.booksService.update(+id, {
      title,
      year: +year,
      authorId: +authorId,
    });
    return res.redirect(`/books/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.booksService.remove(+id);
    return res.redirect('/books');
  }
}
