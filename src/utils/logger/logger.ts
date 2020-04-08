import * as winston from 'winston';
import { env } from '../../config/env';
import { parseMessages } from './parseMessages';
import { LoggerLevel, loggerLevels } from './types';

/**
 * colors for the log levels, should always contain
 * definition for all the levels defined
 */
const colors: { [level in LoggerLevel]: string } = {
  error: 'bold underline red',
  warn: 'bold yellow',
  queue: 'bold magenta',
  info: 'bold cyan',
  debug: 'bold blue'
};

/**
 * util function to satisfy typescript
 */
function createWinstonLogger<T>(
  options?: Pick<winston.LoggerOptions, Exclude<keyof winston.LoggerOptions, 'levels'>> & { levels: T }
) {
  return winston.createLogger(options) as winston.Logger & Record<keyof T, winston.LeveledLogMethod>;
}

export function getLogLevel() {
  // show only errors in test env
  if (env.NODE_ENV === 'test') {
    return '0';
  }

  if (env.LOG_LEVEL) {
    return env.LOG_LEVEL;
  }

  if (env.NODE_ENV === 'production') {
    return 'info';
  }

  return 'debug';
}

/**
 * winston logger instance
 * used as a dependency to our logger util
 */
export const winstonLogger = createWinstonLogger({
  levels: loggerLevels,
  level: getLogLevel(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`)
      )
    })
  ]
});

winston.addColors(colors);

const appLogger: (w: typeof winstonLogger) => { [level in LoggerLevel]: (...messages: any[]) => void } = w => ({
  error: (...messages) => {
    w.error(parseMessages(...messages));
  },
  warn: (...messages) => {
    w.warn(parseMessages(...messages));
  },
  queue: (...messages) => {
    w.queue(parseMessages(...messages));
  },
  info: (...messages) => {
    w.info(parseMessages(...messages));
  },
  debug: (...messages) => {
    w.debug(parseMessages(...messages));
  }
});

const logger = appLogger(winstonLogger);

export type Logger = typeof logger;

export default logger;
