import { publisher } from './handlers/publisher';
import { consumer } from './handlers/consumer';
import { env } from '../../config/env';
import { getAmqpConnection } from '../../utils/amqp/getAmqpConnection';
import { AmqpConnectionConfig } from '../../../typings';

export const makeEventsHandlers = async (config: AmqpConnectionConfig) => {
  const connection = await getAmqpConnection(config);
  
  const channel = await connection.createChannel();
  await channel.assertQueue(env.AMQP.CHANNEL_NAME, { durable: true });
  
  return {
    publisher: publisher(channel, env.AMQP.CHANNEL_NAME),
    consumer: consumer(channel, env.AMQP.CHANNEL_NAME)
  }
};
