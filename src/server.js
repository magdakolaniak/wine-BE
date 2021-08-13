import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import wineRouter from './services/wines/index.js';

const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cors());

server.use('/wines', wineRouter);

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
