const { setupServer } = require('msw/node');
const { rest } = require('msw');

const handlers = [
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

const server = setupServer(...handlers);

module.exports = { server, handlers }; 