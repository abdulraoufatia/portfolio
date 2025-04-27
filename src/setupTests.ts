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
        live_url: 'https://example.com/project',
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
        visible: true,
        user_id: '123'
      }
    ]);
  })
];

const server = setupServer(...handlers);

// Configure MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  // Clean up any modifications to the document
  document.body.style.overflow = '';
});

// Mock window.scrollTo and Element.scrollIntoView
beforeAll(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock IntersectionObserver
beforeAll(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
});