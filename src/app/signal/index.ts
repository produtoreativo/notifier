import { init as InitLogger } from "../logger";

/**
 * Terminate application.
 */
const exit = () => {
  const logger = InitLogger();
  logger.log({
    message: "Exit application",
    level: "warn",
    tag: "exit",
  });
  process.exit(1);
};

/**
 * Stop all executions
 *
 * @example
 * ```typescript
 * process.on('SIGTERM', signal.shutdown);
 * process.on('SIGINT', signal.shutdown));
 * ```
 */
export const shutdown = () => exit();

export default { shutdown };
