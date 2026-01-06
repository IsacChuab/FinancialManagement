import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

class EmailSender {
  private from: string;
  private client: Resend;

  constructor() {
    const { RESEND_API_KEY, MAIL_FROM } = process.env;

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is missing');
    }

    if (!MAIL_FROM) {
      throw new Error('MAIL_FROM is missing');
    }

    this.from = MAIL_FROM;
    this.client = new Resend(RESEND_API_KEY);
  }

  loadTemplate(templateName: string) {
    const templatePath = path.resolve(process.cwd(), 'src/lib/emailTemplates', templateName);

    return fs.readFileSync(templatePath, 'utf-8');
  }

  parseTemplate(template: string, variables: Record<string, string | number>) {
    let html = template;

    Object.entries(variables).forEach(([key, value]) => {
      html = html.replaceAll(`{{${key}}}`, String(value));
    });

    return html;
  }

  async sendRecoveryEmail({ to, code }: { to: string; code: string }) {
    const template = this.loadTemplate('recoveryPassword.html');

    const html = this.parseTemplate(template, {
      code,
    });

    await this.client.emails.send({
      from: this.from,
      to,
      subject: 'Recuperação de senha',
      html,
    });
  }
}

export default new EmailSender();
