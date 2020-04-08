/**
 * log levels available in the app logger
 */
export const loggerLevels = {
  error: 0,
  warn: 1,
  queue: 2,
  info: 3,
  debug: 4
};

export type LoggerLevel = keyof typeof loggerLevels;
