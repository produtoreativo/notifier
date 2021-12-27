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
      from: "fabriciolopesvital@gmail.com",
      subject,
      text: body,
      html: body,
      templateId: "9c7b3317-9d10-4bc8-89af-63196e82bf05",
      substitutions: {
        subject,
        text: body,
        html: body,
      },
    };

    try {
      return await sgMail.send(msg);
    } catch (error) {
      console.error(error.response.body);
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
