import 'jasmine';
import { init } from '../src';
import logger from '../src/utils/logger/logger';
import * as makeEventsHandlers from '../src/modules/events/makeEventsHandlers';
import * as amqpServiceProbe from '../src/utils/probe/services/amqpServiceProbe';
import * as probeAllServices from '../src/utils/probe/probe';
import { env } from '../src/config/env';

describe('application init', () => {
  let loggerSpy;
  let makeEventsHandlersSpy;
  let amqpServiceProbeSpy;
  let probeAllServicesSpy;
  
  beforeEach(() => {
    loggerSpy = {
      debug: spyOn(logger, 'debug'),
      info: spyOn(logger, 'info'),
      queue: spyOn(logger, 'queue'),
      warn: spyOn(logger, 'warn'),
      error: spyOn(logger, 'error')
    };
    makeEventsHandlersSpy = spyOn(makeEventsHandlers as any, 'makeEventsHandlers').and.returnValue({
      consumer: () => {
      },
      publisher: () => {
      }
    });
    
    amqpServiceProbeSpy = spyOn(amqpServiceProbe, 'amqpServiceProbe');
    probeAllServicesSpy = spyOn(probeAllServices, 'probeAllServices');
  });
  
  it('Should use logger info level for init messages', async () => {
    await init();
    
    expect(loggerSpy.debug).not.toHaveBeenCalled();
    expect(loggerSpy.queue).not.toHaveBeenCalled();
    expect(loggerSpy.warn).not.toHaveBeenCalled();
    expect(loggerSpy.error).not.toHaveBeenCalled();
    expect(loggerSpy.info).toHaveBeenCalled();
  });
  
  it('Should call makeEventsHandlers method with configuration parameters from .env', async () => {
    await init();
    
    expect(makeEventsHandlersSpy).toHaveBeenCalledTimes(1);
    expect(makeEventsHandlersSpy).toHaveBeenCalledWith({
      host: env.AMQP.HOST,
      port: env.AMQP.PORT
    });
  });
  
  it('Should call correct number of publishers basing on given frequency', async () => {
    jasmine.clock().install();
    const publisherSpy = spyOn(makeEventsHandlersSpy(), 'publisher');
    
    await init();
    
    expect(publisherSpy).toHaveBeenCalledTimes(0);
  
    jasmine.clock().tick(1000);
    expect(publisherSpy).toHaveBeenCalledTimes(env.AMQP.FREQUENCY);
    
    jasmine.clock().uninstall();
  });
  
  it('Should call consumer handler', async () => {
    const consumerSpy = spyOn(makeEventsHandlersSpy(), 'consumer');
    
    await init();
    
    expect(consumerSpy).toHaveBeenCalledTimes(1);
    expect(consumerSpy).toHaveBeenCalledWith(loggerSpy);
  });
});