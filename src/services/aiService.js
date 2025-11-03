const YANDEX_API_KEY = process.env.REACT_APP_YANDEX_API_KEY || '';
const YANDEX_FOLDER_ID = process.env.REACT_APP_YANDEX_FOLDER_ID || '';

if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
  console.warn('YandexGPT не настроен. Добавьте REACT_APP_YANDEX_API_KEY и REACT_APP_YANDEX_FOLDER_ID');
}

async function callYandexGPT(prompt) {
  const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID
    },
    body: JSON.stringify({
      modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt-lite/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.6,
        maxTokens: 2000
      },
      messages: [
        {
          role: 'system',
          text: 'Ты помощник для семейного органайзера. Отвечай только в формате JSON.'
        },
        {
          role: 'user',
          text: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`YandexGPT error: ${response.status}`);
  }

  const data = await response.json();
  return data.result.alternatives[0].message.text;
}

function safeJsonParse(jsonText, fallback) {
  try {
    const cleaned = jsonText.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

export async function generateTaskFromText(text) {
  if (!YANDEX_API_KEY) throw new Error('ИИ не настроен');
  try {
    const prompt = `Проанализируй текст и создай задачу в JSON:\n"${text}"\n\nФормат:\n{\n  "title": "название",\n  "description": "описание",\n  "priority": "low/medium/high",\n  "category": "home/work/study/sport/health/other",\n  "estimatedTime": "время"\n}`;
    
    const result = await callYandexGPT(prompt);
    const parsed = safeJsonParse(result, { title: text.slice(0, 50), description: text, priority: 'medium', category: 'other' });
    return parsed.title ? parsed : { title: 'Задача', description: text, priority: 'medium', category: 'other' };
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}

export async function suggestTasks(familyContext) {
  if (!YANDEX_API_KEY) throw new Error('ИИ не настроен');
  try {
    const prompt = `Предложи 3 задачи для семьи. Контекст: ${JSON.stringify(familyContext)}\n\nФормат JSON массив:\n[{"title":"","description":"","priority":"","category":""}]`;
    
    const result = await callYandexGPT(prompt);
    const parsed = safeJsonParse(result, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('AI Error:', error);
    return [];
  }
}

export async function analyzeProductivity(tasks) {
  if (!YANDEX_API_KEY) throw new Error('ИИ не настроен');
  try {
    const prompt = `Проанализируй продуктивность. Задачи: ${JSON.stringify(tasks)}\n\nФормат:\n{"score":5,"insights":[""],"recommendations":[""]}`;
    
    const result = await callYandexGPT(prompt);
    const parsed = safeJsonParse(result, { score: 5, insights: ['Анализ недоступен'], recommendations: ['Продолжайте работать'] });
    return parsed.score ? parsed : { score: 5, insights: ['Анализ недоступен'], recommendations: ['Продолжайте работать'] };
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}

export async function parseVoiceCommand(voiceText) {
  if (!YANDEX_API_KEY) throw new Error('ИИ не настроен');
  try {
    const prompt = `Команда: "${voiceText}"\n\nФормат:\n{"action":"task/shopping/calendar","data":{"title":""},"response":""}`;
    
    const result = await callYandexGPT(prompt);
    const parsed = safeJsonParse(result, { action: 'task', data: { title: voiceText }, response: 'Команда обработана' });
    return parsed.action ? parsed : { action: 'task', data: { title: voiceText }, response: 'Команда обработана' };
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}