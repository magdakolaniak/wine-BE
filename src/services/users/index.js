import express from 'express';
import createError from 'http-errors';
import UserModel from './schema.js';
import WineModel from '../wines/schema.js';
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

userRouter.post('/:userId/addToList/:wineId', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    user.wines.push(req.params.wineId);
    const updatedUser = await user.save();
    res.send(updatedUser.wines);
  } catch (error) {
    console.log(error);
  }
});
userRouter.post('/:userId/addRecipe', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    user.recipes = [...user.recipes, req.body];
    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (error) {
    console.log(error);
  }
});
userRouter.put('/:userId/removeFromList/:wineId', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const list = user.wines;
    const newList = list.filter(
      (element) => element.toString() !== req.params.wineId.toString()
    );

    user.wines = newList;
    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (error) {
    console.log(error);
  }
});
userRouter.put('/:userId/removeRecipe/:recipeId', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const recipes = user.recipes;
    const newRecipes = recipes.filter(
      (element) => element._id.toString() !== req.params.recipeId.toString()
    );
    user.recipes = newRecipes;
    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (error) {
    console.log(error);
  }
});
userRouter.get('/:userId/wines', async (req, res, next) => {
  try {
    const userWithWines = await UserModel.findById(req.params.userId, {
      wines: 1,
    }).populate('wines', {
      type: 1,
      fullName: 1,
      year: 1,
      winery: 1,
      origin: 1,
      _id: 1,
    });
    res.send(userWithWines);
  } catch (error) {
    console.log(error);
  }
});
userRouter.get('/login', basicAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      res.send(req.user);
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
