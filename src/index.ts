import { env } from './config/env';
import logger from './utils/logger/logger';
import { makeEventsHandlers } from './modules/events/makeEventsHandlers';
import { amqpServiceProbe } from './utils/probe/services/amqpServiceProbe';
import { probeAllServices } from './utils/probe/probe';

export async function init() {
  logger.info('Starting event pub-sub system...');
  
  logger.info('Initializing event handlers.');
  const eventHandlers = await makeEventsHandlers({
    host: env.AMQP.HOST,
    port: env.AMQP.PORT
  });
  logger.info('Initializing event handlers - SUCCESS.');
  
  logger.info('Starting publisher.');
  setInterval(eventHandlers.publisher, 1000 / env.AMQP.FREQUENCY);
  logger.info('Starting publisher - SUCCESS.');

  logger.info('Starting consumer.');
  await eventHandlers.consumer(logger);
  logger.info('Starting consumer - SUCCESS.');
  
  
  logger.info('System is operational, good to go!');
  logger.info('Default RabbitMQ interface available at http://localhost:15672/');
}

if (env.NODE_ENV !== 'test') {
  
  // Put here another AMQP service instance, postgres, redis, etc.
  const requiredServices = [
    amqpServiceProbe({
      host: env.AMQP.HOST,
      port: env.AMQP.PORT
    })
  ];
  
  // Wait for all services to be alive and operational before starting our worker
  probeAllServices(requiredServices)
    .then(init)
    .catch(e => logger.error('System could not be started!', e.message))
}
