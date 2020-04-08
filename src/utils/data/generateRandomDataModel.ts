import { randomBytes } from 'crypto';

export function generateRandomDataModel(maxLevels: number = 3): any {
  const getRandomValue = (subLevel: number) => {
    const types = [
      // number
      () => Math.floor(Math.random() * 1000),
      
      // string
      () => randomBytes(10).toString('hex'),
  
      // object
      () => {
        if (subLevel >= maxLevels) return `that's enough`;
    
        return {
          key1: getRandomValue(subLevel + 1),
          key2: getRandomValue(subLevel + 1)
        }
      },
  
      // array
      () => {
        return [
          getRandomValue(subLevel + 1),
          getRandomValue(subLevel + 1)
        ]
      }
    ];
  
    return types[Math.floor(Math.random() * types.length)]();
  };
  
  
  return getRandomValue(0);
}