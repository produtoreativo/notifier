import { init as InitLogger } from "../../../../app/logger";
import {
  init as InitNotificationUseCase,
  NotificationUseCase,
} from "../../../../usecase/Notification";

import { NOTIFICATION_CREATED } from "../topics";

/**
 * Producer User actions
 * @param consumer kafka Connection
 */
export class NotificationConsumer {
  private consumerCnn;
  private notificationUseCase: NotificationUseCase;
  private log;

  constructor({ consumerCnn, notificationUseCase, log }) {
    this.consumerCnn = consumerCnn;
    this.notificationUseCase = notificationUseCase;
    this.log = log;
  }

  public subscribe = async () => {
    try {
      await this.consumerCnn.subscribe({ topic: NOTIFICATION_CREATED });

      await this.consumerCnn.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.notificationUseCase.handleNotifyRequest(JSON.parse(message.value.toString()));
        },
      });
    } catch (error) {
      this.log.error(error);
    }
  };
}

/**
 * Auto creator for dependency injection
 * @returns
 */
export const init = async (consumerCnn) => {
  const log = InitLogger();
  const notificationUseCase = InitNotificationUseCase();
  const userActionConsumer = new NotificationConsumer({ consumerCnn, notificationUseCase, log });
  await userActionConsumer.subscribe();
};

export default init;
