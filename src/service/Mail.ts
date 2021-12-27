import { init as InitMailer, Mail } from "../driver/mail/sendgrid";
import { init as InitLogger } from "../app/logger";

export class MailService {
  private log: any;
  private mailer: Mail;

  constructor({ log, mailer }) {
    this.mailer = mailer;
    this.log = log;
  }

  public send = async (params: {
    from: string;
    to: string;
    subject: string;
    body: string;
  }): Promise<undefined> => {
    try {
      const response = await this.mailer.send(params);
      this.log.info("Email sent with response");
      this.log.info(JSON.stringify(response));
      return;
    } catch (error) {
      this.log.warn(`Error while trying to send email with params:`);
      this.log.warn(JSON.stringify(params));
      this.log.warn(error.stack);
      throw error;
    }
  };
}

export const init = () => {
  const log = InitLogger();
  const mailer = InitMailer();

  return new MailService({ log, mailer });
};

export default init;
