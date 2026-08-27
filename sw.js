self.addEventListener('push', function (event) {
    if (!event.data) return;
    const data = event.data.json();
    const title = data.title || "任务看板提醒";
    const options = {
        body: data.body || "",
        icon: "icon.png",
        badge: "icon.png",
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: {
            subtaskId: data.subtaskId
        }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (let client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.postMessage({
                        action: 'LOCATE_SUBTASK',
                        subtaskId: event.notification.data.subtaskId
                    });
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});