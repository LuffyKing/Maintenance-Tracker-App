import uuidv4 from 'uuid/v4';
import { loginValues } from './loginSeed';

const requestsColumns = `
id,
title,
description,
status,
type,
date_submitted,
last_edited,
location,
userid
`;
const requestsValues = [
  uuidv4(),
  'Broken Toilet',
  'The toilet is broken please fix it',
  'Not Approved/Rejected',
  'Repair',
  new Date(),
  new Date(),
  '4 Tawdry Lane',
  loginValues[0],
  uuidv4(),
  'Broken Lightbulb',
  'The lightbulb is broken please fix it',
  'Not Approved/Rejected',
  'Repair',
  new Date(),
  new Date(),
  '7 brammal lane',
  loginValues[0]
];
export { requestsColumns, requestsValues };
