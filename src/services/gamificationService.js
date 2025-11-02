import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

const ACHIEVEMENTS = [
  { id: 'first_task', name: 'Первые шаги', desc: 'Выполните первую задачу', icon: '🌟', points: 10, requirement: 1, category: 'tasks' },
  { id: 'task_5', name: 'Трудяга', desc: 'Выполните 5 задач', icon: '💪', points: 50, requirement: 5, category: 'tasks' },
  { id: 'task_10', name: 'Профессионал', desc: 'Выполните 10 задач', icon: '🏆', points: 100, requirement: 10, category: 'tasks' },
  { id: 'task_25', name: 'Мастер', desc: 'Выполните 25 задач', icon: '👑', points: 250, requirement: 25, category: 'tasks' },
  { id: 'task_50', name: 'Легенда', desc: 'Выполните 50 задач', icon: '⭐', points: 500, requirement: 50, category: 'tasks' },
  { id: 'task_100', name: 'Титан', desc: 'Выполните 100 задач', icon: '🦸', points: 1000, requirement: 100, category: 'tasks' },
  { id: 'streak_3', name: 'На волне', desc: '3 дня подряд', icon: '🔥', points: 30, requirement: 3, category: 'streak' },
  { id: 'streak_7', name: 'Неделя силы', desc: '7 дней подряд', icon: '🚀', points: 100, requirement: 7, category: 'streak' },
  { id: 'streak_14', name: 'Две недели', desc: '14 дней подряд', icon: '💎', points: 250, requirement: 14, category: 'streak' },
  { id: 'streak_30', name: 'Месяц силы', desc: '30 дней подряд', icon: '🏅', points: 500, requirement: 30, category: 'streak' },
  { id: 'early_bird', name: 'Ранняя птичка', desc: 'Выполните задачу до срока', icon: '🐦', points: 20, requirement: 1, category: 'special' },
  { id: 'team_player', name: 'Командный игрок', desc: 'Помогите 5 членам семьи', icon: '🤝', points: 75, requirement: 5, category: 'social' },
  { id: 'speed_demon', name: 'Скоростной демон', desc: 'Выполните 5 задач за день', icon: '⚡', points: 100, requirement: 5, category: 'special' },
  { id: 'perfectionist', name: 'Перфекционист', desc: 'Выполните 10 задач без просрочек', icon: '✨', points: 150, requirement: 10, category: 'special' },
  { id: 'family_hero', name: 'Герой семьи', desc: 'Наберите 1000 очков', icon: '🦸‍♂️', points: 0, requirement: 1000, category: 'points' }
];

const LEVELS = [
  { level: 1, name: 'Новичок', minPoints: 0, icon: '🥉' },
  { level: 2, name: 'Помощник', minPoints: 100, icon: '🥈' },
  { level: 3, name: 'Исполнитель', minPoints: 300, icon: '🥇' },
  { level: 4, name: 'Эксперт', minPoints: 600, icon: '💎' },
  { level: 5, name: 'Мастер', minPoints: 1000, icon: '👑' },
  { level: 6, name: 'Легенда', minPoints: 2000, icon: '⭐' }
];

export async function getUserStats(userId) {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const statsSnap = await getDoc(statsRef);
    if (!statsSnap.exists()) {
      const defaultStats = { points: 0, tasksCompleted: 0, streak: 0, lastTaskDate: null, achievements: [] };
      await setDoc(statsRef, defaultStats);
      return defaultStats;
    }
    return statsSnap.data();
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { points: 0, tasksCompleted: 0, streak: 0, lastTaskDate: null, achievements: [] };
  }
}

export async function addPoints(userId, points, reason) {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const statsSnap = await getDoc(statsRef);
    if (!statsSnap.exists()) {
      await setDoc(statsRef, { points, tasksCompleted: 0, streak: 0, lastTaskDate: null, achievements: [] });
    } else {
      await updateDoc(statsRef, { points: increment(points) });
    }
    return { points, reason };
  } catch (error) {
    console.error('Error adding points:', error);
    return { points: 0, reason };
  }
}

export async function completeTask(userId, taskData) {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const stats = await getUserStats(userId);
    
    let points = 10;
    if (taskData.priority === 'high') points = 20;
    if (taskData.priority === 'medium') points = 15;
    
    const today = new Date().toDateString();
    const lastDate = stats.lastTaskDate ? new Date(stats.lastTaskDate).toDateString() : null;
    let newStreak = stats.streak || 0;
    
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      newStreak = lastDate === yesterday ? newStreak + 1 : 1;
    }
    
    await updateDoc(statsRef, {
      points: increment(points),
      tasksCompleted: increment(1),
      streak: newStreak,
      lastTaskDate: new Date().toISOString()
    });
    
    const newStats = await getUserStats(userId);
    const unlockedAchievements = checkAchievements(newStats);
    
    return { points, newStreak, unlockedAchievements };
  } catch (error) {
    console.error('Error completing task:', error);
    return { points: 10, newStreak: 0, unlockedAchievements: [] };
  }
}

function checkAchievements(stats) {
  const unlocked = [];
  ACHIEVEMENTS.forEach(ach => {
    if (stats.achievements?.includes(ach.id)) return;
    
    let isUnlocked = false;
    if (ach.id.startsWith('task_')) {
      isUnlocked = stats.tasksCompleted >= ach.requirement;
    } else if (ach.id.startsWith('streak_')) {
      isUnlocked = stats.streak >= ach.requirement;
    } else if (ach.id === 'first_task') {
      isUnlocked = stats.tasksCompleted >= 1;
    }
    
    if (isUnlocked) unlocked.push(ach);
  });
  return unlocked;
}

export async function unlockAchievement(userId, achievementId) {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const stats = await getUserStats(userId);
    
    if (stats.achievements?.includes(achievementId)) return null;
    
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return null;
    
    const newAchievements = [...(stats.achievements || []), achievementId];
    await updateDoc(statsRef, {
      achievements: newAchievements,
      points: increment(achievement.points)
    });
    
    return achievement;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return null;
  }
}

export function getLevel(points) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(points) {
  const currentLevel = getLevel(points);
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  return LEVELS[currentIndex + 1] || null;
}

export { ACHIEVEMENTS, LEVELS };
