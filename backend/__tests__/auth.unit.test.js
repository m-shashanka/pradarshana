const supertest = require('supertest');
const { app, server } = require('../server');
const request = supertest(app);
const { disconnectDB, connectDB } = require("../config/db");

describe('API test', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
    server.close();
  });

  describe('POST api/users/register', () => {
    it('example request using a mocked database instance', async () => {
      const res = await request.post('/api/users/register').send({
        name:"test",
        email:"test@test.com",
        password:"UnitTest123&",
        password2:"UnitTest123&",
        roles:["professor", "admin"]
    });
    expect(res.status).toBe(200);
    expect(res.body.enabled).toBe(false);
    expect(res.body._id).toEqual(expect.anything());

    });
  });
});