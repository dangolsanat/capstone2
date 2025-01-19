import React from 'react';
import { render, screen } from '../test-utils';
import Home from '../../pages/Home';

describe('Home', () => {
  it('renders search input', () => {
    render(<Home />);
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });
}); 