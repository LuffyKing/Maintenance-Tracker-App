const badApiRequest = (request, response) => {
  response.status(400).send({ message: 'Bad API - Request' });
};
export default badApiRequest;
