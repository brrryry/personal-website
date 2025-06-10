import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let _connection = undefined;
let _db = undefined;

const env = process.env.NODE_ENV || 'development';


const mongoConfig = {
  serverUrl: (env === "production") ? process.env.MONGO_SERVER_URL : process.env.MONGO_SERVER_URL_DEV,
  database: (env === "production") ? process.env.MONGO_DB_NAME : process.env.MONGO_DB_NAME_DEV,
}

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };