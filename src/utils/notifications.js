export function requestNotifyPermission() {
  if (!('Notification' in window)) return Promise.resolve('unsupported')
  return Notification.requestPermission()
}

export function notify(title, options) {
  if (!('Notification' in window)) return
  if (Notification.permission === 'granted') new Notification(title, options)
}

