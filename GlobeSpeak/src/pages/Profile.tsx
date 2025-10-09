import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Calendar, MapPin, Edit, Globe, MessageCircle, Users, Award, TrendingUp, Clock, Star, Target, BookOpen, Volume2 } from 'lucide-react';

interface ProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    joinDate?: string;
    location?: string;
    bio?: string;
  } | null;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { t } = useTranslation();

  // Mock data - in a real app, this would come from an API
  const profileStats = {
    languages: 5,
    conversations: 124,
    friends: 38,
    badges: 7,
    streak: 12,
    accuracy: 94
  };

  const languageStats = [
    { language: 'Spanish', level: 'Advanced', progress: 85, flag: '🇪🇸' },
    { language: 'French', level: 'Intermediate', progress: 60, flag: '🇫🇷' },
    { language: 'German', level: 'Beginner', progress: 30, flag: '🇩🇪' },
    { language: 'Italian', level: 'Beginner', progress: 15, flag: '🇮🇹' }
  ];

  const achievements = [
    { id: 1, name: 'First Conversation', description: 'Complete your first conversation', icon: <MessageCircle size={20} />, earned: true },
    { id: 2, name: 'Polyglot', description: 'Use 5+ languages', icon: <Globe size={20} />, earned: true },
    { id: 3, name: 'Streak Master', description: 'Maintain a 7-day streak', icon: <TrendingUp size={20} />, earned: true },
    { id: 4, name: 'Social Butterfly', description: 'Connect with 10 friends', icon: <Users size={20} />, earned: true },
    { id: 5, name: 'Perfectionist', description: 'Achieve 95%+ accuracy', icon: <Target size={20} />, earned: false },
    { id: 6, name: 'Dedicated Learner', description: 'Complete 100 conversations', icon: <BookOpen size={20} />, earned: false }
  ];

  const recentActivity = [
    { id: 1, action: 'Completed Spanish conversation', time: '2 hours ago', type: 'conversation' },
    { id: 2, action: 'Earned Streak Master badge', time: '1 day ago', type: 'achievement' },
    { id: 3, action: 'Connected with new friend', time: '2 days ago', type: 'friend' },
    { id: 4, action: 'Practiced pronunciation', time: '3 days ago', type: 'practice' }
  ];

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="empty-state">
            <User size={48} />
            <p>User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('pages.headings.userProfile')}</h1>
          <p className="page-subtitle">{t('pages.descriptions.profile')}</p>
        </div>
      </div>

      <div className="container">
        <div className="profile-content">
          {/* Profile Stats */}
          <div className="profile-stats-grid grid grid-6">
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <Globe size={20} />
                  <span className="stat-label">Languages</span>
                </div>
                <div className="stat-value">{profileStats.languages}</div>
              </div>
            </div>
            
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <MessageCircle size={20} />
                  <span className="stat-label">Conversations</span>
                </div>
                <div className="stat-value">{profileStats.conversations}</div>
              </div>
            </div>
            
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <Users size={20} />
                  <span className="stat-label">Friends</span>
                </div>
                <div className="stat-value">{profileStats.friends}</div>
              </div>
            </div>
            
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <Award size={20} />
                  <span className="stat-label">Badges</span>
                </div>
                <div className="stat-value">{profileStats.badges}</div>
              </div>
            </div>
            
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <TrendingUp size={20} />
                  <span className="stat-label">Streak</span>
                </div>
                <div className="stat-value">{profileStats.streak} days</div>
              </div>
            </div>
            
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <Target size={20} />
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-value">{profileStats.accuracy}%</div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-card card">
            <div className="card-content">
              <div className="profile-header">
                <div className="profile-avatar">
                  <div className="avatar-placeholder">
                    <User size={48} />
                  </div>
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-email">{user.email}</p>
                  {user.bio && <p className="profile-bio">{user.bio}</p>}
                </div>
                <button className="btn btn-outline">
                  <Edit size={16} />
                  {t('ui.buttons.edit')}
                </button>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <Mail size={20} />
                  <div>
                    <label>Email</label>
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={20} />
                  <div>
                    <label>Member since</label>
                    <span>{user.joinDate || 'January 2024'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={20} />
                  <div>
                    <label>Location</label>
                    <span>{user.location || 'Mumbai, India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Progress */}
          <div className="languages-section">
            <div className="section-header">
              <h2 className="section-title">Language Progress</h2>
              <p className="section-description">Your progress in different languages</p>
            </div>
            <div className="languages-grid grid grid-2">
              {languageStats.map((lang, index) => (
                <div key={index} className="language-card card">
                  <div className="card-content">
                    <div className="language-header">
                      <span className="language-flag">{lang.flag}</span>
                      <div className="language-info">
                        <h3 className="language-name">{lang.language}</h3>
                        <span className="language-level">{lang.level}</span>
                      </div>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${lang.progress}%` }}
                        />
                      </div>
                      <span className="progress-percentage">{lang.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <div className="section-header">
              <h2 className="section-title">Achievements</h2>
              <p className="section-description">Badges you've earned and goals to reach</p>
            </div>
            <div className="achievements-grid grid grid-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`achievement-card card ${achievement.earned ? 'earned' : 'locked'}`}
                >
                  <div className="card-content">
                    <div className="achievement-icon">
                      {achievement.icon}
                    </div>
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                    {achievement.earned ? (
                      <span className="achievement-status earned">Earned</span>
                    ) : (
                      <span className="achievement-status locked">Locked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <p className="section-description">Your latest actions on GlobeSpeak</p>
            </div>
            <div className="activity-card card">
              <div className="card-content">
                <div className="activity-list">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'conversation' && <MessageCircle size={16} />}
                        {activity.type === 'achievement' && <Award size={16} />}
                        {activity.type === 'friend' && <Users size={16} />}
                        {activity.type === 'practice' && <Volume2 size={16} />}
                      </div>
                      <div className="activity-content">
                        <p className="activity-action">{activity.action}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;