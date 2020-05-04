import {get, param} from '@loopback/rest';
import {readdirSync} from 'fs';
import {defaultPath} from '../config';
import {isItemAccessible} from '../helpers/browse';

export class BrowserController {
  @get('/browse')
  hello(@param.query.string('path') path: string): Array<String> {
    path = defaultPath + path;
    let items: string[] = [];
    if (isItemAccessible(path)) {
      items = readdirSync(path);
    }
    return items;
  }
}
