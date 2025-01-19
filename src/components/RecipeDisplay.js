import React, { useEffect } from 'react';
import styled from 'styled-components';

const RecipeContainer = styled.div`
  position: fixed;
  top: 15%;
  right: 20%;
  width: 35%;
  height: 60vh;
  background: ${props => props.theme.transparent};
  padding: 2rem;
  overflow-y: auto;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.primary};
  scrollbar-width: 1px; 
  scrollbar-color: ${props => props.theme.primary} ${props => props.theme.transparent};
`;

const RecipeTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  font-size: 2rem;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.primary};
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${props => props.theme.text};
`;

const ListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Instructions = styled.p`
  color: ${props => props.theme.text};
  line-height: 1.6;
  margin: 0;
`;

const RecipeDisplay = ({ cocktail, onDisplay }) => {
  useEffect(() => {
    if (onDisplay) {
      onDisplay(!!cocktail);
    }
  }, [cocktail, onDisplay]);

  if (!cocktail) return null;

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  return (
    <RecipeContainer>
      <RecipeTitle>{cocktail.strDrink}</RecipeTitle>
      
      <Section>
        <SectionTitle>Ingredients</SectionTitle>
        <List>
          {getIngredients().map((ingredient, index) => (
            <ListItem key={index}>{ingredient}</ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Instructions</SectionTitle>
        <Instructions>{cocktail.strInstructions}</Instructions>
      </Section>

      <Section>
        <SectionTitle>Glass</SectionTitle>
        <Instructions>{cocktail.strGlass}</Instructions>
      </Section>
    </RecipeContainer>
  );
};

export default RecipeDisplay; 