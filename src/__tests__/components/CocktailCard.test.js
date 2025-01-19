import React from 'react';
import { render, screen } from '../test-utils';
import CocktailCard from '../../components/CocktailCard';

describe('CocktailCard', () => {
  it('renders cocktail name', () => {
    render(<CocktailCard cocktail={{ strDrink: 'Margarita' }} />);
    expect(screen.getByText('Margarita')).toBeInTheDocument();
  });
}); 