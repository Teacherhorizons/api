import { setup, signIn, signOut, api } from '../../shared'

setup()
// ------------not signed in ------------------------------------------------------------
// npm test application.test.ts -- -t 'not signed in
describe('not signed in', () => {
  beforeAll(async () => {
    await signIn('')
  })

  test('GET applications/1?schema=admin', async () => {
    try {
      await api.get('applications/1?schema=admin')
    } catch (error) {
      expect(error.response.status).toEqual(401) // accessNotPermitted
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1?schema=school', async () => {
    try {
      await api.get('applications/1?schema=school')
    } catch (error) {
      expect(error.response.status).toEqual(401) // accessNotPermitted
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1?schema=teacher', async () => {
    try {
      await api.get('applications/1?schema=teacher')
    } catch (error) {
      expect(error.response.status).toEqual(401) // accessNotPermitted
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1, no schema', async () => {
    try {
      await api.get('applications/1')
    } catch (error) {
      expect(error.response.status).toEqual(401) // accessNotPermitted
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST applications', async () => {
    try {
      const payload = {
        data: {
          type: 'application',
          attributes: { job: { id: '1549' }, memberNumber: 111627 },
        },
      }
      const response = await api.post('applications', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  // TODO: fix this in java for localhost
  test('POST applications - missing data', async () => {
    try {
      const payload = {
        data: {
          // type: 'application',
          // attributes: { job: { id: '1549' }, memberNumber: 111627 },
        },
      }
      const response = await api.post('applications', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST application-applicationEvents', async () => {
    try {
      const payload = {
        data: {
          type: 'application-applicationEvent',
          attributes: {
            application: { id: '1001' },
            eventType: { id: '12' },
            date: '2022-06-27T14:34:40.567Z',
            notes: 'FooBasr',
            autoEmail: { id: '42' },
          },
        },
      }
      const response = await api.post('application-applicationEvents', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  afterAll(async () => {
    await signOut()
  })
})
// -------admin@th.test -----------------------------------------------------
// npm test application.test.ts -- -t 'admin@th.test
describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test')
  })

  test('GET applications/1?schema=admin', async () => {
    const response = await api.get('applications/1?schema=admin')
    expect(response.status).toEqual(200)
    expect(response).toSatisfyApiSpec()
  })

  test('GET applications/1?schema=school', async () => {
    const response = await api.get('applications/1?schema=school')
    expect(response.status).toEqual(200)
    expect(response).toSatisfyApiSpec()
  })

  test('GET applications/1?schema=teacher', async () => {
    const response = await api.get('applications/1?schema=teacher')
    expect(response.status).toEqual(200)
    expect(response).toSatisfyApiSpec()
  })

  test('GET applications/1, no schema', async () => {
    try {
      await api.get('applications/1')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  // TODO move this POST applications
  test('POST applications', async () => {
    const payload = {
      data: {
        type: 'application',
        attributes: { job: { id: '1549' }, memberNumber: 111627 },
      },
    }
    const response = await api.post('applications', payload)
    expect(response.status).toEqual(201)
    expect(response).toSatisfyApiSpec()
  })

  // TODO: fix this in java for localhost
  test('POST applications - missing data', async () => {
    try {
      const payload = {
        data: {
          // type: 'application',
          // attributes: { job: { id: '1549' }, memberNumber: 111627 },
        },
      }
      const response = await api.post('applications', payload)
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST application-applicationEvents', async () => {
    const payload = {
      data: {
        type: 'application-applicationEvent',
        attributes: {
          application: { id: '1001' },
          eventType: { id: '12' },
          date: '2022-06-27T14:34:40.567Z',
          notes: 'FooBasr',
          autoEmail: { id: '42' },
        },
      },
    }
    const response = await api.post('application-applicationEvents', payload)
    expect(response.status).toEqual(201)
    expect(response).toSatisfyApiSpec()
  })

  afterAll(async () => {
    await signOut()
  })
})
// -------endorsed@th.test --------------------------------------------------
// npm test application.test.ts -- -t 'endorsed@th.test
describe('endorsed@th.test', () => {
  beforeAll(async () => {
    await signIn('endorsed@th.test')
  })

  test('GET applications/8?schema=teacher', async () => {
    const response = await api.get('applications/8?schema=teacher')
    expect(response.status).toEqual(200)
    expect(response).toSatisfyApiSpec()
  })

  test('GET applications/1?schema=teacher', async () => {
    try {
      await api.get('applications/1?schema=teacher')
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1?schema=admin', async () => {
    try {
      await api.get('applications/1?schema=admin')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1?schema=school', async () => {
    try {
      await api.get('applications/1?schema=school')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1, no schema', async () => {
    try {
      await api.get('applications/1')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST applications', async () => {
    try {
      const payload = {
        data: {
          type: 'application',
          attributes: { job: { id: '1549' }, memberNumber: 111627 },
        },
      }
      const response = await api.post('applications', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST application-applicationEvents', async () => {
    try {
      const payload = {
        data: {
          type: 'application-applicationEvent',
          attributes: {
            application: { id: '1001' },
            eventType: { id: '12' },
            date: '2022-06-27T14:34:40.567Z',
            notes: 'FooBasr',
            autoEmail: { id: '42' },
          },
        },
      }
      const response = await api.post('application-applicationEvents', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  afterAll(async () => {
    await signOut()
  })
})
// -------school-2-schools@th.test --------------------------------------------------
// npm test application.test.ts -- -t 'school-2-schools@th.test
describe('school-2-schools@th.test', () => {
  beforeAll(async () => {
    await signIn('school-2-schools@th.test')
  })

  // test('GET applications/1000?schema=school', async () => {
  //   const response = await api.get('applications/1000?schema=school')
  //   expect(response.status).toEqual(200)
  //   expect(response).toSatisfyApiSpec()
  // })

  // fails due to: applications/1000 is missing submissionToSchoolData
  test('GET applications/1000?schema=school', async () => {
    try {
      await api.get('applications/1000?schema=school')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })
  // added application-applicationEvent 12 (submission to school) to id = 1001
  test('GET applications/1001?schema=school', async () => {
    const response = await api.get('applications/1001?schema=school')
    expect(response.status).toEqual(200)
    expect(response).toSatisfyApiSpec()
  })

  test('GET applications/1?schema=school', async () => {
    try {
      await api.get('applications/1?schema=school')
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1?schema=admin', async () => {
    try {
      await api.get('applications/1?schema=admin')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1?schema=teacher', async () => {
    try {
      await api.get('applications/1?schema=teacher')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('GET applications/1, no schema', async () => {
    try {
      await api.get('applications/1')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST applications', async () => {
    try {
      const payload = {
        data: {
          type: 'application',
          attributes: { job: { id: '1549' }, memberNumber: 111627 },
        },
      }
      const response = await api.post('applications', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  test('POST application-applicationEvents', async () => {
    try {
      const payload = {
        data: {
          type: 'application-applicationEvent',
          attributes: {
            application: { id: '1001' },
            eventType: { id: '12' },
            date: '2022-06-27T14:34:40.567Z',
            notes: 'FooBasr',
            autoEmail: { id: '42' },
          },
        },
      }
      const response = await api.post('application-applicationEvents', payload)
    } catch (error) {
      expect(error.response.status).toEqual(401)
      expect(error.response).toSatisfyApiSpec()
    }
  })

  afterAll(async () => {
    await signOut()
  })

  afterAll(async () => {
    await signOut()
  })
})
