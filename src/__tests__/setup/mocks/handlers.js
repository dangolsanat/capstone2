import { rest } from 'msw';

export const handlers = [
  // Add API handlers here as needed
  rest.get('https://www.thecocktaildb.com/api/json/v1/1/search.php', (req, res, ctx) => {
    return res(
      ctx.json({
        drinks: []
      })
    );
  }),
]; 