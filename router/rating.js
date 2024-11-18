// router/ratingRoutes.js
const express = require('express');
const router = express.Router();
const Post = require('../models/blog'); // Adjust if your Post model is in a different file

// Rate a blog post
router.post('/rate-post', async (req, res) => {
  const { postId, rating } = req.body;

  try {
    // Find the blog post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Save the rating in the ratings array
    post.ratings.push(rating);

    // Calculate the average rating
    const averageRating = post.ratings.reduce((sum, rate) => sum + rate, 0) / post.ratings.length;

    // Save the updated post with the new rating
    await post.save();

    // Respond with a success message and the new average rating
    res.json({
      message: 'Rating submitted successfully',
      averageRating: averageRating.toFixed(2), // Rounded to two decimal places
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while processing the rating', error });
  }
});

module.exports = router;
