import { render, screen, fireEvent } from '@testing-library/react';
import Grouptab from '../components/GroupTab.jsx';

describe('Grouptab', () => {
  it('renders group name and members', () => {
    render(<Grouptab />);
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('6 members')).toBeInTheDocument();
    fireEvent.click(screen.getByText('View Members'));
    expect(screen.getAllByText('@katesmith0001').length).toBeGreaterThan(0);
  });
});
