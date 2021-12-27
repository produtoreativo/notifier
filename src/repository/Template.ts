// Welcome templates
import { WelcomeParams } from "../domain/Template/Welcome/typeDefinition";
import welcomeMailTemplate from "../domain/Template/Welcome/byProvider/Mail";

export type TemplateParams = { template: "welcome"; params: WelcomeParams }


export class TemplateRepository {
  public useTemplateForMail = (templateParams: TemplateParams) => {
    if (templateParams.template === "welcome") {
      return welcomeMailTemplate(templateParams.params);
    }
  };
}

export const init = () => {
  return new TemplateRepository();
};

export default init;
