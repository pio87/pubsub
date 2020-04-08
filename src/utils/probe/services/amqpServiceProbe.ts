import { ProbeService, AmqpConnectionConfig } from '../../../../typings';
import { getAmqpConnection } from '../../amqp/getAmqpConnection';

export function amqpServiceProbe(config: AmqpConnectionConfig): ProbeService {
  
  return {
    name: 'AMQP Service',
    probe: async () => {
      // try to establish new connection with AMQP service, it throws in case of error
      await getAmqpConnection(config);
    }
  }
}