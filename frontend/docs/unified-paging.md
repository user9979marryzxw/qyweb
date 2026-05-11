# UnifiedPaginationModule 接入说明

## 1. 模块简介
`UnifiedPaginationModule` 是为青云旅游 B2C 平台设计的通用分页数据流组件。它集成了统一的请求规范、响应模型处理、加载态 UI 以及基于 LRU 策略的 Pinia 缓存机制。

## 2. 核心特性
- **统一参数**: 自动封装 `pageNo`, `pageSize`, `category` 等参数。
- **智能缓存**: 采用 `Map` 实现 LRU 缓存，最大容量 50 条，TTL 5 分钟。
- **极致体验**: 内置 Apple 风格的平滑骨架屏切换效果。
- **性能监控**: 自动记录并输出首屏渲染时间（目标 ≤ 300ms）。

## 3. 接入方式

### 3.1 基础用法
```vue
<UnifiedPaginationModule 
  category="domestic"
  fetchUrl="/api/products"
  :pageSize="12"
  :queryParams="filters"
>
  <template #default="{ list }">
    <div class="grid grid-cols-4 gap-8">
      <ProductCard v-for="item in list" :key="item.id" :data="item" />
    </div>
  </template>
</UnifiedPaginationModule>
```

### 3.2 参数说明
| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| category | string | 是 | 业务分类，用于缓存隔离（如 domestic, international, visa） |
| fetchUrl | string | 是 | 后端 API 地址 |
| pageSize | number | 否 | 每页条数，默认 12 |
| queryParams | object | 否 | 额外的查询参数，变化时自动触发刷新 |

## 4. 扩展点
- **Slot**: `default` 插槽接收 `list` 数据，由调用方决定渲染样式。
- **Events**: `paging` 事件返回分页操作埋点信息。
