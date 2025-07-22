import express from 'express';
import { body, validationResult } from 'express-validator';
import { logger } from '../utils/logger';

const router = express.Router();

// Mock community data
const mockPosts: any[] = [];
const mockComments: any[] = [];

// Validation middleware
const validatePost = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category').isIn(['general', 'route-specific', 'destination', 'safety', 'budget']).withMessage('Invalid category'),
];

const validateComment = [
  body('content').trim().isLength({ min: 1 }).withMessage('Comment content is required'),
];

// @route   GET /api/community/posts
// @desc    Get community posts
// @access  Public
router.get('/posts', (req, res) => {
  const { 
    category, 
    routeId, 
    sort = 'recent', 
    limit = 20, 
    offset = 0,
    search 
  } = req.query;
  
  let filteredPosts = [...mockPosts];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }
  
  // Filter by route
  if (routeId) {
    filteredPosts = filteredPosts.filter(post => post.routeId === routeId);
  }
  
  // Search filter
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort posts
  if (sort === 'recent') {
    filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'popular') {
    filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  } else if (sort === 'comments') {
    filteredPosts.sort((a, b) => b.commentCount - a.commentCount);
  }
  
  const paginatedPosts = filteredPosts.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );
  
  res.json({
    success: true,
    data: {
      posts: paginatedPosts,
      total: filteredPosts.length,
      hasMore: Number(offset) + Number(limit) < filteredPosts.length,
      filters: { category, routeId, sort, search },
    },
  });
});

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', validatePost, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { title, content, category, routeId, tags } = req.body;

  const newPost = {
    id: Date.now().toString(),
    userId: '1', // This would come from auth middleware
    author: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      reputation: 150,
      badges: ['Community Helper'],
    },
    title,
    content,
    category,
    routeId: routeId || null,
    tags: tags || [],
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
    isLocked: false,
    bestAnswerId: null,
  };

  mockPosts.push(newPost);

  logger.info(`New community post created: ${newPost.id}`);

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: newPost,
  });
});

// @route   GET /api/community/posts/:id
// @desc    Get post details with comments
// @access  Public
router.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = mockPosts.find(p => p.id === id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }
  
  // Increment view count
  post.viewCount += 1;
  
  // Get comments for this post
  const postComments = mockComments
    .filter(comment => comment.postId === id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  res.json({
    success: true,
    data: {
      ...post,
      comments: postComments,
    },
  });
});

// @route   POST /api/community/posts/:id/vote
// @desc    Vote on a post
// @access  Private
router.post('/posts/:id/vote', (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'up' or 'down'
  
  const postIndex = mockPosts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }
  
  if (type === 'up') {
    mockPosts[postIndex].upvotes += 1;
  } else if (type === 'down') {
    mockPosts[postIndex].downvotes += 1;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid vote type',
    });
  }
  
  logger.info(`Vote ${type} on post ${id}`);
  
  res.json({
    success: true,
    message: 'Vote recorded successfully',
    data: {
      upvotes: mockPosts[postIndex].upvotes,
      downvotes: mockPosts[postIndex].downvotes,
    },
  });
});

// @route   POST /api/community/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.post('/posts/:id/comments', validateComment, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { id } = req.params;
  const { content, parentId } = req.body;
  
  const post = mockPosts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }
  
  const newComment = {
    id: Date.now().toString(),
    postId: id,
    parentId: parentId || null,
    userId: '1', // This would come from auth middleware
    author: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      reputation: 150,
    },
    content,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    isBestAnswer: false,
  };
  
  mockComments.push(newComment);
  
  // Update post comment count
  const postIndex = mockPosts.findIndex(p => p.id === id);
  mockPosts[postIndex].commentCount += 1;
  
  logger.info(`New comment added to post ${id}`);
  
  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: newComment,
  });
});

// @route   GET /api/community/categories
// @desc    Get forum categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General travel discussions and questions',
      postCount: 245,
      icon: '💬',
    },
    {
      id: 'route-specific',
      name: 'Route Discussions',
      description: 'Discussions about specific bus routes',
      postCount: 189,
      icon: '🛣️',
    },
    {
      id: 'destination',
      name: 'Destination Guides',
      description: 'Tips and guides for travel destinations',
      postCount: 156,
      icon: '📍',
    },
    {
      id: 'safety',
      name: 'Safety & Security',
      description: 'Travel safety tips and security advice',
      postCount: 78,
      icon: '🛡️',
    },
    {
      id: 'budget',
      name: 'Budget Travel',
      description: 'Money-saving tips and budget travel advice',
      postCount: 134,
      icon: '💰',
    },
  ];
  
  res.json({
    success: true,
    data: categories,
  });
});

// @route   GET /api/community/trending
// @desc    Get trending topics and tags
// @access  Public
router.get('/trending', (req, res) => {
  const trendingTopics = [
    { tag: 'nyc-boston', count: 45, growth: '+12%' },
    { tag: 'budget-tips', count: 38, growth: '+8%' },
    { tag: 'safety', count: 32, growth: '+15%' },
    { tag: 'food-stops', count: 28, growth: '+5%' },
    { tag: 'wifi-issues', count: 24, growth: '+20%' },
  ];
  
  const popularRoutes = [
    { routeId: '1', name: 'NYC → Boston', posts: 67 },
    { routeId: '2', name: 'Boston → Washington DC', posts: 45 },
    { routeId: '3', name: 'Chicago → Detroit', posts: 38 },
  ];
  
  res.json({
    success: true,
    data: {
      trendingTopics,
      popularRoutes,
      totalPosts: mockPosts.length,
      totalComments: mockComments.length,
      activeUsers: 1247, // Mock data
    },
  });
});

// @route   GET /api/community/leaderboard
// @desc    Get community leaderboard
// @access  Public
router.get('/leaderboard', (req, res) => {
  const { period = 'month', limit = 10 } = req.query;
  
  const leaderboard = [
    {
      rank: 1,
      userId: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: null,
      reputation: 2450,
      postsCount: 89,
      helpfulVotes: 234,
      badges: ['Top Contributor', 'Community Helper', 'Route Expert'],
    },
    {
      rank: 2,
      userId: '2',
      firstName: 'Mike',
      lastName: 'Rodriguez',
      avatar: null,
      reputation: 1890,
      postsCount: 67,
      helpfulVotes: 189,
      badges: ['Community Helper', 'Safety First'],
    },
    {
      rank: 3,
      userId: '3',
      firstName: 'Anna',
      lastName: 'Lee',
      avatar: null,
      reputation: 1650,
      postsCount: 54,
      helpfulVotes: 156,
      badges: ['Budget Expert', 'Frequent Traveler'],
    },
  ];
  
  res.json({
    success: true,
    data: {
      leaderboard: leaderboard.slice(0, Number(limit)),
      period,
      lastUpdated: new Date().toISOString(),
    },
  });
});

export default router;
