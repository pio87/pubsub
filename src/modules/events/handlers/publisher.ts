import * as amqp from 'amqplib';
import { generateRandomDataModel } from '../../../utils/data/generateRandomDataModel';

export const publisher = (channel: amqp.Channel, channelName: string) => async () => {
  
  // generate random data model with util function
  const randomDataModel = generateRandomDataModel();
  
  // parse data model to proper format and send it to queue
  channel.sendToQueue(
    channelName,
    Buffer.from(JSON.stringify(randomDataModel)),
    {
      contentType: 'application/json',
      persistent: true
    }
  );
};