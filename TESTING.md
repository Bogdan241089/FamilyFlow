# Руководство по тестированию FamilyFlow

## 🧪 Типы тестов

### 1. Unit тесты
Тестируют отдельные функции и сервисы в изоляции.

**Расположение**: `src/services/__tests__/`

**Запуск**:
```bash
npm test -- --testPathPattern=services
```

### 2. Integration тесты
Тестируют компоненты с их зависимостями.

**Расположение**: `src/components/__tests__/`

**Запуск**:
```bash
npm test -- --testPathPattern=components
```

### 3. E2E тесты
Тестируют полные пользовательские сценарии.

**Расположение**: `src/__tests__/`

**Запуск**:
```bash
npm test -- --testPathPattern=__tests__
```

## 🚀 Команды

### Запуск всех тестов
```bash
npm test
```

### Запуск с покрытием
```bash
npm run test:coverage
```

### Запуск в CI режиме
```bash
npm run test:ci
```

### Запуск конкретного теста
```bash
npm test -- gamificationService
```

### Обновление снапшотов
```bash
npm test -- -u
```

## 📊 Покрытие кода

Минимальные требования:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

Отчёт генерируется в `coverage/lcov-report/index.html`

## ✍️ Написание тестов

### Unit тест (пример)
```javascript
import { calculatePoints } from '../gamificationService';

describe('calculatePoints', () => {
  test('returns 30 for high priority', () => {
    const result = calculatePoints({ priority: 'high' });
    expect(result).toBe(30);
  });
});
```

### Integration тест (пример)
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  test('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### E2E тест (пример)
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('User can create task', () => {
  test('creates new task', async () => {
    render(<App />);
    
    // Navigate to tasks
    fireEvent.click(screen.getByText('Задачи'));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Название'), {
      target: { value: 'New Task' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Добавить'));
    
    // Verify
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });
});
```

## 🎯 Best Practices

### 1. Именование
- Файлы: `ComponentName.test.js`
- Describe блоки: описывают компонент/функцию
- Test блоки: описывают поведение

### 2. Структура теста (AAA)
```javascript
test('description', () => {
  // Arrange - подготовка
  const input = { value: 10 };
  
  // Act - действие
  const result = myFunction(input);
  
  // Assert - проверка
  expect(result).toBe(20);
});
```

### 3. Моки
```javascript
// Mock функции
const mockFn = jest.fn();

// Mock модуля
jest.mock('../api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: [] }))
}));

// Mock Firebase
jest.mock('../firebase/config');
```

### 4. Async тесты
```javascript
test('async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Или с waitFor
test('waits for element', async () => {
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

## 🐛 Отладка тестов

### Debug конкретный тест
```javascript
test.only('this test only', () => {
  // Только этот тест запустится
});
```

### Skip теста
```javascript
test.skip('skip this test', () => {
  // Этот тест будет пропущен
});
```

### Вывод DOM
```javascript
import { screen } from '@testing-library/react';

test('debug', () => {
  render(<Component />);
  screen.debug(); // Выведет текущий DOM
});
```

## 📈 CI/CD интеграция

### GitHub Actions
```yaml
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## 🔍 Что тестировать

### ✅ Обязательно
- Критичная бизнес-логика
- Утилиты и хелперы
- Сложные вычисления
- Условная логика
- Обработка ошибок

### ⚠️ Опционально
- Простые компоненты
- Стили
- Константы

### ❌ Не тестировать
- Сторонние библиотеки
- Тривиальный код
- Конфигурационные файлы

## 📚 Ресурсы

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
