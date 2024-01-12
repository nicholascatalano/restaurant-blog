const router = require('express').Router();
const { Review } = require('../../models/');

// POST route for creating a new post
router.post('/', async (req, res) => {
  try {
    const newReview = await Review.create({
      ...req.body,
      user_id: req.session.userId,
    });
    console.log(newReview);
    res.json(newReview);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;