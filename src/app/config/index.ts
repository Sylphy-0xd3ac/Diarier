import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { AppConfig } from '../../types';

dotenvConfig({
  path: path.resolve(process.cwd(), '.env'),
});

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT || '3000', 10);
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/diary';
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

const config: AppConfig = {
  env,
  port,
  mongodb: {
    uri: mongodbUri,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: jwtSecret,
    expiresIn: jwtExpiresIn,
  },
};

export default config;
