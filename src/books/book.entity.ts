import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Author } from '../authors/author.entity';

// "Model" buat tabel book. ini sisi "many" dari relasi one-to-many sama Author
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  // foreign key ke author.id
  @Column()
  authorId: number;

  // banyak Book bisa nunjuk ke 1 Author yang sama.
  // onDelete: CASCADE -> kalo Author-nya dihapus, Book yang punya authorId itu
  // ikut terhapus otomatis (biar gak ada data book "yatim" tanpa author)
  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Author;
}
