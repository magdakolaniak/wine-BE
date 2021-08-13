import express from 'express';
import WineModel from './schema.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const wineRouter = express.Router();
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wines',
  },
});

wineRouter.get('/', async (req, res, next) => {
  try {
    const wines = await WineModel.find();
    res.send(wines);
  } catch (error) {
    console.log(error);
  }
});

wineRouter.post('/', async (req, res, next) => {
  try {
    const newWine = new WineModel(req.body);
    const data = await newWine.save();
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

wineRouter.post(
  '/:id/bottle',
  multer({ storage: cloudinaryStorage }).single('bottle'),
  async (req, res, next) => {
    try {
      const wineId = req.params.id;
      const bottle = `${req.file.path}`;
      const wineToUpdate = await WineModel.findById(wineId);
      wineToUpdate.image = bottle;
      const newWine = await wineToUpdate.save();
      res.send(newWine);
    } catch (error) {
      console.log(error);
    }
  }
);

export default wineRouter;
