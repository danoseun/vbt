import { nanoid } from 'nanoid';

const vbtRef = 'vbt_'
export const generateReferenceForTransaction = (): string => {
  const randomCode = nanoid(6);

  return `${vbtRef}${randomCode}`;
};
