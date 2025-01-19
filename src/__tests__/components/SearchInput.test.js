import React from 'react';
import { render, screen } from '../test-utils';
import SearchInput from '../../components/SearchInput';

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput onSearch={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
}); 