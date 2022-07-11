import { JsonApi_ApplicationEventType_ResponseData } from './../../interfaces';
import { setApi, setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET application-eventTypes?schema=admin', async () => {
    const response = await api.get('application-eventTypes?schema=admin');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(22);

    const data: JsonApi_ApplicationEventType_ResponseData = response.data;
    const countWithStatus = data.data.filter((x) => !!x.attributes.applicationStatus).length;
    expect(countWithStatus).toEqual(21);

    expect(response).toSatisfyApiSpec();
  });

  test('GET application-eventTypes?schema=school', async () => {
    const response = await api.get('application-eventTypes?schema=school');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(22);
    expect(response).toSatisfyApiSpec();
  });

  test('GET application-eventTypes?schema=teacher', async () => {
    const response = await api.get('application-eventTypes?schema=teacher');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(22);
    expect(response).toSatisfyApiSpec();
  });

  test('GET application-eventTypes, no schema', async () => {
    try {
      await api.get('application-eventTypes');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  afterAll(async () => {
    await signOut();
  });
});

describe('school-1-school@th.test', () => {
  beforeAll(async () => {
    await signIn('school-1-school@th.test');
  });

  test('GET application-eventTypes?schema=school', async () => {
    const response = await api.get('application-eventTypes?schema=school');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(4);
    expect(response).toSatisfyApiSpec();
    // TODO: add test to check school can see only application event types where isVisibleToSchool is true
    // e.g. expected count
  });

  test('GET application-eventTypes?schema=admin', async () => {
    try {
      await api.get('application-eventTypes?schema=admin');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  test('GET application-eventTypes?schema=teacher', async () => {
    try {
      await api.get('application-eventTypes?schema=teacher');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  test('GET application-eventTypes, no schema', async () => {
    try {
      await api.get('application-eventTypes');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  afterAll(async () => {
    await signOut();
  });
});

describe('endorsed@th.test', () => {
  beforeAll(async () => {
    await signIn('endorsed@th.test');
  });

  test('GET application-eventTypes?schema=teacher', async () => {
    const response = await api.get('application-eventTypes?schema=teacher');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(3);
    expect(response).toSatisfyApiSpec();
  });

  test('GET application-eventTypes?schema=admin', async () => {
    try {
      await api.get('application-eventTypes?schema=admin');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  test('GET application-eventTypes?schema=school', async () => {
    try {
      await api.get('application-eventTypes?schema=school');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  test('GET application-eventTypes, no schema', async () => {
    try {
      await api.get('application-eventTypes');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    }
  });

  afterAll(async () => {
    await signOut();
  });
});

describe('not signed in', () => {
  beforeAll(async () => {
    await setApi();
  });

  test('GET application-eventTypes?schema=admin', async () => {
    try {
      await api.get('application-eventTypes?schema=admin');
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response).toSatisfyApiSpec();
    }
  });
});
