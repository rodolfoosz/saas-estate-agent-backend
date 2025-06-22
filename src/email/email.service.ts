import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private loadTemplate(fileName: string, data: any): string {
    const templatePath = path.join(__dirname, 'templates', fileName);
    const template = fs.readFileSync(templatePath, 'utf8');
    return Mustache.render(template, data);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const html = this.loadTemplate('welcome-email.html', { name });

    try {
      const result = await this.resend.emails.send({
        from: 'Casaé Application<onboarding@resend.dev>',
        to,
        subject: 'Bem-vindo ao Casaé!',
        html,
      });

      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new InternalServerErrorException('Erro ao enviar o e-mail');
    }
  }


  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    try {
      const subject = 'Recuperação de Senha - Casaé';
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Recuperação de senha</h2>
          <p>Você solicitou a recuperação da sua senha.</p>
          <p>Clique no botão abaixo para redefinir sua senha:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; border-radius: 5px; text-decoration: none;">
            Redefinir Senha
          </a>
          <p>Se você não solicitou isso, apenas ignore este e-mail.</p>
          <p>Equipe Casaé</p>
        </div>
      `;

      await this.resend.emails.send({
        from: 'noreply@resend.dev',
        to,
        subject,
        html,
      });

      this.logger.log(`E-mail de recuperação enviado para ${to}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
