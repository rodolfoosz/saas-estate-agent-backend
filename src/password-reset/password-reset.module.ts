import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PasswordResetController],
  providers: [PasswordResetService, EmailService, PrismaService]
})
export class PasswordResetModule {}
