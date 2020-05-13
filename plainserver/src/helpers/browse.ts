import {accessSync, constants, lstatSync} from 'fs';
import {defaultPath} from '../config';

export function buildPath(path: string): string {
  return defaultPath + path.replace(/\.\./g, '');
}

export function isItemAccessible(path: string): boolean {
  let accessible = true;
  try {
    accessSync(path, constants.F_OK);
  } catch (err) {
    accessible = false;
  }
  return accessible;
}

export function isItemFile(path: string): boolean {
  return lstatSync(path).isFile();
}
