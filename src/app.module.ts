import { Module, Inject } from '@nestjs/common';
import { GpsExifParserModule } from './gps-exif-parser.module';
import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Elbaqa1524',
      database: 'gps',
      entities: [__dirname + '/module/**/entity/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, GpsExifParserModule],
})
export class AppModule {
  constructor(@Inject('TXT_FILE_PATH') private readonly txtFilePath: string) {}
  
}
