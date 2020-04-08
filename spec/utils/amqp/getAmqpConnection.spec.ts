import 'jasmine';
import * as amqp from 'amqplib';
import { getAmqpConnection } from '../../../src/utils/amqp/getAmqpConnection';

describe('getAmqpConnection', () => {
  let amqplibConnectSpy;
  
  const config = {
    port: 123,
    host: 'some-host'
  };
  
  beforeEach(() => {
    amqplibConnectSpy = spyOn(amqp, 'connect').and.returnValue('The Instance' as any);
  });
  
  it('Should call amqplib connect method with parameters', async () => {
    await getAmqpConnection(config);
    
    expect(amqplibConnectSpy).toHaveBeenCalledTimes(1);
    expect(amqplibConnectSpy).toHaveBeenCalledWith({
      hostname: config.host,
      port: config.port
    });
  });
  
  it('Should return amqp connection return value', async () => {
    const result = await getAmqpConnection(config);
    expect(result).toEqual(amqplibConnectSpy())
  });
});