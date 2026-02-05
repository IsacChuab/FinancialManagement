import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { MAIL_FROM, RESEND_API_KEY } from '../config.js';

class EmailSender {
  private from: string;
  private client: Resend;

  constructor() {
    this.from = MAIL_FROM;
    this.client = new Resend(RESEND_API_KEY);
  }

  loadTemplate(templateName: string) {
    const templatePath = path.resolve(process.cwd(), 'public/emailTemplates', templateName);

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
      subject: 'Recovery Your Password',
      html,
    });
  }
}

export default new EmailSender();
