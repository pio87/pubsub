import 'jasmine';
import { amqpServiceProbe } from '../../../../src/utils/probe/services/amqpServiceProbe';
import * as getAmqpConnection from '../../../../src/utils/amqp/getAmqpConnection';

describe('amqpServiceProbe', () => {
  let getAmqpConnectionSpy;
  
  beforeEach(() => {
    getAmqpConnectionSpy = spyOn(getAmqpConnection, 'getAmqpConnection');
  });
  
  it('Calls getAmqpConnection method to determine if ampq service is alive', async () => {
    const config: any = { config: 'yup' };
    
    const result = amqpServiceProbe(config);
  
    await result.probe();
  
    expect(getAmqpConnectionSpy).toHaveBeenCalledTimes(1);
    expect(getAmqpConnectionSpy).toHaveBeenCalledWith(config);
    
  });
  
  it('Returns a probe object for amqp service', async () => {
    const result = amqpServiceProbe({ } as any);
    
    expect(result.name).toEqual('AMQP Service');
    expect(typeof result.probe).toBe('function');
  });
});