import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('REACT_APP_GEMINI_API_KEY не установлен. Голосовые команды и ИИ не будут работать.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

function safeJsonParse(jsonText, fallback) {
  try {
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch {
    return fallback;
  }
}

export async function generateTaskFromText(text) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Проанализируй текст и создай структурированную задачу в JSON формате.\nТекст: "${text}"\n\nВерни JSON с полями:\n{\n  "title": "краткое название задачи",\n  "description": "подробное описание",\n  "priority": "low/medium/high",\n  "category": "home/work/study/sport/health/other",\n  "estimatedTime": "примерное время выполнения"\n}\n\nТолько JSON, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = safeJsonParse(jsonText, { title: text.slice(0, 50), description: text, priority: 'medium', category: 'other' });
    return parsed.title ? parsed : { title: 'Задача', description: text, priority: 'medium', category: 'other' };
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}

export async function suggestTasks(familyContext) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `На основе контекста семьи предложи 3 полезные задачи.\nКонтекст: ${JSON.stringify(familyContext)}\n\nВерни JSON массив задач:\n[\n  {\n    "title": "название",\n    "description": "описание",\n    "priority": "low/medium/high",\n    "category": "home/work/study/sport/health/other"\n  }\n]\n\nТолько JSON массив, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = safeJsonParse(jsonText, []);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('AI Error:', error);
    return [];
  }
}

export async function analyzeProductivity(tasks) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Проанализируй продуктивность на основе задач и дай рекомендации.\nЗадачи: ${JSON.stringify(tasks)}\n\nВерни JSON:\n{\n  "score": "оценка от 1 до 10",\n  "insights": ["инсайт 1", "инсайт 2", "инсайт 3"],\n  "recommendations": ["рекомендация 1", "рекомендация 2"]\n}\n\nТолько JSON, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = safeJsonParse(jsonText, { score: 5, insights: ['Анализ недоступен'], recommendations: ['Продолжайте работать'] });
    return parsed.score ? parsed : { score: 5, insights: ['Анализ недоступен'], recommendations: ['Продолжайте работать'] };
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}

export async function parseVoiceCommand(voiceText) {
  if (!genAI) throw new Error('ИИ не настроен');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Проанализируй голосовую команду и определи действие.\nКоманда: "${voiceText}"\n\nВерни JSON:\n{\n  "action": "task/shopping/calendar/event",\n  "data": {\n    "title": "название",\n    "description": "описание",\n    "priority": "low/medium/high",\n    "category": "home/work/study/sport/health/other",\n    "items": ["элемент1", "элемент2"] // для списка покупок\n  },\n  "response": "текст ответа пользователю"\n}\n\nПримеры:\n- "Добавь молоко и хлеб в список покупок" → action: "shopping", items: ["молоко", "хлеб"]\n- "Создай задачу убрать квартиру" → action: "task", title: "Убрать квартиру"\n- "Напомни завтра в 10 утра о встрече" → action: "calendar"\n\nТолько JSON, без дополнительного текста.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = safeJsonParse(jsonText, { action: 'task', data: { title: voiceText }, response: 'Команда обработана' });
    return parsed.action ? parsed : { action: 'task', data: { title: voiceText }, response: 'Команда обработана' };
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}