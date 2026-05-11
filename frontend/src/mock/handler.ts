import { http, HttpResponse } from 'msw';

// MSW handlers for all services
export const handlers = [
  // User & Auth handlers
  http.post('/api/user/login', async ({ request }) => {
    const body = (await request.json()) as any;
    const { username } = body as any;
    // 模拟管理员登录
    if (username === 'admin') {
      return HttpResponse.json({ code: 1, message: 'Success', data: { token: 'admin-token', userId: 1, username: 'admin', nickname: '超级管理员', isAdmin: true, avatar: '' } });
    }
    // 模拟测试用户
    if (username === 'test') {
      return HttpResponse.json({ code: 1, message: 'Success', data: { token: 'fake-token', userId: 2, username: 'test', nickname: '测试用户', isAdmin: false, avatar: '' } });
    }
    return HttpResponse.json({ code: 1001, message: '账号或密码错误', data: null });
  }),
  
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({ code: 1, message: '注册成功', data: { userId: Date.now(), token: 'reg-token-' + Date.now() } });
  }),

  http.get('/api/auth/check-phone', () => HttpResponse.json({ code: 1, data: { available: true } })),
  http.get('/api/auth/check-email', () => HttpResponse.json({ code: 1, data: { available: true } })),

  // Product & Paging handlers (UnifiedPaginationModule)
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const pageNo = parseInt(url.searchParams.get('pageNo') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12');
    const category = url.searchParams.get('category');

    // 构造模拟分页数据
    const total = 156;
    const list = Array.from({ length: pageSize }).map((_, i) => ({
      id: (pageNo - 1) * pageSize + i + 1,
      name: `${category === 'domestic' ? '国内' : category === 'international' ? '出境' : '签证'}精选商品 ${i + 1}`,
      price: Math.floor(Math.random() * 20000) + 1000,
      stock: Math.floor(Math.random() * 100),
      sales: Math.floor(Math.random() * 1000),
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
      description: '这是一段关于该旅游产品的精致描述，带您领略不一样的风景。',
      category_name: category === 'domestic' ? '国内游' : '出境游',
      rating: 4.8
    }));

    return HttpResponse.json({
      code: 1,
      message: 'success',
      data: {
        list,
        total,
        pages: Math.ceil(total / pageSize),
        current: pageNo
      }
    });
  }),

  // Console Dashboard handlers
  http.get('/api/console/dashboard/stats', () => {
    return HttpResponse.json({
      code: 1,
      data: {
        todaySales: '¥ 128,430',
        pendingOrders: 42,
        newUsers: 156,
        stockAlerts: 12,
        salesChange: '+12.5%',
        ordersChange: '+5.2%',
        usersChange: '-2.4%',
        alertsStatus: '正常'
      }
    });
  }),

  // Console Orders handlers
  http.get('/api/console/orders', ({ request }) => {
    const url = new URL(request.url);
    const pageNo = parseInt(url.searchParams.get('pageNo') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    
    const list = Array.from({ length: pageSize }).map((_, i) => ({
      id: `ORD-202603${(pageNo - 1) * pageSize + i + 10}`.padEnd(12, '0'),
      user: ['李晓明', '王思齐', '张婉莹', '赵子豪', '周杰伦'][i % 5],
      product: ['瑞士阿尔卑斯10日游', '泰国清迈6日深度游', '欧洲申根签证办理', '日本京都赏枫7日游', '川藏南线318自驾'][i % 5],
      amount: [35800, 8800, 1280, 22800, 15800][i % 5],
      status: ['已支付', '处理中', '待审核', '已完成', '已取消'][i % 5],
      time: '2026-03-01 10:25'
    }));

    return HttpResponse.json({
      code: 1,
      data: {
        list,
        total: 100,
        pages: 10,
        current: pageNo
      }
    });
  }),

  // Console Users handlers
  http.get('/api/console/users', ({ request }) => {
    const url = new URL(request.url);
    const pageNo = parseInt(url.searchParams.get('pageNo') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '8');

    const list = Array.from({ length: pageSize }).map((_, i) => ({
      id: 1000 + (pageNo - 1) * pageSize + i,
      name: ['李晓明', '王思齐', '张婉莹', '赵子豪', '陈奕迅'][i % 5],
      isAdmin: i === 2,
      email: `user${i}@example.com`,
      phone: `13${Math.floor(Math.random() * 9)}****${Math.floor(Math.random() * 9000) + 1000}`,
      regDate: '2026-01-15',
      status: i === 3 ? '已冻结' : '正常'
    }));

    return HttpResponse.json({
      code: 1,
      data: {
        list,
        total: 50,
        pages: 7,
        current: pageNo
      }
    });
  }),

  // Console Logs handlers
  http.get('/api/console/logs', ({ request }) => {
    const url = new URL(request.url);
    const pageNo = parseInt(url.searchParams.get('pageNo') || '1');
    return HttpResponse.json({
      code: 1,
      data: {
        list: [
          { id: 10001, type: 'INFO', module: '用户模块', action: '用户登录', operator: '李晓明', ip: '192.168.1.102', time: '2026-03-01 10:25:34', status: '成功' },
          { id: 10002, type: 'WARN', module: '商品模块', action: '下架商品', operator: '超级管理员', ip: '127.0.0.1', time: '2026-03-01 11:12:05', status: '成功' }
        ],
        total: 1280,
        pages: 640,
        current: pageNo
      }
    });
  }),

  // Common handlers
  http.get('/api/common/config', () => {
    return HttpResponse.json({ code: 1, message: 'Success', data: { version: '1.0.0', features: ['auth', 'products'] } });
  }),
];
