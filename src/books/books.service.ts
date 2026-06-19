import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Book } from './book.entity';

// Service / repository layer buat Book. logic query db ditaruh disini semua
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  // search by judul (case-insensitive), relations: ['author'] supaya
  // pas di view bisa langsung akses book.author.name tanpa query lagi
  findAll(search?: string): Promise<Book[]> {
    if (search) {
      return this.bookRepo.find({
        where: { title: ILike(`%${search}%`) },
        relations: ['author'],
        order: { id: 'DESC' },
      });
    }
    return this.bookRepo.find({ relations: ['author'], order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    // sama kayak di AuthorsService, error handling basic: gak ketemu -> 404
    if (!book) {
      throw new NotFoundException(`Book #${id} tidak ditemukan`);
    }
    return book;
  }

  create(data: Partial<Book>): Promise<Book> {
    const book = this.bookRepo.create(data);
    return this.bookRepo.save(book);
  }

  async update(id: number, data: Partial<Book>): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, data);
    return this.bookRepo.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
  }
}
