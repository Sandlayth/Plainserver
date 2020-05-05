import {inject} from '@loopback/core';
import {get, oas, param, Response, RestBindings} from '@loopback/rest';
import {readdirSync} from 'fs';
import {lookup} from 'mime-types';
import {buildPath, isItemAccessible} from '../helpers/browse';

export class BrowserController {
  @get('/browse')
  browse(@param.query.string('path') path: string): Array<Object> {
    path = buildPath(path);
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

  @get('/download')
  @oas.response.file()
  download(
    @param.query.string('path') path: string,
    @inject(RestBindings.Http.RESPONSE) response: Response): Object {
    path = buildPath(path);
    if (isItemAccessible(path)) {
      response.download(path);
      return response;
    } else {
      return "Error"
    }
  }
}
