import { render, screen } from '@testing-library/react';
import Post from '../components/Post/Post';

describe('Post', () => {
  it('renders UserCard, PostData, and PollBox', () => {
    const user = { name: 'testuser', profilePic: '/test.jpg' };
    const group = { name: 'Test Group' };
    const post = { question: 'Q?', content: [], timeLeft: '1h' };
    const pollOptions = ['A', 'B'];
    render(<Post user={user} group={group} post={post} pollOptions={pollOptions} />);
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Q?')).toBeInTheDocument();
  });
});
