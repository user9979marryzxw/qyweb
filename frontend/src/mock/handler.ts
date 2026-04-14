import { http, HttpResponse } from 'msw';

// MSW handlers for all services
export const handlers = [
  // User handlers
  http.post('/api/user/login', async ({ request }) => {
    const body = (await request.json()) as any;
    const { username } = body as any;
    if (username === 'test') {
      return HttpResponse.json({ code: 0, message: 'Success', data: { token: 'fake-token', userId: 1 } });
    }
    return HttpResponse.json({ code: 1001, message: 'Invalid credentials', data: null });
  }),
  http.post('/api/user/register', async ({ request }) => {
    await request.json();
    return HttpResponse.json({ code: 0, message: 'Success', data: { userId: 2 } });
  }),

  // Product handlers
  http.get('/api/product/list', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    if (page === '1') {
      return HttpResponse.json({ code: 0, message: 'Success', data: { products: [{ id: 1, name: 'Product A', price: 10 }], total: 1 } });
    }
    return HttpResponse.json({ code: 0, message: 'Success', data: { products: [], total: 0 } });
  }),
  http.get('/api/product/:id', ({ params }) => {
    const { id } = params as any;
    if (id === '1') {
      return HttpResponse.json({ code: 0, message: 'Success', data: { id: 1, name: 'Product A', description: 'Desc', price: 10 } });
    }
    return HttpResponse.json({ code: 2002, message: 'Product not found', data: null });
  }),

  // Common handlers
  http.get('/api/common/config', () => {
    return HttpResponse.json({ code: 0, message: 'Success', data: { version: '1.0.0', features: ['auth', 'products'] } });
  }),
  http.post('/api/common/feedback', async ({ request }) => {
    await request.json();
    return HttpResponse.json({ code: 0, message: 'Success', data: { id: 123 } });
  }),
];
