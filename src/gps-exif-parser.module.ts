import { Module, Inject } from '@nestjs/common';
import { readdir, readFile, writeFile } from 'fs';
import { extname, join } from 'path';
import { create } from 'exif-parser';
import { gpsEntity } from './gps.entity';

@Module({})
export class GpsExifParserModule {
  constructor(@Inject('TXT_FILE_PATH') private readonly txtFilePath: string) {
    this.parseExifData();
  }

  private parseExifData() {
    const folderPath = './Folder';
    const tableData = [];

    readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }

      const jpegFiles = files.filter(
        (file) => extname(file).toLowerCase() === '.jpg',
      );

      jpegFiles.forEach((jpegFile) => {
        const filePath = join(folderPath, jpegFile);

        readFile(filePath, (err, data) => {
          if (err) {
            console.error('Error reading file:', err);
            return;
          }

          const parser = create(data);
          const exifData = parser.parse();

          function decimalToDMS(decimal) {
            const degrees = Math.floor(decimal);
            const minutesDecimal = (decimal - degrees) * 60;
            const minutes = Math.floor(minutesDecimal);
            const seconds = (minutesDecimal - minutes) * 60;

            return `${degrees}°${minutes}'${seconds.toFixed(4)}"`;
          }

          const latitude = exifData.tags.GPSLatitude;
          const longitude = exifData.tags.GPSLongitude;
          const latitudeDMS = decimalToDMS(latitude);
          const longitudeDMS = decimalToDMS(longitude);
          const latitudeDirection = latitude >= 0 ? 'N' : 'S';
          const longitudeDirection = longitude >= 0 ? 'E' : 'W';
          const formattedCoordinatesY = `${latitudeDMS}${latitudeDirection}`;
          const formattedCoordinatesX = `${longitudeDMS}${longitudeDirection}`;
          
          tableData.push({
            FileName: jpegFile,
            Latitude: formattedCoordinatesY,
            Longitude: formattedCoordinatesX,
            Altitude: exifData.tags.GPSAltitude.toFixed(3),
          });

          if (tableData.length === jpegFiles.length) {
            this.generateTxtOutput(tableData);
          }
        });
      });
    });
  }

  private generateTxtOutput(data) {
    let txtContent = '';

    txtContent += 'FileName\tLongitude\tLatitude\tAltitude\n';

    data.forEach((item) => {
      txtContent += `${item.FileName}\t${item.Longitude}\t${item.Latitude}\t${item.Altitude}\n`;
    });

    writeFile(this.txtFilePath, txtContent, 'utf-8', (err) => {
      if (err) {
        console.error('Error writing text file:', err);
        return;
      }
      console.log(`Text file has been written to ${this.txtFilePath}`);
    });
  }
}
