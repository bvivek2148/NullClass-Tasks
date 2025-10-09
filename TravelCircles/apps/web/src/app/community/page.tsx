'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  MapPinIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  likes: number;
  views: number;
  replies: number;
  createdAt: string;
  route?: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Best time to travel from Mumbai to Pune?',
    content: 'Planning a trip next month and wondering about the best departure times to avoid traffic...',
    author: 'TravelExplorer',
    category: 'Route Tips',
    likes: 15,
    views: 234,
    replies: 8,
    createdAt: '2024-01-15',
    route: 'Mumbai → Pune'
  },
  {
    id: '2',
    title: 'Amazing scenic route through the mountains!',
    content: 'Just took the Ahmedabad to Udaipur route and the views were absolutely breathtaking. Here are some photos...',
    author: 'MountainLover',
    category: 'Travel Stories',
    likes: 42,
    views: 567,
    replies: 12,
    createdAt: '2024-01-14',
    route: 'Ahmedabad → Udaipur'
  },
  {
    id: '3',
    title: 'Safety tips for night travel',
    content: 'Sharing some important safety considerations when traveling on overnight bus routes...',
    author: 'SafetyFirst',
    category: 'Safety',
    likes: 28,
    views: 445,
    replies: 6,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Budget travel hacks for students',
    content: 'As a college student, I\'ve discovered some great ways to save money on bus travel...',
    author: 'StudentTraveler',
    category: 'Budget Tips',
    likes: 35,
    views: 678,
    replies: 15,
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    title: 'Best food stops on Delhi-Jaipur route',
    content: 'Sharing my favorite dhaba and restaurant recommendations along this popular route...',
    author: 'FoodieExplorer',
    category: 'Route Tips',
    likes: 28,
    views: 345,
    replies: 9,
    createdAt: '2024-01-11',
    route: 'Delhi → Jaipur'
  },
  {
    id: '6',
    title: 'Monsoon travel experiences',
    content: 'Just completed a journey during heavy rains. Here are some lessons learned...',
    author: 'RainTraveler',
    category: 'Travel Stories',
    likes: 19,
    views: 267,
    replies: 7,
    createdAt: '2024-01-10'
  },
  {
    id: '7',
    title: 'AC vs Non-AC buses - Which is better?',
    content: 'Comparing comfort, cost, and overall experience between AC and non-AC buses...',
    author: 'ComfortSeeker',
    category: 'General Discussion',
    likes: 42,
    views: 523,
    replies: 18,
    createdAt: '2024-01-09'
  },
  {
    id: '8',
    title: 'Lost luggage recovery tips',
    content: 'Unfortunately lost my bag during travel. Here\'s how I got it back and tips to prevent it...',
    author: 'CautiousTraveler',
    category: 'Safety',
    likes: 31,
    views: 412,
    replies: 11,
    createdAt: '2024-01-08'
  }
];

const categories = [
  'All Posts',
  'Route Tips',
  'Travel Stories',
  'Safety',
  'Budget Tips',
  'General Discussion'
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(4);
  const [loading, setLoading] = useState(false);

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedPosts = filteredPosts.slice(0, visiblePosts);
  const hasMorePosts = visiblePosts < filteredPosts.length;

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePosts(prev => prev + 4);
      setLoading(false);
    }, 500);
  };

  const handleStartDiscussion = () => {
    alert('Start Discussion Feature!\n\nThis would open a form to create a new discussion post. Features would include:\n\n• Choose discussion category\n• Add title and description\n• Select relevant route (optional)\n• Add tags\n• Post to community\n\nIn a real application, this would redirect to a discussion creation form.');
  };

  const handleJoinDiscussion = (postTitle: string) => {
    alert(`Join Discussion: "${postTitle}"\n\nThis would open the full discussion thread where you can:\n\n• Read all replies\n• Add your own comments\n• Like/upvote responses\n• Follow the discussion\n• Share with others\n\nIn a real application, this would redirect to the full discussion page.`);
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
              <Link href="/community" className="text-primary-600 font-medium">Community</Link>
              <Link href="/tips" className="text-gray-700 hover:text-primary-600">Tips</Link>
              <Link href="/login" className="text-gray-700 hover:text-primary-600">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Travel Community</h1>
          <p className="text-lg text-gray-600">
            Connect with fellow travelers, share experiences, and get tips for your next journey.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2,847</p>
                <p className="text-sm text-gray-600">Community Members</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-gray-600">Discussions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <MapPinIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">456</p>
                <p className="text-sm text-gray-600">Routes Discussed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">8,921</p>
                <p className="text-sm text-gray-600">Helpful Votes</p>
              </div>
            </div>
          </div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">New York → Boston</p>
                  <p className="text-gray-600">234 discussions</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Los Angeles → San Francisco</p>
                  <p className="text-gray-600">189 discussions</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Chicago → Detroit</p>
                  <p className="text-gray-600">156 discussions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleStartDiscussion}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Discussion
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {displayedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {post.category}
                        </span>
                        {post.route && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.route}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>by {post.author}</span>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {post.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {post.likes} likes
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {post.views} views
                      </div>
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                        {post.replies} replies
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinDiscussion(post.title)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Join Discussion
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMorePosts && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Discussions'}
                </button>
              </div>
            )}

            {!hasMorePosts && filteredPosts.length > 4 && (
              <div className="text-center mt-8 text-gray-500">
                <p>You've seen all discussions in this category!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
