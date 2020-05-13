import {inject} from '@loopback/core';
import {get, oas, param, Response, RestBindings} from '@loopback/rest';
import {readdirSync} from 'fs';
import {lookup} from 'mime-types';
import {buildPath, isItemAccessible, isItemFile} from '../helpers/browse';

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

  @get('/download', {
    responses: {
      '200': {
        description: "Download GET success",
        content: {'application/json': {schema: 'buffer'}}
      },
      '500': {
        description: 'Download GET fail',
        content: {'application/json': {schema: 'string'}}
      },
      '404': {
        description: 'Download GET fail',
        content: {'application/json': {schema: 'string'}}
      }
    },
  })
  @oas.response.file()
  async download(
    @param.query.string('path') path: string,
    @inject(RestBindings.Http.RESPONSE) response: Response): Promise<Object> {
    if(!path) {
      this.response.status(500);
      return "Missing path parameter";
    }
    path = buildPath(path);
    if (isItemAccessible(path) && isItemFile(path)) {
      response.download(path);
      return response;
    } else {
      this.response.status(404);
      return "Parameter error: not a valid file";
    }
  }
}
