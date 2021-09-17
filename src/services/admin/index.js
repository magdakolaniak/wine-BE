import express from 'express';
import AdminModel from './schema.js';

const adminRouter = express.Router();

adminRouter.post('/assets', async (req, res, next) => {
  try {
    const asset = await AdminModel(req.body);
    const data = await asset.save();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

export default adminRouter;
