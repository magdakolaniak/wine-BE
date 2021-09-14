import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );
const generateRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15 days' },
      (err, token) => {
        if (err) reject(err);

        resolve(token);
      }
    )
  );

export const JWTAuthenticate = async (user) => {
  const accessToken = await generateAccessToken({ _id: user._id });
  const refreshToken = await generateRefreshToken({ _id: user._id });
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);

      resolve(decodedToken);
    })
  );

const verifyRefreshToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err);

      resolve(decodedToken);
    })
  );
