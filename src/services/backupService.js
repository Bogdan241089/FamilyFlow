export async function exportBackup(familyId, db) {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      familyId: familyId,
      data: {}
    };

    const collections = ['tasks', 'calendar', 'shopping', 'chat'];
    
    for (const collName of collections) {
      const snapshot = await getDocs(collection(db, `families/${familyId}/${collName}`));
      backup.data[collName] = [];
      snapshot.forEach(doc => {
        backup.data[collName].push({ id: doc.id, ...doc.data() });
      });
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `familyflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    return { success: true, message: 'Резервная копия создана' };
  } catch (error) {
    console.error('Backup error:', error);
    return { success: false, message: 'Ошибка создания резервной копии' };
  }
}

export async function importBackup(file, familyId, db) {
  try {
    const { collection, doc, setDoc } = await import('firebase/firestore');
    
    const text = await file.text();
    const backup = JSON.parse(text);

    if (!backup.version || !backup.data) {
      throw new Error('Неверный формат файла');
    }

    for (const [collName, items] of Object.entries(backup.data)) {
      for (const item of items) {
        const { id, ...data } = item;
        await setDoc(doc(db, `families/${familyId}/${collName}`, id), data);
      }
    }

    return { success: true, message: 'Данные восстановлены' };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, message: 'Ошибка восстановления данных' };
  }
}
