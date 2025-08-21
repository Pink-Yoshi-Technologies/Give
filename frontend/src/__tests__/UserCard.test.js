import { render, screen } from '@testing-library/react';
import UserCard from '../components/UserCard.jsx';

describe('UserCard', () => {
  const user = { name: 'testuser', profilePic: '/test.jpg' };
  const group = { name: 'Test Group' };
  it('renders user info and group', () => {
    render(<UserCard user={user} group={group} timeLeft="2h" />);
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText(/Test Group/)).toBeInTheDocument();
    expect(screen.getByText(/2h left/)).toBeInTheDocument();
  });
});
