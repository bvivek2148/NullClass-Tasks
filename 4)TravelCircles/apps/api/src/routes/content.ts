import express from 'express';
import { body, validationResult } from 'express-validator';
import { logger } from '../utils/logger';

const router = express.Router();

// Mock content data
const mockTips: any[] = [];
const mockPhotos: any[] = [];

// Validation middleware
const validateTip = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('content').trim().isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  body('category').isIn(['route', 'destination', 'safety', 'budget', 'food']).withMessage('Invalid category'),
];

// @route   GET /api/content/tips
// @desc    Get travel tips
// @access  Public
router.get('/tips', (req, res) => {
  const { 
    category, 
    routeId, 
    sort = 'recent', 
    limit = 20, 
    offset = 0,
    search 
  } = req.query;
  
  let filteredTips = [...mockTips];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredTips = filteredTips.filter(tip => tip.category === category);
  }
  
  // Filter by route
  if (routeId) {
    filteredTips = filteredTips.filter(tip => tip.routeId === routeId);
  }
  
  // Search filter
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredTips = filteredTips.filter(tip => 
      tip.title.toLowerCase().includes(searchTerm) ||
      tip.content.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort tips
  if (sort === 'recent') {
    filteredTips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'rating') {
    filteredTips.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'helpful') {
    filteredTips.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
  }
  
  const paginatedTips = filteredTips.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );
  
  res.json({
    success: true,
    data: {
      tips: paginatedTips,
      total: filteredTips.length,
      hasMore: Number(offset) + Number(limit) < filteredTips.length,
      filters: { category, routeId, sort, search },
    },
  });
});

// @route   POST /api/content/tips
// @desc    Create a new tip
// @access  Private
router.post('/tips', validateTip, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { title, content, category, routeId, tags, location } = req.body;

  const newTip = {
    id: Date.now().toString(),
    userId: '1', // This would come from auth middleware
    author: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
      reputation: 150,
    },
    title,
    content,
    category,
    routeId: routeId || null,
    location: location || null,
    tags: tags || [],
    rating: 0,
    ratingCount: 0,
    helpfulVotes: 0,
    notHelpfulVotes: 0,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: false,
    photos: [],
  };

  mockTips.push(newTip);

  logger.info(`New tip created: ${newTip.id}`);

  res.status(201).json({
    success: true,
    message: 'Tip created successfully',
    data: newTip,
  });
});

// @route   GET /api/content/tips/:id
// @desc    Get tip details
// @access  Public
router.get('/tips/:id', (req, res) => {
  const { id } = req.params;
  const tip = mockTips.find(t => t.id === id);
  
  if (!tip) {
    return res.status(404).json({
      success: false,
      message: 'Tip not found',
    });
  }
  
  // Increment view count
  tip.viewCount += 1;
  
  res.json({
    success: true,
    data: tip,
  });
});

// @route   POST /api/content/tips/:id/rate
// @desc    Rate a tip
// @access  Private
router.post('/tips/:id/rate', (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5',
    });
  }
  
  const tipIndex = mockTips.findIndex(t => t.id === id);
  
  if (tipIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tip not found',
    });
  }
  
  // Update rating (simplified calculation)
  const tip = mockTips[tipIndex];
  const newRatingCount = tip.ratingCount + 1;
  const newRating = ((tip.rating * tip.ratingCount) + rating) / newRatingCount;
  
  mockTips[tipIndex] = {
    ...tip,
    rating: Math.round(newRating * 10) / 10,
    ratingCount: newRatingCount,
  };
  
  logger.info(`Tip ${id} rated: ${rating}`);
  
  res.json({
    success: true,
    message: 'Rating submitted successfully',
    data: {
      rating: mockTips[tipIndex].rating,
      ratingCount: mockTips[tipIndex].ratingCount,
    },
  });
});

// @route   POST /api/content/tips/:id/vote
// @desc    Vote on tip helpfulness
// @access  Private
router.post('/tips/:id/vote', (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'helpful' or 'not-helpful'
  
  const tipIndex = mockTips.findIndex(t => t.id === id);
  
  if (tipIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tip not found',
    });
  }
  
  if (type === 'helpful') {
    mockTips[tipIndex].helpfulVotes += 1;
  } else if (type === 'not-helpful') {
    mockTips[tipIndex].notHelpfulVotes += 1;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid vote type',
    });
  }
  
  logger.info(`Tip ${id} voted: ${type}`);
  
  res.json({
    success: true,
    message: 'Vote recorded successfully',
    data: {
      helpfulVotes: mockTips[tipIndex].helpfulVotes,
      notHelpfulVotes: mockTips[tipIndex].notHelpfulVotes,
    },
  });
});

// @route   POST /api/content/photos/upload
// @desc    Upload photos
// @access  Private
router.post('/photos/upload', (req, res) => {
  // This would handle actual file upload with multer
  const { caption, location, routeId, tags } = req.body;
  
  const newPhoto = {
    id: Date.now().toString(),
    userId: '1', // This would come from auth middleware
    author: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
    },
    url: `https://example.com/photos/${Date.now()}.jpg`,
    thumbnailUrl: `https://example.com/photos/thumb_${Date.now()}.jpg`,
    caption: caption || '',
    location: location || null,
    routeId: routeId || null,
    tags: tags || [],
    likes: 0,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    exifData: {
      camera: 'iPhone 14 Pro',
      location: location ? { lat: 40.7128, lng: -74.0060 } : null,
      timestamp: new Date().toISOString(),
    },
  };
  
  mockPhotos.push(newPhoto);
  
  logger.info(`Photo uploaded: ${newPhoto.id}`);
  
  res.status(201).json({
    success: true,
    message: 'Photo uploaded successfully',
    data: newPhoto,
  });
});

// @route   GET /api/content/photos
// @desc    Get photos
// @access  Public
router.get('/photos', (req, res) => {
  const { 
    routeId, 
    location, 
    userId,
    sort = 'recent', 
    limit = 20, 
    offset = 0 
  } = req.query;
  
  let filteredPhotos = [...mockPhotos];
  
  // Filter by route
  if (routeId) {
    filteredPhotos = filteredPhotos.filter(photo => photo.routeId === routeId);
  }
  
  // Filter by location
  if (location) {
    filteredPhotos = filteredPhotos.filter(photo => 
      photo.location && photo.location.toLowerCase().includes((location as string).toLowerCase())
    );
  }
  
  // Filter by user
  if (userId) {
    filteredPhotos = filteredPhotos.filter(photo => photo.userId === userId);
  }
  
  // Sort photos
  if (sort === 'recent') {
    filteredPhotos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'popular') {
    filteredPhotos.sort((a, b) => b.likes - a.likes);
  } else if (sort === 'views') {
    filteredPhotos.sort((a, b) => b.viewCount - a.viewCount);
  }
  
  const paginatedPhotos = filteredPhotos.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );
  
  res.json({
    success: true,
    data: {
      photos: paginatedPhotos,
      total: filteredPhotos.length,
      hasMore: Number(offset) + Number(limit) < filteredPhotos.length,
      filters: { routeId, location, userId, sort },
    },
  });
});

// @route   POST /api/content/photos/:id/like
// @desc    Like a photo
// @access  Private
router.post('/photos/:id/like', (req, res) => {
  const { id } = req.params;
  
  const photoIndex = mockPhotos.findIndex(p => p.id === id);
  
  if (photoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Photo not found',
    });
  }
  
  mockPhotos[photoIndex].likes += 1;
  
  logger.info(`Photo ${id} liked`);
  
  res.json({
    success: true,
    message: 'Photo liked successfully',
    data: {
      likes: mockPhotos[photoIndex].likes,
    },
  });
});

// @route   GET /api/content/categories
// @desc    Get content categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    {
      id: 'route',
      name: 'Route Tips',
      description: 'Tips specific to bus routes',
      icon: '🛣️',
      count: 145,
    },
    {
      id: 'destination',
      name: 'Destination Guides',
      description: 'Information about travel destinations',
      icon: '📍',
      count: 89,
    },
    {
      id: 'safety',
      name: 'Safety Tips',
      description: 'Travel safety and security advice',
      icon: '🛡️',
      count: 67,
    },
    {
      id: 'budget',
      name: 'Budget Tips',
      description: 'Money-saving travel tips',
      icon: '💰',
      count: 123,
    },
    {
      id: 'food',
      name: 'Food & Dining',
      description: 'Restaurant and food recommendations',
      icon: '🍽️',
      count: 78,
    },
  ];
  
  res.json({
    success: true,
    data: categories,
  });
});

export default router;
