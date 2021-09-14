import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import wineRouter from './services/wines/index.js';
import userRouter from './services/users/index.js';

const server = express();

const originsURLS = [process.env.FE_URL, process.env.PORT];
const corsOptions = {
  origin(origin, next) {
    if (originsURLS.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(createError(403, { message: 'Check your cors settings!' }));
    }
  },
  credentials: true,
};

const port = process.env.PORT;

server.use(express.json());
server.use(cors());
server.use(cookieParser());

server.use('/wines', wineRouter);
server.use('/user', userRouter);

console.table(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(
    server.listen(port, () => {
      console.log('Server is running on port:', port);
    })
  )
  .catch((error) => console.log(error));
