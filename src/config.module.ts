import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'TXT_FILE_PATH',
      useValue: 'gps_data.txt',
    },
  ],
  exports: ['TXT_FILE_PATH'],
})
export class ConfigModule {}
