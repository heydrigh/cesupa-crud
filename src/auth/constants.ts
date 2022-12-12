import { configurationService } from 'src/config/config.service';
configurationService;

export const JWT_SECRET_KEY = configurationService.getValue(
  'JWT_SECRET_KEY',
  'secret',
);

export const ACCESS_TOKEN_EXPIRATION = configurationService.getValue(
  'ACCESS_TOKEN_EXPIRATION',
  '1d',
);
export const REFRESH_TOKEN_EXPIRATION = configurationService.getValue(
  'REFRESH_TOKEN_EXPIRATION',
  '30d',
);
