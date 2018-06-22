export const messageResponse = (response, statusCode, message) => {
  return response.status(statusCode).send(message);
};
