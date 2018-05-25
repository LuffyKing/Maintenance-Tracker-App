import uuidv4 from 'uuid/v4';
import bcrypt from 'bcrypt';

const loginColumns = `
  ID,
  FIRST_NAME,
  LAST_NAME,
  EMAIL,
  PASSWORD,
  JOB_TITLE,
  DEPARTMENT,
  PROFILE,
  LOCATION,
  UPGRADE_ID
`;
const loginValues = [
  uuidv4(),
  'Oyindamola',
  'Aderinwale',
  'aderinwale17@gmail.com',
  bcrypt.hashSync('test_password', 8),
  'King slayer',
  'Guardians',
  'User',
  '4 Tawdry Lane',
  uuidv4()
];

const loginValuesAdmin = [
  uuidv4(),
  'King',
  'Arthur',
  'arthur@gmail.com',
  bcrypt.hashSync('test_password', 8),
  'King slayer',
  'Guardians',
  'Admin',
  '4 Tawdry Lane',
  uuidv4()
];
export { loginValues, loginColumns, loginValuesAdmin };
