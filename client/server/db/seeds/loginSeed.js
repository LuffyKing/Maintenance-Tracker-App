import bcrypt from 'bcrypt';

const loginColumns = `
  FIRST_NAME,
  LAST_NAME,
  EMAIL,
  PASSWORD,
  JOB_TITLE,
  DEPARTMENT,
  PROFILE,
  LOCATION
`;
const loginValues = [
  'Oyindamola',
  'Aderinwale',
  'aderinwale17@gmail.com',
  bcrypt.hashSync('test_password', 8),
  'King slayer',
  'Guardians',
  'User',
  '4 Tawdry Lane'
];

const loginValuesAdmin = [
  'King',
  'Arthur',
  'arthur@gmail.com',
  bcrypt.hashSync('test_password', 8),
  'King slayer',
  'Guardians',
  'Admin',
  '4 Tawdry Lane'
];
export { loginValues, loginColumns, loginValuesAdmin };
