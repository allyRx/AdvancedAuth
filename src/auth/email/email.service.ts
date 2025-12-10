import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private sendGridFromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');

    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY manquant dans .env');
    }
    if (!fromEmail) {
      throw new Error('SENDGRID_FROM_EMAIL manquant dans .env');
    }

    sgMail.setApiKey(apiKey);
    this.sendGridFromEmail = fromEmail;
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const msg = {
      to: email,
      from: this.sendGridFromEmail,
      subject: '✅ Vérifiez votre email',
      text: `Votre code de vérification est : ${code}`,
      html: `<p>Votre code de vérification est : <strong>${code}</strong></p>`,
    };

    try {
      await sgMail.send(msg);
      console.log(`Code envoyé à ${email}`);
    } catch (error) {
      console.error('Erreur SendGrid :', error.response?.body || error.message);
      throw new Error('Échec de l’envoi du code.');
    }
  }
}