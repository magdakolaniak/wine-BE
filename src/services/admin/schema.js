import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AdminSchema = new Schema({
  video: { type: String },
  background: { type: String },
  shelf: { type: String },
});
export default model('Admin', AdminSchema
);
