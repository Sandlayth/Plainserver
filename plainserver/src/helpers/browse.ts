import {accessSync, constants} from 'fs';

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
