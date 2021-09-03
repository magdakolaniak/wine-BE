import express from 'express';
import createError from 'http-errors';
import UserModel from './schema.js';
import { basicAuthMiddleware, JWTMiddleware } from '../../lib/auth/auth.js';
import { JWTAuthenticate } from '../../lib/auth/tools.js';

const userRouter = express.Router();

userRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const data = await newUser.save();

    res.send(data);
  } catch (error) {
    // if (error.name === 'ValidationError') {
    //   next(createError(400, { message: 'Validation error' }));
    // } else {
    //   next(createError(500, { message: error.message }));
    // }
    console.log(error);
  }
});

userRouter.get('/login', basicAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      res.send({
        name: req.user.firstname,
        last_name: req.user.lastname,
        email: req.user.email,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
