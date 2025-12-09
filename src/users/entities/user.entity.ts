// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // nom de la table en base de données
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ unique: true }) 
  email: string;

  @Column({ nullable: true }) 
  password?: string;

  @Column({ default: false })
  isEmailVerified: boolean; 

  @Column({ default: 'local' }) 
  provider: string;

  @Column({ nullable: true })
  googleId?: string; 
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}