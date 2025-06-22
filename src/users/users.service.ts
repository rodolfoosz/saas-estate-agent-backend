import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { omitPassword, omitPasswordFromArray } from 'src/utils/omit-password';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
      fullName: string;
      email: string;
      cpf: string;
      birthDate: string;
      phone: string;
      password: string;
      confirmPassword: string;
      cep: string;
      address: string;
      addressNumber: string;
  }): Promise<Omit<User, 'password'>> {
    const { confirmPassword, password, ...rest } = data;

    console.error('Creating user with data:', data);

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.error('Hashed password:', hashedPassword);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        birthDate: new Date(rest.birthDate),
      },
    });

    return omitPassword(user);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return omitPasswordFromArray(users);
  }

  async findOne(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? omitPassword(user) : null;
  }

  async update(id: number, data: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({ where: { id }, data });
    return omitPassword(user);
  }

  async remove(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.delete({ where: { id } });
    return omitPassword(user);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
