import { WelcomeParams } from "../typeDefinition";

export type MailPayload = { subject: string; body: string };

export default ({ displayName, email }: WelcomeParams): { subject: string; body: string } => {
  return {
    subject: `PAGAMENTO FEITO`,
    body: `<p style="margin-bottom:10px; color: #666">Hello </p>
          <br/>
          <p style="margin-bottom:10px; color: #666">PAGAMENTO FEITO</p>
          <br/>
          <p style="margin-bottom:10px; color: #666"></p>
          `,
  };
};
