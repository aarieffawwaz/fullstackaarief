import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';

// daftarin Author entity ke TypeORM (forFeature), terus daftarin
// controller & service-nya. exports AuthorsService biar BooksModule bisa pakai
// (buat ambil daftar author pas isi dropdown form book)
@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
