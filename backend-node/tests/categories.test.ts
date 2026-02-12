import request from 'supertest';
import app from '../src/app';

describe('Categories API', () => {
  it('should fetch all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
