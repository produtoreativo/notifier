import InitNotificationConsumer from "./consumer/NotificationConsumer";

/**
 * Initialize all consumers
 */
export const initConsumers = async (consumerCnn) => {
  await InitNotificationConsumer(consumerCnn);
};

export default { initConsumers };
