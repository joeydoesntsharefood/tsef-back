import app from '../../../index';
import request from 'supertest'

describe('create an provider', async () => {
  const res = await request(app)
    .post('/v1/provider')
    .send({
      name: 'Mateus',
      country_code: 'usa'
    });

    console.log(res);
});
