import jestOpenAPI from 'jest-openapi';

import path from 'path';
import axios from 'axios';
import config from './config';

export const api = axios.create({
  baseURL: config.baseURL,
  // @ts-ignore:
  proxy: {
    auth: config.auth
  },
  headers: {
    Cookie: 'JSESSIONID=' + config.JSESSIONID
  },
});

export function setup(context = {}) {
  beforeEach(() => {
    jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi3.yaml'));
  });
  // afterEach(...);

  return context;
}