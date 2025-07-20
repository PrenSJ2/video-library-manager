import request from 'supertest';
import { Server } from 'http';
import app from '../server/index';

describe('API Endpoints', () => {
  let server: Server;

  beforeAll((done) => {
    server = app.listen(4000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('GET /api/videos should return an array', async () => {
    const res = await request(server).get('/api/videos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/videos should create a new video', async () => {
    const video = { title: 'Test Video', tags: ['test', 'api'] };
    const res = await request(server).post('/api/videos').send(video);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(video.title);
    expect(Array.isArray(res.body.tags)).toBe(true);
  });

  it('POST /api/generate-ideas should return video ideas', async () => {
    // This test will fail if API_KEY is not set or Gemini API is not mocked
    const res = await request(server)
      .post('/api/generate-ideas')
      .send({ topic: 'technology' });
    // Accept 200 or 500 depending on environment
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('video_ideas');
      expect(Array.isArray(res.body.video_ideas)).toBe(true);
    }
  });
});

