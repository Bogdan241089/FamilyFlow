import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomeScreen from '../screens/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders welcome text', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/FamilyFlow/i)).toBeInTheDocument();
    expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument();
  });
});
