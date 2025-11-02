export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Браузер не поддерживает уведомления');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      return permission === 'granted';
    });
  }

  return false;
}

export function showNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.png',
      badge: '/favicon.png',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
}

export function scheduleTaskReminder(task, minutesBefore = 60) {
  const taskTime = new Date(task.datetime);
  const reminderTime = new Date(taskTime.getTime() - minutesBefore * 60000);
  const now = new Date();

  if (reminderTime > now) {
    const delay = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      showNotification('Напоминание о задаче', {
        body: `${task.title} через ${minutesBefore} минут`,
        tag: `task-${task.id}`,
        requireInteraction: true
      });
    }, delay);
  }
}

export function notifyTaskAssigned(task, assigneeName) {
  showNotification('Новая задача', {
    body: `${assigneeName}, вам назначена задача: ${task.title}`,
    tag: `task-assigned-${task.id}`
  });
}

export function notifyTaskCompleted(task, userName) {
  showNotification('Задача выполнена', {
    body: `${userName} выполнил задачу: ${task.title}`,
    tag: `task-completed-${task.id}`
  });
}

export function notifyNewFamilyMember(memberName) {
  showNotification('Новый член семьи', {
    body: `${memberName} присоединился к семье!`,
    tag: 'new-member'
  });
}

export function notifyAchievement(achievement) {
  showNotification('🏆 Новое достижение!', {
    body: `${achievement.icon} ${achievement.name}: ${achievement.desc}`,
    tag: `achievement-${achievement.id}`,
    requireInteraction: true
  });
}
