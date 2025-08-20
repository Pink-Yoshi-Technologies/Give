import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

describe('Login', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
  it('shows error on failed login', async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'fail@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Log In'));
  });
});
