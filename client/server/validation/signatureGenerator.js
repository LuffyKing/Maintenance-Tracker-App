import crypto from 'crypto';

const signedUpload = (publicId, timestamp, secret) => {
  const strToHash = `public_id=${publicId}&timestamp=${timestamp}${secret}`;
  return crypto.createHash('sha1').update(strToHash).digest('hex');
};

export default signedUpload;
