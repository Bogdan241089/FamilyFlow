// Простой парсер голосовых команд без ИИ (fallback)

export function parseSimpleVoiceCommand(text) {
  const lowerText = text.toLowerCase();
  
  // Список покупок
  if (lowerText.includes('добав') && (lowerText.includes('список') || lowerText.includes('покупк'))) {
    const items = extractItems(text);
    if (items.length > 0) {
      return {
        action: 'shopping',
        data: { items },
        response: `Добавлено ${items.length} товаров в список покупок`
      };
    }
  }
  
  // Создание задачи
  if (lowerText.includes('созда') && lowerText.includes('задач')) {
    const title = extractTaskTitle(text);
    return {
      action: 'task',
      data: { 
        title: title || 'Новая задача',
        description: '',
        priority: 'medium',
        category: 'other'
      },
      response: 'Задача создана'
    };
  }
  
  // Календарь
  if (lowerText.includes('напомн') || lowerText.includes('событи') || lowerText.includes('календар')) {
    const title = extractEventTitle(text);
    return {
      action: 'calendar',
      data: {
        title: title || 'Новое событие',
        description: ''
      },
      response: 'Событие добавлено в календарь'
    };
  }
  
  return null;
}

function extractItems(text) {
  const items = [];
  const words = text.split(/\s+/);
  
  // Ищем слова после "добавь", "купи" и т.д.
  const triggers = ['добавь', 'добави', 'купи', 'купить'];
  let startIndex = -1;
  
  for (let i = 0; i < words.length; i++) {
    if (triggers.some(t => words[i].toLowerCase().includes(t))) {
      startIndex = i + 1;
      break;
    }
  }
  
  if (startIndex > -1) {
    for (let i = startIndex; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (!['в', 'список', 'покупок', 'и', 'а', 'также'].includes(word)) {
        items.push(words[i]);
      }
    }
  }
  
  return items;
}

function extractTaskTitle(text) {
  const match = text.match(/задач[уа]?\s+(.+)/i);
  return match ? match[1].trim() : text;
}

function extractEventTitle(text) {
  const match = text.match(/(?:напомни|событие|календарь)\s+(?:о\s+)?(.+)/i);
  return match ? match[1].trim() : text;
}
