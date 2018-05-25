
const maxFieldsChecker = (reqBody, maxLengthObj) => Object.keys(reqBody)
  .filter(elm => elm.length > maxLengthObj[elm])
  .map(key => `the input supplied for ${key.toUpperCase()} field is too large the maximum allowed input is ${maxLengthObj[key]}`);

const maxFieldHandler = (reqBody, response, failReason, maxLengthObj) => {
  const invalidFieldsArr = maxFieldsChecker(reqBody, maxLengthObj);
  if (invalidFieldsArr.length > 0) {
    return response.status(400).json({
      message: `${failReason} ${invalidFieldsArr.join(' ,')}`
    });
  }
};

const maxLengthChecker = (request, response, next) => {
  const maxLengthObj = {
    firstName: 25,
    lastName: 25,
    email: 50,
    password: 90,
    jobTitle: 30,
    department: 30,
    title: 50,
    description: 288,
    location: 160,
    reason: 288
  };
  const { reqBody } = request;
  // check if the fields are filled
  const reply = maxFieldHandler(reqBody, response, request.failReason, maxLengthObj);
  if (reply) {
    return reply;
  }
  next();
};
export default maxLengthChecker;
