import { invalidFieldMessage } from './createARequestValidator';

const maxFieldsChecker = (reqBody, maxLengthObj) => Object.keys(reqBody)
  .filter(elm => {
    return reqBody[elm].length > maxLengthObj[elm]
  })
  .map(key => `the input supplied for ${key.toUpperCase()} field is too large, the maximum allowed input is ${maxLengthObj[key]} characters.`);
const minFieldsChecker = (reqBody, minLengthObj) => Object.keys(reqBody)
  .filter(elm => {
    return reqBody[elm].length < minLengthObj[elm]
  })
  .map(key => `the input supplied for ${key.toUpperCase()} field is too small, the minimum allowed input is ${minLengthObj[key]} characters.`);
const maxFieldHandler = (reqBody, response, failReason, maxLengthObj) => {
  const invalidFieldsArr = maxFieldsChecker(reqBody, maxLengthObj);
  return invalidFieldMessage(invalidFieldsArr, response, 'The operation failed because');
};
const minFieldHandler = (reqBody, response, failReason, maxLengthObj) => {
  const invalidFieldsArr = minFieldsChecker(reqBody, maxLengthObj);
  return invalidFieldMessage(invalidFieldsArr, response, 'The operation failed because');
};
const maxLengthChecker = (request, response, next) => {
  const maxLengthObj = {
    firstName: 25,
    lastName: 25,
    email: 50,
    type: 11,
    password: 90,
    jobTitle: 30,
    department: 30,
    title: 50,
    description: 288,
    location: 160,
    reason: 288
  };
  const minLengthObj = {
    firstName: 2,
    lastName: 2,
    password: 6,
    type: 5,
    jobTitle: 5,
    department: 5,
    title: 5,
    description: 10,
    location: 3,
    reason: 5
  };
  const { reqBody } = request;
  // check if the fields are filled
  let reply = maxFieldHandler(reqBody, response, request.failReason, maxLengthObj);
  if (reply) {
    return reply;
  }
  reply = minFieldHandler(reqBody, response, request.failReason, minLengthObj);
  if (reply) {
    return reply;
  }
  next();
};
export default maxLengthChecker;
