import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function globalSearch(familyId, searchQuery) {
  if (!searchQuery || searchQuery.trim().length < 2) return [];
  
  const query = searchQuery.toLowerCase().trim();
  const results = [];

  try {
    // Поиск по задачам
    const tasksSnap = await getDocs(collection(db, `families/${familyId}/tasks`));
    tasksSnap.forEach(doc => {
      const task = doc.data();
      if (task.title?.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query)) {
        results.push({
          id: doc.id,
          type: 'task',
          title: task.title,
          description: task.description,
          data: task
        });
      }
    });

    // Поиск по событиям календаря
    const eventsSnap = await getDocs(collection(db, `families/${familyId}/events`));
    eventsSnap.forEach(doc => {
      const event = doc.data();
      if (event.title?.toLowerCase().includes(query) || event.description?.toLowerCase().includes(query)) {
        results.push({
          id: doc.id,
          type: 'event',
          title: event.title,
          description: event.description,
          data: event
        });
      }
    });

    // Поиск по списку покупок
    const shoppingSnap = await getDocs(collection(db, `families/${familyId}/shopping`));
    shoppingSnap.forEach(doc => {
      const item = doc.data();
      if (item.name?.toLowerCase().includes(query) || item.category?.toLowerCase().includes(query)) {
        results.push({
          id: doc.id,
          type: 'shopping',
          title: item.name,
          description: item.category,
          data: item
        });
      }
    });

    // Поиск по членам семьи
    const membersSnap = await getDocs(collection(db, `families/${familyId}/members`));
    const memberIds = membersSnap.docs.map(d => d.id);
    
    for (const memberId of memberIds) {
      const profileSnap = await getDocs(collection(db, 'profiles'));
      profileSnap.forEach(doc => {
        if (doc.id === memberId) {
          const profile = doc.data();
          if (profile.name?.toLowerCase().includes(query)) {
            results.push({
              id: doc.id,
              type: 'member',
              title: profile.name,
              description: membersSnap.docs.find(m => m.id === memberId)?.data()?.role || 'member',
              data: profile
            });
          }
        }
      });
    }

  } catch (error) {
    console.error('Ошибка поиска:', error);
  }

  return results;
}
