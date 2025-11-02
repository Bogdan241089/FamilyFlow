// Export/Import Family Data
export const dataExportService = {
  exportToJSON: async (familyData) => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      family: familyData.family,
      members: familyData.members,
      tasks: familyData.tasks,
      events: familyData.events,
      achievements: familyData.achievements
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familyflow-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importFromJSON: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.version && data.family) {
            resolve(data);
          } else {
            reject(new Error('Invalid backup file'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};
