<template>
  <footer class="bg-white border-t border-gray-100 py-20 px-8">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div class="col-span-1 md:col-span-2">
        <div class="text-2xl font-bold text-brand-green mb-6">青云旅游</div>
        <p class="text-brand-slate text-sm max-w-xs leading-relaxed">
          青云旅游致力于为精英人群提供高品质的定制化旅游方案，以极致的服务和深厚的专业知识，为您打造独一无二的旅程。
        </p>
      </div>
      <div>
        <h5 class="font-bold mb-6 text-sm">快速链接</h5>
        <ul class="space-y-4 text-sm text-brand-slate">
          <li><router-link to="/about" class="hover:text-brand-green">关于我们</router-link></li>
          <li><router-link to="/contact" class="hover:text-brand-green">联系客服</router-link></li>
          <li><router-link to="/faq" class="hover:text-brand-green">常见问题</router-link></li>
        </ul>
      </div>
      <div>
        <h5 class="font-bold mb-6 text-sm">法律声明</h5>
        <ul class="space-y-4 text-sm text-brand-slate">
          <li><router-link to="/terms" class="hover:text-brand-green">服务协议</router-link></li>
          <li><router-link to="/privacy" class="hover:text-brand-green">隐私政策</router-link></li>
          <li><router-link to="/refund" class="hover:text-brand-green">退款说明</router-link></li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 text-center text-xs text-brand-slate">
      © 2026 青云旅游 (Qingyun Travel). All rights reserved.
    </div>
  </footer>
</template>
