import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Author } from './author.entity';

// ini "Service", posisinya jadi repository layer -> yang ngomong langsung
// sama database lewat TypeORM. controller gak perlu tau caranya query,
// tinggal panggil method disini aja
@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  // kalo ada parameter search, query pake ILike (LIKE tapi case-insensitive)
  // jadi "tere" bisa ketemu "Tere Liye" juga
  findAll(search?: string): Promise<Author[]> {
    if (search) {
      return this.authorRepo.find({
        where: { name: ILike(`%${search}%`) },
        order: { id: 'DESC' },
      });
    }
    return this.authorRepo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepo.findOne({
      where: { id },
      relations: ['books'], // sekalian ambil buku2 nya buat ditampilin di halaman detail
    });
    // error handling: kalo id nya gak ada di db, lempar 404 -> kepake juga
    // di update() & remove() di bawah biar gak nge-update/hapus data yg gak ada
    if (!author) {
      throw new NotFoundException(`Author #${id} tidak ditemukan`);
    }
    return author;
  }

  create(data: Partial<Author>): Promise<Author> {
    const author = this.authorRepo.create(data);
    return this.authorRepo.save(author);
  }

  async update(id: number, data: Partial<Author>): Promise<Author> {
    const author = await this.findOne(id);
    Object.assign(author, data);
    return this.authorRepo.save(author);
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    await this.authorRepo.remove(author);
  }
}
