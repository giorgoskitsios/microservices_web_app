import { BadRequestError } from '@saas2024-23/common';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ILocation {
  Locations: {
    Latitude: number;
    Longitude: number;
  }[];
}

export const prepareLocationsData = (filename: string) => {
  const filePath = `/app/uploads/${filename}`;
  const fileContent = readFileSync(filePath, 'utf8');
  let locations: ILocation;
  try {
    locations = JSON.parse(fileContent);
  } catch (err) {
    throw new BadRequestError('File content is not valid JSON');
  }
  return locations.Locations.map((locObj) => {
    return { latitude: locObj.Latitude, longitude: locObj.Longitude };
  });
};
