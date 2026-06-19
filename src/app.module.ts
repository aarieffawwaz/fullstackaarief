import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { Author } from './authors/author.entity';
import { Book } from './books/book.entity';

// catatan: ini module utama, semua module lain didaftarin disini
@Module({
  imports: [
    // pake sqlite biar gak usah install database server / docker, tinggal jalan aja
    // synchronize: true artinya tabel di db dibuat/diupdate otomatis sesuai entity
    // (enak buat development, tapi kalo udah production sebaiknya dimatiin & pake migration)
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Author, Book],
      synchronize: true,
    }),
    AuthModule, // module login + guard
    AuthorsModule, // module CRUD Author (tabel 1, relasi one to many ke Book)
    BooksModule, // module CRUD Book (tabel 2)
  ],
  controllers: [AppController],
})
export class AppModule {}
