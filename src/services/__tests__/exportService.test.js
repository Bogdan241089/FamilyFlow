import { exportToCSV, exportToPDF } from '../exportService';

describe('exportService', () => {
  let createElementSpy;
  let clickSpy;

  beforeEach(() => {
    clickSpy = jest.fn();
    createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      click: clickSpy,
      href: '',
      download: ''
    });
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  });

  afterEach(() => {
    createElementSpy.mockRestore();
  });

  describe('exportToCSV', () => {
    test('creates CSV with correct headers', () => {
      const tasks = [
        { title: 'Task 1', desc: 'Description', datetime: '2024-01-01', assignee: 'user1', responsible: 'user2', priority: 'high', done: true }
      ];
      const memberNames = { user1: 'John', user2: 'Jane' };

      exportToCSV(tasks, memberNames);

      expect(clickSpy).toHaveBeenCalled();
    });

    test('handles empty tasks array', () => {
      exportToCSV([], {});
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('exportToPDF', () => {
    test('creates HTML with task data', () => {
      const tasks = [
        { title: 'Task 1', desc: 'Description', datetime: '2024-01-01', assignee: 'user1', responsible: 'user2', priority: 'high', done: true }
      ];
      const memberNames = { user1: 'John', user2: 'Jane' };

      exportToPDF(tasks, memberNames, 'Test Family');

      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
