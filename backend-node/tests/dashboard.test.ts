import request from 'supertest';
import app from '../src/app';

describe('Dashboard API', () => {
  it('should fetch consolidated stats', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('articles');
    expect(res.body.data).toHaveProperty('categories');
    expect(res.body.data).toHaveProperty('networks');
    expect(res.body.data).toHaveProperty('notifications');
    expect(Array.isArray(res.body.data.articles)).toBe(true);
  });
});
