import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  wines: [{ type: Schema.Types.ObjectId, ref: 'wine' }],
  recipes: [
    {
      fullName: { type: String },
      url: { type: String },
    },
  ],
  password: { type: String, required: true },
  refreshToken: { type: String },
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.refreshToken;
  delete userObj.password;
  delete userObj.__v;

  return userObj;
};

UserSchema.pre('save', async function () {
  const newUser = this;
  if (newUser.isModified('password')) {
    newUser.password = await bcrypt.hash(newUser.password, 10);
  }
});
UserSchema.statics.checkCredentials = async function (email, plainPassword) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatched = await bcrypt.compare(plainPassword, user.password);
    if (isMatched) return user;
    else return null;
  } else {
    return null;
  }
};
export default model('User', UserSchema);
