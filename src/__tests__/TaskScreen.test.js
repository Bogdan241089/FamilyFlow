import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskScreen from '../screens/TaskScreen';

describe('TaskScreen', () => {
  it('renders task screen title', () => {
    render(<TaskScreen />);
    expect(screen.getByText(/Задачи семьи/i)).toBeInTheDocument();
  });
});
