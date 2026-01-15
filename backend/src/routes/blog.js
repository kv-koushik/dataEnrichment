import express from 'express';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs from all users
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('uid', 'username')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/my
// @desc    Get logged-in user's blogs
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ uid: req.user._id })
      .populate('uid', 'username')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('uid', 'username');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { tittle, travelexp, imgs } = req.body;

    // Validation
    if (!tittle || !travelexp) {
      return res.status(400).json({ message: 'Please provide title and travel experience' });
    }

    const blog = await Blog.create({
      uid: req.user._id,
      tittle,
      travelexp,
      imgs: imgs || []
    });

    const populatedBlog = await Blog.findById(blog._id).populate('uid', 'username');

    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete user's own blog
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns the blog
    if (blog.uid.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
