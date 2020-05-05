import {accessSync, constants} from 'fs';
import {defaultPath} from '../config';

export function buildPath(path: string): string {
  return defaultPath + path.replace(/../g, '');
}

export function isItemAccessible(path: string): boolean {
  // eslint-disable-next-line no-shadow
  let isItemAccessible = true;
  try {
    accessSync(path, constants.F_OK);
  } catch (err) {
    isItemAccessible = false;
  }
  return isItemAccessible;
}
