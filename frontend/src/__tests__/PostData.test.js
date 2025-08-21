import { render, screen } from '@testing-library/react';
import PostData from '../components/PostData.jsx';

describe('PostData', () => {
  it('renders question and images', () => {
    const post = {
      question: 'What is your favorite?',
      content: ['/img1.jpg', '/img2.jpg']
    };
    render(<PostData post={post} />);
    expect(screen.getByText('What is your favorite?')).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBe(2);
  });
});
