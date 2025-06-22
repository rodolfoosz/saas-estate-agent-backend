import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post()
  async reset(@Body() dto: ResetPasswordDto) {
    await this.passwordResetService.resetPassword(dto.token, dto.password, dto.confirmPassword);
    return { message: 'Senha redefinida com sucesso.' };
  }

  @Post('request')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.passwordResetService.requestResetPassword(body.email)
    return { message: 'E-mail enviado com sucesso (se estiver cadastrado)' }
  }
}
