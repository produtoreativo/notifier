export type MailProvider = {
  type: "Mail";
  from?: string;
  to: string;
};

export type Provider = MailProvider