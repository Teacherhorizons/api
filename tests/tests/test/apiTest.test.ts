import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('POST apiTest', async () => {
    const payload = {
      data: {
        type: 'test-apiTest',
        attributes: {
          dataIds: '{"jobIds": [1556], "schoolIds": [3275, 3276], "teacherMemberNumbers": [2223467, 2223468]}',
        },
      },
    };
    const response = await api.post('test-apiTests', payload);
    expect(response.status).toEqual(201);
    expect(response).toSatisfyApiSpec();
  });

  test('DELETE apiTest', async () => {
    const response = await api.delete('test-apiTests/1');
    expect(response.status).toEqual(204);
    expect(response).toSatisfyApiSpec();
  });

  afterAll(async () => {
    await signOut();
  });
});
