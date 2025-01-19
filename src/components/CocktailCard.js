import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Card = styled.div`
  position: relative;
  background: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s;
  color: ${props => props.theme.text};
  width: 200px;
  height: 300px;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }

  h3 {
    margin: 0.5rem 0;
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &:hover {
    transform: translateY(-5px);
  }

  ${props => props.isMagnified && `
    width: 100%;
    height: auto;
    max-width: 400px;
    margin: 0 auto;
    transform: none;
    
    img {
      height: 300px;
    }

    h3 {
      font-size: 1.5rem;
      -webkit-line-clamp: none;
      text-align: center;
    }

    &:hover {
      transform: none;
    }
  `}
`;

const HeartButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const CocktailCard = ({ cocktail, isMagnified, onSelect, favorites, toggleFavorite }) => {
  const { user } = useAuth();

  const handleClick = async () => {
    try {
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`
      );
      if (response.data && response.data.drinks && response.data.drinks[0]) {
        onSelect(response.data.drinks[0]);
      } else {
        onSelect(cocktail); // Fallback to using the existing cocktail data
      }
    } catch (error) {
      console.error('Error fetching cocktail details:', error);
      onSelect(cocktail); // Fallback to using the existing cocktail data
    }
  };

  return (
    <Card 
      isMagnified={isMagnified}
      onClick={handleClick}
    >
      <img 
        src={cocktail.strDrinkThumb}
        alt={cocktail.strDrink}
      />
      {user && (
        <HeartButton onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(cocktail);
        }}>
          {favorites.includes(cocktail.idDrink) ? '❤️' : '🤍'}
        </HeartButton>
      )}
      <h3>{cocktail.strDrink}</h3>
    </Card>
  );
};

export default CocktailCard; 