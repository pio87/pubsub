import 'jasmine';
import * as consumerMethods from '../../../../src/modules/events/handlers/consumer';
import createSpy = jasmine.createSpy;

describe('consumer', () => {
  const channelName = 'channel-name';
  let fakeChannel: any;
  let fakeConsumerMessageHandler: any;
  
  beforeEach(() => {
    fakeChannel = {
      prefetch: createSpy(),
      consume: createSpy()
    };
    fakeConsumerMessageHandler = spyOn(consumerMethods, 'consumerMessageHandler').and.returnValue('handler' as any);
  });
  
  it('Calls prefetch on amqp service', async () => {
    await consumerMethods.consumer(fakeChannel, channelName)({} as any);
    
    expect(fakeChannel.prefetch).toHaveBeenCalledWith(1);
    expect(fakeChannel.prefetch).toHaveBeenCalledTimes(1);
  });
  
  it('Calls consume method with parameters', async () => {
    
    await consumerMethods.consumer(fakeChannel, channelName)({} as any);
    
    expect(fakeChannel.consume).toHaveBeenCalledTimes(1);
    expect(fakeChannel.consume).toHaveBeenCalledWith(channelName, fakeConsumerMessageHandler());
  });
});

describe('consumerMessageHandler', () => {
  let fakeLogger: any;
  let fakeChannel: any;
  let fakeJsonParse: any;
  let fakeMessage: any;
  
  beforeEach(() => {
    fakeJsonParse = spyOn(JSON, 'parse');
    fakeMessage = {
      content: {
        toString: createSpy().and.returnValue('"some content"')
      }
    };
    fakeChannel = {
      ack: createSpy()
    };
    fakeLogger = {
      queue: createSpy(),
      warn: createSpy()
    };
  });
  
  it('Logs a warning when received message is falsy', async () => {
    await consumerMethods.consumerMessageHandler(fakeChannel, fakeLogger)(null);
    
    expect(fakeLogger.warn).toHaveBeenCalledTimes(1);
    expect(fakeLogger.warn).toHaveBeenCalledWith('Received falsy message, ignoring.');
  });
  
  it('Calls toString() on received message to convert it from buffer', async () => {
    await consumerMethods.consumerMessageHandler(fakeChannel, fakeLogger)(fakeMessage);
    
    expect(fakeMessage.content.toString).toHaveBeenCalledTimes(1);
  });
  
  it('Calls JSON.parse method to get the real value type of a message data', async () => {
    await consumerMethods.consumerMessageHandler(fakeChannel, fakeLogger)(fakeMessage);
    
    expect(fakeJsonParse).toHaveBeenCalledTimes(1);
    expect(fakeJsonParse).toHaveBeenCalledWith(fakeMessage.content.toString.calls.mostRecent().returnValue);
  });
  
  it('Calls ack method on amqp service to acknowledge given message', async () => {
    await consumerMethods.consumerMessageHandler(fakeChannel, fakeLogger)(fakeMessage);
    
    expect(fakeChannel.ack).toHaveBeenCalledTimes(1);
    expect(fakeChannel.ack).toHaveBeenCalledWith(fakeMessage);
  });
  
  it('Logs info about received message to the console with queue label', async () => {
    fakeJsonParse.and.returnValue(50);
    
    await consumerMethods.consumerMessageHandler(fakeChannel, fakeLogger)(fakeMessage);
    
    expect(fakeLogger.queue).toHaveBeenCalledTimes(1);
    expect(fakeLogger.queue).toHaveBeenCalledWith(
      `Received message (number):`, 50
    );
  });
});