import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { omitPassword, omitPasswordFromArray } from 'src/common/utils/omit-password';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UsersService.name);

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
    this.logger.log(`Tentando criar usuário com e-mail: ${data.email}`);

    if (password !== confirmPassword) {
      this.logger.warn(`Senhas não coincidem para o e-mail: ${data.email}`);
      throw new BadRequestException('As senhas não coincidem');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      this.logger.debug(`Senha criptografada com sucesso para ${data.email}`);

      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          birthDate: new Date(rest.birthDate),
        },
      });

      this.logger.log(`Usuário criado com sucesso: ID ${user.id}, email: ${user.email}`);
      return omitPassword(user);
    } catch (error) {
      this.logger.error(
        `Erro ao criar usuário com e-mail: ${data.email}`,
        error.stack || JSON.stringify(error),
      );
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
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
