import EXAMPLES from '../data/example-profiles.yaml';
import { generateSimpleUniqueId } from '../utils/generateSimpleUniqueId';

export function getRandomProfileDataFiller() {
  console.log('EXAMPLES', EXAMPLES);
  const randomIndex = Math.floor(Math.random() * EXAMPLES.length);
  const randomExample = EXAMPLES[randomIndex];
  return {
    uid: generateSimpleUniqueId(),
    name: randomExample.ai_name,
    role: randomExample.ai_role,
    goals: [randomExample.ai_goal],
  };
}
