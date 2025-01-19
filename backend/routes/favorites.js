const router = require('express').Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');

router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id });
    res.json(favorites);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newFavorite = new Favorite({
      user: req.user.id,
      drinkId: req.body.drinkId,
      drinkData: req.body.drinkData
    });
    await newFavorite.save();
    res.json(newFavorite);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 