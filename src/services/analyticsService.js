// Analytics Events Tracking
export const analyticsService = {
  events: [],

  track: (eventName, properties = {}) => {
    const event = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      url: window.location.pathname
    };
    
    analyticsService.events.push(event);
    console.log('📊 Analytics:', eventName, properties);
    
    // Здесь можно добавить отправку в Google Analytics, Mixpanel и т.д.
  },

  trackPageView: (page) => {
    analyticsService.track('page_view', { page });
  },

  trackTaskCreated: (taskData) => {
    analyticsService.track('task_created', {
      priority: taskData.priority,
      hasDeadline: !!taskData.deadline,
      hasAssignee: !!taskData.assignedTo
    });
  },

  trackTaskCompleted: (taskId) => {
    analyticsService.track('task_completed', { taskId });
  },

  trackAchievementUnlocked: (achievementId) => {
    analyticsService.track('achievement_unlocked', { achievementId });
  },

  getEvents: () => analyticsService.events,

  clear: () => { analyticsService.events = []; }
};
