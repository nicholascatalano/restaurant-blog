const router = require('express').Router();
const { User, Review, Restaurant } = require('../../models');

// endpoint -> api/restaurants

//GET - all restaurants
router.get('/', async (req, res) => {
  try {
    const allRestaurants = await Restaurant.findAll({
      include: [{ model: Review, as: 'reviews' }],
    });
    const restaurants = allRestaurants.map((restaurant) =>
      restaurant.get({ plain: true })
    );
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json(err);
  }
});

//POST request to create a new restaurant from the review form
router.post('/', async (req, res) => {
  try {
    const newRestaurant = await Restaurant.create({
      ...req.body,
    });
    res.status(200).json(newRestaurant);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET route for one restaurant
router.get('/:name/:city', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: {
        name: req.params.name,
        city: req.params.city,
      },
    });
    //if the restaurant exists it will return a 200 response
    if (restaurant) {
      res.status(200).json(restaurant.get({ plain: true }));
    } else {
      //if it doesn't exist it will return a 404 response
      res.status(404).json("Restaurant doesn't exists on the database");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET a restaurant id from TripAdvisor content API
router.get('/:searchQuery', async (req, res) => {
  try {
    const apiKey = process.env.DB_API_KEY;
    //this will look for the restaurant location using Tripadvisor content API
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const responseFromAPI = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${req.params.searchQuery}&category=restaurants&language=en&key=${apiKey}`,
      options
    );
    const response = await responseFromAPI.json();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
