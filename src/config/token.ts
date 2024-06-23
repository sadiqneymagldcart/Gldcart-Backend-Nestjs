import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  accessSecret: process.env.ACCESS_SECRET || 'access-secret',
  accessExpirationTime: process.env.ACCESS_EXPIRATION_TIME || '15m',
  refreshSecret: process.env.REFRESH_SECRET || 'refresh-secret',
  refreshExpirationTime: process.env.REFRESH_EXPIRATION_TIME || '7d',
}));
