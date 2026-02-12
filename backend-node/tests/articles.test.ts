import request from 'supertest';
import app from '../src/app';

describe('Articles API', () => {
  it('should fetch all articles with success', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should filter articles by status', async () => {
    const res = await request(app).get('/api/articles?status=published');
    expect(res.status).toBe(200);
    expect(res.body.data.every((a: any) => a.status === 'published')).toBe(true);
  });

  it('should search articles by title', async () => {
    const res = await request(app).get('/api/articles?search=test');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
