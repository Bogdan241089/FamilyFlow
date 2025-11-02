export function exportToCSV(tasks, memberNames) {
  const headers = ['Название', 'Описание', 'Дата', 'Исполнитель', 'Ответственный', 'Приоритет', 'Статус'];
  const rows = tasks.map(task => [
    task.title,
    task.desc || '',
    task.datetime,
    memberNames[task.assignee] || task.assignee,
    memberNames[task.responsible] || task.responsible,
    task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий',
    task.done ? 'Выполнено' : 'Не выполнено'
  ]);
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

export function exportToPDF(tasks, memberNames, familyName) {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Задачи ${familyName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #4caf50; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4caf50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    .high { color: #f44336; font-weight: bold; }
    .medium { color: #ff9800; }
    .low { color: #4caf50; }
  </style>
</head>
<body>
  <h1>Задачи семьи ${familyName}</h1>
  <p>Дата экспорта: ${new Date().toLocaleDateString('ru-RU')}</p>
  <table>
    <thead>
      <tr>
        <th>Название</th>
        <th>Описание</th>
        <th>Дата</th>
        <th>Исполнитель</th>
        <th>Ответственный</th>
        <th>Приоритет</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      ${tasks.map(task => `
        <tr>
          <td>${task.title}</td>
          <td>${task.desc || '-'}</td>
          <td>${new Date(task.datetime).toLocaleString('ru-RU')}</td>
          <td>${memberNames[task.assignee] || task.assignee}</td>
          <td>${memberNames[task.responsible] || task.responsible}</td>
          <td class="${task.priority}">${task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}</td>
          <td>${task.done ? '✓ Выполнено' : '○ Не выполнено'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
  `;
  
  const blob = new Blob([content], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `tasks_${new Date().toISOString().split('T')[0]}.html`;
  link.click();
}
