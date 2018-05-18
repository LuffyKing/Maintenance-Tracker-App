import validator from 'validator';

const checkId = id => validator.isInt(id);

const getARequestChecker = (req, res, next) => {
  if (checkId(req.params.requestid.trim())) {
    req.params.requestid = req.params.requestid.trim();
    next();
  } else {
    return res.status(400).send({ message: 'The id provided is invalid because it is not an integer' });
  }
};
export { checkId, getARequestChecker };
