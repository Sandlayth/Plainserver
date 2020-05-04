import {get, param} from '@loopback/rest';
import {readdirSync} from 'fs';
import {lookup} from 'mime-types';
import {defaultPath} from '../config';
import {isItemAccessible} from '../helpers/browse';

export class BrowserController {
  @get('/browse')
  browse(@param.query.string('path') path: string): Array<Object> {
    path = defaultPath + path;
    let items: Object[] = [];
    if (isItemAccessible(path)) {
      const dirItems = readdirSync(path, {withFileTypes: true});
      items = dirItems.map(item => {
        let type = 'directory';
        let mime = undefined;
        if (item.isFile()) {
          type = 'file';
          mime = lookup(path + item.name);
        }
        return {...item, type, mime};
      })
    }
    return items;
  }
}
