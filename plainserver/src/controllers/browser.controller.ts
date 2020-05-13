import {inject} from '@loopback/core';
import {get, oas, param, Response, RestBindings} from '@loopback/rest';
import {readdirSync} from 'fs';
import {lookup} from 'mime-types';
import {buildPath, isItemAccessible} from '../helpers/browse';

export class BrowserController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}

  @get('/browse', {
    responses: {
      '200': {
        description: "Browse GET success",
        content: {'application/json': {schema: 'array'}}
      },
      '500': {
        description: 'Browse GET fail',
        content: {'application/json': {schema: 'string'}}
      }
    },
  })
  async browse(@param.query.string('path') path: string): Promise<Object> {
    if(!path) {
      this.response.status(500);
      return "Missing path parameter";
    }
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
