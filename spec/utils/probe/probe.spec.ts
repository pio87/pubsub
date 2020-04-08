import 'jasmine';
import { probeAllServices } from '../../../src/utils/probe/probe';
import logger from '../../../src/utils/logger/logger';
import * as sleep from '../../../src/utils/sleep/sleep';

describe('probeAllServices', () => {
  let loggerSpy;
  let marsProbe;
  let venusProbe;
  let sleepSpy;
  
  beforeEach(() => {
    sleepSpy = spyOn(sleep, 'sleep').and.callThrough();
    loggerSpy = {
      info: spyOn(logger, 'info'),
      warn: spyOn(logger, 'warn')
    };
  
    marsProbe = {
      name: 'Mars probe',
      probe: async () => {}
    };
  
    venusProbe = {
      name: 'Venus probe',
      probe: async () => {}
    };
  });
  
  it('Calls probe method on every passed service object', async () => {
    const marsSpy = spyOn(marsProbe, 'probe');
    const venusSpy = spyOn(venusProbe, 'probe');
    
    await probeAllServices([marsProbe, venusProbe]);
    
    expect(marsSpy).toHaveBeenCalledTimes(1);
    expect(venusSpy).toHaveBeenCalledTimes(1);
  });
  
  it('Logs out info about sending probe and successful landing', async () => {
    await probeAllServices([marsProbe, venusProbe]);
    
    expect(loggerSpy.info.calls.allArgs()).toEqual([
      [`Probing service: '${marsProbe.name}'`],
      [`Probe successfully landed on: '${marsProbe.name}'`],
      [`Probing service: '${venusProbe.name}'`],
      [`Probe successfully landed on: '${venusProbe.name}'`]
    ]);
  });
  
  it('Sending the probe until it lands', async () => {
    jasmine.clock().install();
    
    const throwingProbe = {
      name: 'Another galaxy probe',
      probe: () => {}
    };
    
    const throwingProbeSpy = spyOn(throwingProbe, 'probe').and.throwError('an error');
    probeAllServices([throwingProbe as any]);
  
    expect(throwingProbeSpy).toHaveBeenCalledTimes(1);
    expect(sleepSpy).toHaveBeenCalledTimes(1);
  
    await jasmine.clock().tick(2001);
    expect(loggerSpy.warn).toHaveBeenCalledTimes(1);
  
    expect(throwingProbeSpy).toHaveBeenCalledTimes(2);
    expect(sleepSpy).toHaveBeenCalledTimes(2);
    
    // reset return value to be truthy
    throwingProbeSpy.and.resolveTo('');
  
    await jasmine.clock().tick(2001);
    expect(loggerSpy.warn).toHaveBeenCalledTimes(2);
  
    jasmine.clock().uninstall();
  });
});