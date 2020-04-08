import * as amqp from 'amqplib';
import { Logger } from '../../../utils/logger/logger';

export const consumer = (channel: amqp.Channel, channelName: string) => async (logger: Logger) => {
  // Prefetch just one message for now
  await channel.prefetch(1);
  
  // initialize consumer on given channel
  await channel.consume(channelName, consumerMessageHandler(channel, logger));
};

export const consumerMessageHandler = (channel: amqp.Channel, logger: Logger) => async (message) => {
  if (message) {
    // buffer to string
    const content = message.content.toString();
    
    // parse string content to get real data type
    const parsed = JSON.parse(content);
    
    // we got the message, thanks
    channel.ack(message);
    
    // logging to console with queue label
    logger.queue(`Received message (${typeof parsed}):`, parsed);
  } else {
    logger.warn('Received falsy message, ignoring.');
  }
};