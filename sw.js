const CACHE_NAME = 'powers-solver-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// تثبيت الـ Service Worker وحفظ الملفات في الذاكرة المؤقتة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // التفعيل الفوري دون انتظار إغلاق التبويبات القديمة
});

// إزالة الذاكرة المؤقتة القديمة وحذف الإصدارات التالفة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // التحكم الفوري بالصفحات المفتوحة
});

// استرجاع البيانات من الكاش أو استخدام الإنترنت عند توفره
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
