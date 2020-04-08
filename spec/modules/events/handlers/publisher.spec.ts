import 'jasmine';
import { publisher } from '../../../../src/modules/events/handlers/publisher';
import * as generateRandomDataModel from '../../../../src/utils/data/generateRandomDataModel';
import createSpy = jasmine.createSpy;

describe('publisher', () => {
  const channelName = 'channel-name';
  let fakeGenerateRandomDataModel: any;
  let fakeChannel: any;
  
  beforeEach(() => {
    fakeChannel = {
      sendToQueue: createSpy()
    };
    fakeGenerateRandomDataModel = spyOn(generateRandomDataModel, 'generateRandomDataModel').and.returnValue(10)
  });
  
  it('Calls generateRandomDataModel to get message body', async () => {
    await publisher(fakeChannel, channelName)();
    
    expect(fakeGenerateRandomDataModel).toHaveBeenCalledTimes(1);
  });
  
  it('Sends new message to amqp channel queue', async () => {
    await publisher(fakeChannel, channelName)();
    
    expect(fakeChannel.sendToQueue).toHaveBeenCalledTimes(1);
    expect(fakeChannel.sendToQueue).toHaveBeenCalledWith(
      channelName,
      Buffer.from(JSON.stringify(fakeGenerateRandomDataModel.calls.mostRecent().returnValue)),
      {
        contentType: 'application/json',
        persistent: true
      }
    );
  });
});