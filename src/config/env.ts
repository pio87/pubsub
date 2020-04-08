import * as Joi from '@hapi/joi';
import 'joi-extract-type';
import { LoggerLevel, loggerLevels } from '../utils/logger/types';

require('dotenv').config();

const toNumberOrUndefined = (value: string | undefined) =>
  (value === '' || isNaN(Number(value)) ? undefined : Number(value)) as number;

const envValidation = Joi.object({
  NODE_ENV: Joi
    .string()
    .valid('test', 'development', 'production')
    .required(),
  LOG_LEVEL: Joi
    .string()
    .valid(...(Object.keys(loggerLevels) as LoggerLevel[]))
    .default('info'),
  AMQP: Joi
    .object({
      PORT: Joi
        .number()
        .min(1024)
        .max(65535)
        .required(),
      HOST: Joi.string().required(),
      FREQUENCY: Joi.number().required(),
      CHANNEL_NAME: Joi.string().default('pub-sub-events'),
    })
    .required()
});

/**
 * @var env
 * Contains various environmental variables,
 * mapped from the .env file found in the main project directory.
 */
export type EnvVars = Joi.extractType<typeof envValidation>;

export let env: EnvVars;

env = {
  NODE_ENV: process.env.NODE_ENV as 'test' | 'development' | 'production',
  LOG_LEVEL: process.env.LOG_LEVEL as LoggerLevel,
  
  AMQP: {
    PORT: toNumberOrUndefined(process.env.AMQP_PORT),
    HOST: process.env.AMQP_HOST as string,
    FREQUENCY: toNumberOrUndefined(process.env.AMQP_FREQUENCY),
    CHANNEL_NAME: process.env.AMQP_CHANNEL_NAME as string
  }
};

if (process.env.NODE_ENV === 'test') {
  env = {
    LOG_LEVEL: 'debug',
    NODE_ENV: 'test',
    AMQP: {
      HOST: 'queue-host',
      PORT: 4567,
      FREQUENCY: 280,
      CHANNEL_NAME: 'channel-name'
    }
  };
}

const { error, value } = envValidation.validate(env);
env = value;

if (error) {
  throw new Error(`Required ENV variable not set, details: ${error.message}`);
}
