import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast', () => {
  test('renders toast with message', () => {
    render(<Toast message="Test message" type="success" onClose={() => {}} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" type="info" onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  test('auto-closes after timeout', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    
    render(<Toast message="Test" type="success" onClose={onClose} />);
    
    jest.advanceTimersByTime(3000);
    
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
    
    jest.useRealTimers();
  });

  test('applies correct class for error type', () => {
    const { container } = render(<Toast message="Error" type="error" onClose={() => {}} />);
    expect(container.firstChild).toHaveClass('toast-error');
  });
});
