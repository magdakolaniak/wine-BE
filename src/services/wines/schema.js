import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const wineSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['white', 'red', 'sparkling', 'sweet'],
  },
  origin: {
    country: { type: String, required: true },
    region: { type: String, required: true },
    subRegion: { type: String },
  },

  winery: { type: String, required: true },
  fullName: { type: String, required: true },
  year: { type: String, required: true },
  grape: { type: String, required: true },
  flavours: { type: String, required: true },
  character: {
    alcohol: { type: String, required: true },
    acidity: { type: String, required: true },
    tannin: { type: String },
    body: { type: String, required: true },
    sweetness: { type: String },
  },

  description: { type: String, required: true },
  image: { type: String },
  link: { type: String },
});

export default model('wine', wineSchema);
