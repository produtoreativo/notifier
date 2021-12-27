import { Kafka } from "kafkajs";

let client;
let hash;
hash = new Date().getTime();

const KafkaClient = () => {
  client = new Kafka({
    clientId: "notifier",
    brokers: process.env.KAFKA_BROKER_LIST.split(","),
    ssl: true,
    sasl: {
      mechanism: "scram-sha-256",
      username: process.env.KAFKA_BROKER_USERNAME,
      password: process.env.KAFKA_BROKER_PASSWORD,
    },
  });
};

/**
 * setProducer
 * @param setProducer
 */
const producerConnection = async (kafka) => {
  if (!client) {
    KafkaClient();
  }

  const producer = kafka.producer();
  await producer.connect();
  client.producer = producer;

  return client;
};

/**
 * setConsumer
 * @param setConsumer
 */
export const consumerConnection = async (kafka) => {
  if (!client) {
    KafkaClient();
  }

  const consumer = kafka.consumer({
    groupId: process.env.NODE_ENV === "development" ? "development-notifier" : "notifier",
  });
  await consumer.connect();

  return consumer;
};

export const init = () => {
  if (!client) {
    // tslint:disable-next-line: no-floating-promises
    KafkaClient();
  }
  return client;
};

export default { init, producerConnection, consumerConnection };
