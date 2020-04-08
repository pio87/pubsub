import { ProbeService } from '../../../typings';
import logger from '../logger/logger';
import { sleep } from '../sleep/sleep';

export const probeAllServices = async (services: ProbeService[]) => {
  
  // Recursive function to send probes until they landed on each service
  const sendProbe = async (service: ProbeService, retryCount: number) => {
    try {
      await service.probe();
    } catch (e) {
      await sleep(2000);
      logger.warn(`Probe did not successfully landed on '${service.name}'. Retrying... (${retryCount})`);
      await sendProbe(service, retryCount + 1);
    }
  };

  // Loop through all services and send probe to each of them one by one
  for (const service of services) {
    logger.info(`Probing service: '${service.name}'`);
    await sendProbe(service, 0);
    logger.info(`Probe successfully landed on: '${service.name}'`);
  }
};