import { ConfigService } from '@nestjs/config';

export default async (configService: ConfigService) => {
  if (configService.get('NODE_ENV') === 'development') {
    const username = configService.get('MONGO_USERNAME');
    const password = configService.get('MONGO_PASSWORD');
    const host = configService.get('MONGO_HOST');
    const db = configService.get('MONGO_DATABASE');
    console.log(`mongodb://${username}:${password}@${host}/${db}`);
    return {
      uri: `mongodb://${username}:${password}@${host}/${db}?authSource=admin&directConnection=true&w=majority`,
    };
  }
  return {
    uri: configService.get('MONGO_URI'),
    dbName: configService.get('MONGO_DATABASE'),
  };
};
