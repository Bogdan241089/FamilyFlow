import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen';
import { AuthProvider } from '../contexts/AuthContext';

const MockedLoginScreen = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>
  </BrowserRouter>
);

describe('Authentication Flow', () => {
  test('renders login form', () => {
    render(<MockedLoginScreen />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/пароль/i)).toBeInTheDocument();
  });

  test('shows validation error for empty email', async () => {
    render(<MockedLoginScreen />);
    
    const submitButton = screen.getByRole('button', { name: /войти/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/введите email/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<MockedLoginScreen />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /войти/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/некорректный email/i)).toBeInTheDocument();
    });
  });
});
