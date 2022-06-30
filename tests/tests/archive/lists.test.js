import { setApi, setup, api } from '../../shared';

setup();

describe('not signed in', () => {
  beforeAll(async () => {
    await setApi();
  });

  // TODO: move
  test('GET v1/site/statistics', async () => {
    const response = await api.get('v1/site/statistics');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
});