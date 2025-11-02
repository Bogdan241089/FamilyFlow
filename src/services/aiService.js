import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY не установлен. Голосовые команды и ИИ не будут работать.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function generateTaskFromText(text) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Проанализируй текст и создай структурированную задачу в JSON формате.
Текст: "${text}"

Верни JSON с полями:
{
  "title": "краткое название задачи",
  "description": "подробное описание",
  "priority": "low/medium/high",
  "category": "home/work/study/sport/health/other",
  "estimatedTime": "примерное время выполнения"
}

Только JSON, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}

export async function suggestTasks(familyContext) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `На основе контекста семьи предложи 3 полезные задачи.
Контекст: ${JSON.stringify(familyContext)}

Верни JSON массив задач:
[
  {
    "title": "название",
    "description": "описание",
    "priority": "low/medium/high",
    "category": "home/work/study/sport/health/other"
  }
]

Только JSON массив, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI Error:', error);
    return [];
  }
}

export async function analyzeProductivity(tasks) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Проанализируй продуктивность на основе задач и дай рекомендации.
Задачи: ${JSON.stringify(tasks)}

Верни JSON:
{
  "score": "оценка от 1 до 10",
  "insights": ["инсайт 1", "инсайт 2", "инсайт 3"],
  "recommendations": ["рекомендация 1", "рекомендация 2"]
}

Только JSON, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}

export async function parseVoiceCommand(voiceText) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Проанализируй голосовую команду и определи действие.
Команда: "${voiceText}"

Верни JSON:
{
  "action": "task/shopping/calendar/event",
  "data": {
    "title": "название",
    "description": "описание",
    "priority": "low/medium/high",
    "category": "home/work/study/sport/health/other",
    "items": ["элемент1", "элемент2"] // для списка покупок
  },
  "response": "текст ответа пользователю"
}

Примеры:
- "Добавь молоко и хлеб в список покупок" → action: "shopping", items: ["молоко", "хлеб"]
- "Создай задачу убрать квартиру" → action: "task", title: "Убрать квартиру"
- "Напомни завтра в 10 утра о встрече" → action: "calendar"

Только JSON, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}
