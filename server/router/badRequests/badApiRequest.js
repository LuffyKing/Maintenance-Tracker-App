const badApiRequest = (req, res) => {
  res.status(400).send({ message: 'Bad API - Request' });
};
export default badApiRequest;
