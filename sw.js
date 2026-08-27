// sw.js
self.addEventListener('push', function(event) {
    let payload = { title: '任务提醒', body: '您有任务逾期啦！' };
    if (event.data) {
        try { payload = event.data.json(); } catch(e) { payload.body = event.data.text(); }
    }
    
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: 'icon.png',
            badge: 'icon.png',
            vibrate: [200, 100, 200]
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('./');
        })
    );
});