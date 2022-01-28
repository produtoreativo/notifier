import * as dotenv from "dotenv";
dotenv.config({ path: process.env.DOTENV_PATH || undefined });

import { init as InitLogger } from "./logger";
import signal from "./signal";

import fastifyInit from "../driver/http/fastify";
import kafka from "../driver/queue/kafka";

import api from "../delivery/api";
import workerKafka from "../delivery/worker/kafka";

let log;

/**
 * Main application execution
 * @async
 */
const main = async () => {
  try {
    // Kafka
    const kafkaInstance = await kafka.init();
    await kafka.producerConnection(kafkaInstance);
    const consumerCnn = await kafka.consumerConnection(kafkaInstance);
    await workerKafka.initConsumers(consumerCnn);

    // Http Server
    fastifyInit
      .create()
      .then(({ router }) => {
        // Initialize API Rest
        api.init(router);
        // Apply callbacks
        process.on("SIGTERM", signal.shutdown);
        process.on("SIGINT", signal.shutdown);
        // Listen
        router.listen(process.env.PORT || 3001, process.env.SERVER_HOST, (err?) => {
          if (err) {
            throw err;
          }

          log.info(
            `notifier is running at http://${process.env.SERVER_HOST}:${process.env.PORT} in ${process.env.PORT} mode ${process.env.NODE_ENV}`,
          );
        });
      })
      .catch((e) => {
        log.error(e.message);
        process.exit(1);
      });
  } catch (e) {
    log.error(e.message);
    process.exit(1);
  }
};

/**
 * Start application
 * @async
 */
const run = () => {
  log = InitLogger();
  main();
};

// Start
run();
