import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function createRecurringTasks() {
  try {
    const familiesSnap = await getDocs(collection(db, 'families'));
    
    for (const familyDoc of familiesSnap.docs) {
      const familyId = familyDoc.id;
      const tasksSnap = await getDocs(
        query(
          collection(db, `families/${familyId}/tasks`),
          where('recurring', '!=', 'none')
        )
      );
      
      for (const taskDoc of tasksSnap.docs) {
        const task = taskDoc.data();
        const taskDate = new Date(task.datetime);
        const now = new Date();
        
        let shouldCreate = false;
        let newDate = new Date(taskDate);
        
        if (task.recurring === 'daily' && taskDate < now) {
          newDate.setDate(now.getDate() + 1);
          shouldCreate = true;
        } else if (task.recurring === 'weekly' && taskDate < now) {
          newDate.setDate(now.getDate() + 7);
          shouldCreate = true;
        } else if (task.recurring === 'monthly' && taskDate < now) {
          newDate.setMonth(now.getMonth() + 1);
          shouldCreate = true;
        }
        
        if (shouldCreate) {
          const newTask = {
            ...task,
            datetime: newDate.toISOString(),
            done: false,
            confirmed: false,
            createdAt: new Date().toISOString()
          };
          
          await addDoc(collection(db, `families/${familyId}/tasks`), newTask);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка создания повторяющихся задач:', error);
  }
}

export function startRecurringTasksScheduler() {
  createRecurringTasks();
  setInterval(createRecurringTasks, 24 * 60 * 60 * 1000);
}
