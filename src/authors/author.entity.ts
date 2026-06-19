import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../books/book.entity';

// ini "Model" nya buat tabel author (MVC). 1 baris di entity = 1 kolom di tabel
@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  // relasi one-to-many: 1 Author bisa punya banyak Book.
  // sisi "many" nya ada di Book (lihat book.entity.ts, ada @ManyToOne)
  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
