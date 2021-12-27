// Import services
import { init as InitMailService, MailService } from "../service/Mail";

import { Provider } from "../domain/Provider";

import {
  init as InitTemplateRepository,
  TemplateRepository,
  TemplateParams,
} from "../repository/Template";

type NotificationRequest = {
  providers: Provider[];
  templateParams: TemplateParams;
};

export class NotificationUseCase {
  private mailService: MailService;
  private templateRepository: TemplateRepository;

  constructor({
    mailService,
    templateRepository
  }) {
    this.mailService = mailService;
    this.templateRepository = templateRepository;
  }

  public handleNotifyRequest = async (notificationRequest: NotificationRequest): Promise<void> => {
    const { providers, templateParams } = notificationRequest;

    const promises = providers.map(async (provider) => {
      if (provider.type === "Mail") {
        const { from = process.env.SENDGRID_MAILFROM, to } = provider;
        const { subject, body } = this.templateRepository.useTemplateForMail(templateParams);
        this.mailService.send({ from, to, subject, body })
      }
    });

    await Promise.all(promises);
  };
}

export const init = () => {
  const mailService = InitMailService();
  const templateRepository = InitTemplateRepository();

  return new NotificationUseCase({
    mailService,
    templateRepository
  });
};

export default init;
