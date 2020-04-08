import 'jasmine';
import { makeEventsHandlers } from '../../../src/modules/events/makeEventsHandlers';
import * as getAmqpConnection from '../../../src/utils/amqp/getAmqpConnection';
import createSpy = jasmine.createSpy;
import { env } from '../../../src/config/env';
import * as consumer from '../../../src/modules/events/handlers/consumer';
import * as publisher from '../../../src/modules/events/handlers/publisher';

describe('makeEventsHandlers', () => {
  let getAmqpConnectionSpy;
  let channelSpy;
  let assertQueueSpy;
  let consumerSpy;
  let publisherSpy;
  
  const config = {
    host: 'some-host',
    port: 123
  };
  
  beforeEach(() => {
    consumerSpy = spyOn(consumer, 'consumer');
    publisherSpy = spyOn(publisher, 'publisher');
    
    assertQueueSpy = createSpy();
    
    channelSpy = createSpy().and.returnValue({ assertQueue: assertQueueSpy });
    
    getAmqpConnectionSpy = spyOn(getAmqpConnection, 'getAmqpConnection').and.resolveTo({
      createChannel: channelSpy
    } as any)
  });
  
  it('Calls getAmqpConnection', async () => {
    await makeEventsHandlers(config);
    
    expect(getAmqpConnectionSpy).toHaveBeenCalledTimes(1);
    expect(getAmqpConnectionSpy).toHaveBeenCalledWith(config);
  });
  
  it('Creates a channel object for handlers', async () => {
    await makeEventsHandlers(config);
    
    expect(channelSpy).toHaveBeenCalledTimes(1);
  });
  
  it('Makes sure that queue exists on amqp service', async () => {
    await makeEventsHandlers(config);
    
    expect(assertQueueSpy).toHaveBeenCalledTimes(1);
    expect(assertQueueSpy).toHaveBeenCalledWith(env.AMQP.CHANNEL_NAME, { durable: true });
  });
  
  it('Returns back all handlers', async () => {
    const handlers = await makeEventsHandlers(config);
    
    expect(consumerSpy).toHaveBeenCalledTimes(1);
    expect(consumerSpy).toHaveBeenCalledWith(
      channelSpy(),
      env.AMQP.CHANNEL_NAME
    );
    
    expect(publisherSpy).toHaveBeenCalledTimes(1);
    expect(consumerSpy).toHaveBeenCalledWith(
      channelSpy(),
      env.AMQP.CHANNEL_NAME
    );
    
    expect(Object.keys(handlers)).toEqual([
      'publisher',
      'consumer'
    ])
  });
});