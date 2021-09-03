import UserModel from '../../services/users/schema.js';
import { verifyToken } from './tools.js';
import atob from 'atob';
import createError from 'http-errors';

export const JWTMiddleware = async (req, res, next) => {
  if (!req.cookies.access_token) {
    next(createError(401, { message: 'Provide access token' }));
  } else {
    try {
      const content = await verifyToken(req.cookies.access_token);
      const user = await UserModel.findById(content._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createError(404, { message: 'User not found' }));
      }
    } catch (error) {
      next(createError(401, { message: 'Token not valid' }));
    }
  }
};
export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, { message: 'Authorization required' }));
  } else {
    const decoded = atob(req.headers.authorization.split(' ')[1]);

    const [email, password] = decoded.split(':');
    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      req.user = user;
      next();
    } else {
      next(createError(401, { messsage: 'Credentials wrong' }));
    }
  }
};
