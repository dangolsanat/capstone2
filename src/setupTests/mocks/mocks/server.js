import { setupServer } from 'msw';
import { rest } from 'msw';

export const handlers = [
  rest.get('https://www.thecocktaildb.com/api/json/v1/1/search.php', (req, res, ctx) => {
    return res(
      ctx.json({
        drinks: [
          {
            idDrink: '1',
            strDrink: 'Mojito',
            strDrinkThumb: 'mojito.jpg',
            strInstructions: 'Mix ingredients...',
            strIngredient1: 'Rum',
            strMeasure1: '2 oz',
          }
        ]
      })
    );
  }),
];

export const server = setupServer(...handlers); 