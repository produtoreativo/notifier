import * as sgMail from "@sendgrid/mail";
import { init as InitLogger, Logger } from "../../../app/logger";

export class Mail {
  private log: Logger;

  constructor(log) {
    this.log = log;
  }

  send = async ({
    from,
    to,
    subject,
    body,
  }: {
    from: string;
    to: string;
    subject: string;
    body: string;
  }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from,
      subject,
      text: body,
      html: body,
      templateId: "6b7b1013-b2bb-41dc-b4df-c333647d546d",
      substitutions: {
        subject,
        text: body,
        html: body,
      },
    };

    try {
      return await sgMail.send(msg);
    } catch (error) {
      this.log.warn("Sendgrid failed to send email");
      this.log.warn(error);
      throw error;
    }
  };
}

let instance;

const newInstance = () => {
  const log = InitLogger();

  instance = new Mail(log);
};

export const init = (): Mail => {
  if (!instance) {
    newInstance();
  }

  return instance;
};

export default { init };
