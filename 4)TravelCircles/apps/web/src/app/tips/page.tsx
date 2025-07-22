'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LightBulbIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  likes: number;
  saves: number;
  readTime: string;
  createdAt: string;
  image?: string;
}

const mockTips: Tip[] = [
  {
    id: '1',
    title: 'How to Save 50% on Bus Tickets',
    content: 'Book your tickets in advance, travel during off-peak hours, and use student discounts. Here are the top 10 strategies that have saved me hundreds of rupees...',
    category: 'Budget',
    author: 'BudgetTraveler',
    likes: 89,
    saves: 156,
    readTime: '5 min read',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Essential Safety Tips for Solo Travelers',
    content: 'Traveling alone can be incredibly rewarding, but safety should always be your top priority. Here are proven strategies to stay safe...',
    category: 'Safety',
    author: 'SafeJourney',
    likes: 67,
    saves: 234,
    readTime: '7 min read',
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Best Routes for Scenic Views',
    content: 'Discover the most breathtaking bus routes across the country. From mountain passes to coastal highways, these routes offer unforgettable views...',
    category: 'Routes',
    author: 'ScenicExplorer',
    likes: 124,
    saves: 89,
    readTime: '8 min read',
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Packing Smart for Long Bus Journeys',
    content: 'What to bring, what to leave behind, and how to stay comfortable during extended travel. A comprehensive packing guide...',
    category: 'Travel',
    author: 'PackingPro',
    likes: 45,
    saves: 78,
    readTime: '6 min read',
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    title: 'Finding the Best Food Stops Along Your Route',
    content: 'Don\'t settle for gas station snacks! Discover amazing local eateries and hidden gems along popular bus routes...',
    category: 'Food',
    author: 'FoodieNomad',
    likes: 92,
    saves: 167,
    readTime: '4 min read',
    createdAt: '2024-01-11'
  },
  {
    id: '6',
    title: 'Staying Comfortable on Overnight Buses',
    content: 'Sleep better, arrive refreshed. Essential tips for making overnight bus travel as comfortable as possible...',
    category: 'Comfort',
    author: 'ComfortTraveler',
    likes: 78,
    saves: 145,
    readTime: '5 min read',
    createdAt: '2024-01-10'
  },
  {
    id: '7',
    title: 'Best Apps for Bus Travel in India',
    content: 'Essential mobile apps every bus traveler should have for booking, tracking, and navigation...',
    category: 'Travel',
    author: 'TechTraveler',
    likes: 95,
    saves: 201,
    readTime: '4 min read',
    createdAt: '2024-01-09'
  },
  {
    id: '8',
    title: 'Monsoon Travel Safety Tips',
    content: 'How to stay safe and comfortable while traveling during India\'s monsoon season...',
    category: 'Safety',
    author: 'WeatherWise',
    likes: 112,
    saves: 178,
    readTime: '6 min read',
    createdAt: '2024-01-08'
  },
  {
    id: '9',
    title: 'Cultural Etiquette for Bus Travel',
    content: 'Understanding local customs and being a respectful traveler across different Indian states...',
    category: 'Travel',
    author: 'CulturalGuide',
    likes: 87,
    saves: 134,
    readTime: '5 min read',
    createdAt: '2024-01-07'
  }
];

const categories = [
  'All Tips',
  'Budget',
  'Safety',
  'Routes',
  'Travel',
  'Food',
  'Comfort'
];

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Tips');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleTips, setVisibleTips] = useState(6);
  const [loading, setLoading] = useState(false);

  const filteredTips = mockTips.filter(tip => {
    const matchesCategory = selectedCategory === 'All Tips' || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedTips = filteredTips.slice(0, visibleTips);
  const hasMoreTips = visibleTips < filteredTips.length;

  const loadMoreTips = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleTips(prev => prev + 6);
      setLoading(false);
    }, 500);
  };

  const handleShareTip = () => {
    alert('Share Your Travel Tip!\n\nThis would open a form where you can:\n\n• Choose tip category (Budget, Safety, Travel, etc.)\n• Add a compelling title\n• Write detailed tip content\n• Add helpful tags\n• Include photos (optional)\n• Publish to help other travelers\n\nIn a real application, this would redirect to a tip creation form.');
  };

  const handleReadMore = (tipTitle: string) => {
    alert(`Read Full Tip: "${tipTitle}"\n\nThis would show the complete tip with:\n\n• Full detailed content\n• Step-by-step instructions\n• Photos and examples\n• Comments from other travelers\n• Related tips\n• Save/bookmark option\n\nIn a real application, this would redirect to the full tip page.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">TravelCircles</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/routes" className="text-gray-700 hover:text-primary-600">Routes</Link>
              <Link href="/community" className="text-gray-700 hover:text-primary-600">Community</Link>
              <Link href="/tips" className="text-primary-600 font-medium">Tips</Link>
              <Link href="/login" className="text-gray-700 hover:text-primary-600">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Tips & Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice, insider secrets, and practical tips to make your bus travel experience amazing.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.slice(1).map((category) => {
            const icons = {
              Budget: CurrencyDollarIcon,
              Safety: ShieldCheckIcon,
              Routes: MapPinIcon,
              Travel: LightBulbIcon,
              Food: HeartIcon,
              Comfort: BookmarkIcon
            };
            const Icon = icons[category as keyof typeof icons] || LightBulbIcon;
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm font-medium">{category}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular This Week</h3>
              <div className="space-y-4">
                <div className="text-sm">
                  <h4 className="font-medium text-gray-900 mb-1">Budget Travel Hacks</h4>
                  <p className="text-gray-600">156 saves this week</p>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium text-gray-900 mb-1">Safety for Solo Travelers</h4>
                  <p className="text-gray-600">234 saves this week</p>
                </div>
                <div className="text-sm">
                  <h4 className="font-medium text-gray-900 mb-1">Scenic Route Guide</h4>
                  <p className="text-gray-600">89 saves this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search travel tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleShareTip}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Share Your Tip
                </button>
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedTips.map((tip) => (
                <div key={tip.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {tip.category}
                      </span>
                      <span className="text-sm text-gray-500">{tip.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-primary-600 cursor-pointer">
                      {tip.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {tip.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>by {tip.author}</span>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {tip.createdAt}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          {tip.likes}
                        </div>
                        <div className="flex items-center">
                          <BookmarkIcon className="h-4 w-4 mr-1" />
                          {tip.saves}
                        </div>
                      </div>
                      <button
                        onClick={() => handleReadMore(tip.title)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMoreTips && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreTips}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Tips'}
                </button>
              </div>
            )}

            {!hasMoreTips && filteredTips.length > 6 && (
              <div className="text-center mt-8 text-gray-500">
                <p>You've seen all tips in this category!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
