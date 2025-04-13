import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Supabase responses
export const handlers = [
  http.get('*/projects', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Project',
        description: 'A test project',
        image_url: 'https://example.com/image.jpg',
        github_url: 'https://github.com/test/project',
        tags: ['React', 'TypeScript'],
        created_at: '2024-03-10T00:00:00Z',
        updated_at: '2024-03-10T00:00:00Z',
        user_id: '123'
      }
    ]);
  }),
  
  http.get('*/articles', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Article',
        excerpt: 'A test article',
        content: 'Test content',
        image_url: 'https://example.com/image.jpg',
        read_time: '5 min',
        created_at: '2024-03-10T00:00:00Z',
        updated_at: '2024-03-10T00:00:00Z',
        category: 'technology',
        slug: 'test-article',
        user_id: '123'
      }
    ]);
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());