import * as amqp from 'amqplib';
import { AmqpConnectionConfig } from '../../../typings';

export async function getAmqpConnection(config: AmqpConnectionConfig) {
  return amqp.connect({
    hostname: config.host,
    port: config.port
  });
}
