import * as dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  port: process.env.PORT || 3000,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default',
  },
};
