import * as dotenv from 'dotenv';

dotenv.config();

const DB_TYPE = process.env.DATABASE_TYPE ?? 'atlas'

const DB_HOST = process.env.MONGODB_HOST ?? 'localhost';
const DB_PORT = process.env.MONGODB_PORT ?? 27017;
const DB_DATABASE = process.env.MONGODB_DATABASE ?? 'test';

const DB_ATLAS_USERNAME = process.env.MONGODB_ATLAS_USERNAME;
const DB_ATLAS_PASSWORD = process.env.MONGODB_ATLAS_PASSWORD;
const DB_ATLAS_CLUSTER = process.env.MONGODB_ATLAS_CLUSTER;
const DB_ATLAS_DATABASE = process.env.MONGODB_ATLAS_DATABASE;

const mongodbURI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
const mongodbAtlasURI = `mongodb+srv://${DB_ATLAS_USERNAME}:${DB_ATLAS_PASSWORD}@${DB_ATLAS_CLUSTER}/${DB_ATLAS_DATABASE}?retryWrites=true&w=majority`;

const config = {
    dbURI: DB_TYPE == 'atlas' ? mongodbAtlasURI : mongodbURI
}

export { config };