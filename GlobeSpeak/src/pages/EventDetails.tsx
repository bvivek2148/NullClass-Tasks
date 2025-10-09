import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Globe, 
  MessageCircle, 
  User, 
  ChevronLeft,
  CheckCircle,
  Star,
  Award,
  Volume2,
  Play,
  Pause,
  Languages,
  Mic,
  RotateCcw
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../i18n';

// Mock event data - in a real app, this would come from an API
const mockEvents = [
  {
    id: 1,
    title: 'French Conversation Group',
    description: 'Join our weekly French conversation group to practice your speaking skills in a friendly environment. All levels welcome!',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    duration: 90, // minutes
    participants: 12,
    maxParticipants: 20,
    language: 'fr',
    type: 'group',
    level: 'All Levels',
    location: 'Online (Zoom)',
    host: {
      name: 'Marie Dubois',
      avatar: '/avatars/marie.jpg',
      role: 'Native Speaker',
      rating: 4.9
    },
    agenda: [
      'Welcome and introductions (10 min)',
      'Icebreaker activity (15 min)',
      'Group conversation topics (40 min)',
      'Pronunciation practice (15 min)',
      'Wrap-up and next week preview (10 min)'
    ],
    participantsList: [
      { name: 'John Smith', avatar: '/avatars/john.jpg', level: 'Intermediate' },
      { name: 'Anna Müller', avatar: '/avatars/anna.jpg', level: 'Advanced' },
      { name: 'Carlos Rodriguez', avatar: '/avatars/carlos.jpg', level: 'Beginner' },
      { name: 'Yuki Tanaka', avatar: '/avatars/yuki.jpg', level: 'Intermediate' },
      { name: 'Emma Wilson', avatar: '/avatars/emma.jpg', level: 'Beginner' }
    ]
  },
  {
    id: 2,
    title: 'Spanish Language Exchange',
    description: 'Connect with native Spanish speakers and practice your language skills in our bi-weekly exchange sessions.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    duration: 120, // minutes
    participants: 8,
    maxParticipants: 15,
    language: 'es',
    type: 'exchange',
    level: 'Intermediate+',
    location: 'Café Literario, 123 Main St',
    host: {
      name: 'Carlos Mendez',
      avatar: '/avatars/carlos-m.jpg',
      role: 'Language Teacher',
      rating: 4.8
    },
    agenda: [
      'Check-in and coffee (15 min)',
      'Speed language exchange (30 min)',
      'Group discussion on culture (30 min)',
      'Grammar tips and Q&A (25 min)',
      'Closing remarks (20 min)'
    ],
    participantsList: [
      { name: 'Sophie Martin', avatar: '/avatars/sophie.jpg', level: 'Advanced' },
      { name: 'Kenji Sato', avatar: '/avatars/kenji.jpg', level: 'Intermediate' },
      { name: 'Maria Silva', avatar: '/avatars/maria.jpg', level: 'Native' },
      { name: 'Thomas Wright', avatar: '/avatars/thomas.jpg', level: 'Beginner' }
    ]
  },
  {
    id: 3,
    title: 'German Pronunciation Workshop',
    description: 'Master the tricky sounds of German with our focused pronunciation workshop. Perfect for intermediate to advanced learners.',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    duration: 75, // minutes
    participants: 15,
    maxParticipants: 18,
    language: 'de',
    type: 'workshop',
    level: 'Intermediate+',
    location: 'Online (Zoom)',
    host: {
      name: 'Hans Mueller',
      avatar: '/avatars/hans.jpg',
      role: 'Pronunciation Specialist',
      rating: 4.95
    },
    agenda: [
      'Welcome and sound overview (10 min)',
      'Vowel pronunciation practice (20 min)',
      'Consonant clusters and tricky sounds (25 min)',
      'Sentence rhythm and intonation (15 min)',
      'Q&A and practice (5 min)'
    ],
    participantsList: [
      { name: 'Liam O\'Connor', avatar: '/avatars/liam.jpg', level: 'Intermediate' },
      { name: 'Isabella Rossi', avatar: '/avatars/isabella.jpg', level: 'Advanced' },
      { name: 'Dmitri Petrov', avatar: '/avatars/dmitri.jpg', level: 'Intermediate' },
      { name: 'Fatima Al-Rashid', avatar: '/avatars/fatima.jpg', level: 'Advanced' },
      { name: 'James Wilson', avatar: '/avatars/james.jpg', level: 'Intermediate' }
    ]
  }
];

export const EventDetails: React.FC = () => {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  // Add new state for translation feature (removed duplicates)
  const [inputText, setInputText] = useState('Bonjour, comment allez-vous aujourd\'hui?');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('Hello, how are you today?');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Find the event by ID
    const foundEvent = mockEvents.find(e => e.id.toString() === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      // If event not found, redirect to dashboard
      navigate('/dashboard');
    }
  }, [eventId, navigate]);

  const handleJoinEvent = () => {
    if (event && !isRegistered) {
      setIsRegistered(true);
      // In a real app, this would call an API to register the user for the event
      // Show a more professional notification instead of alert
      console.log(`Successfully registered for ${event.title}!`);
    }
  };

  const toggleAudioPlayback = () => {
    setIsPlaying(!isPlaying);
    // Simulate audio progress
    if (!isPlaying) {
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100; // Keep at 100% when finished
          }
          return prev + 1;
        });
      }, 100);
    } else {
      setAudioProgress(0);
    }
  };

  // Add function to handle text translation
  const handleTranslate = () => {
    setIsTranslating(true);
    // Simulate translation API call
    setTimeout(() => {
      // In a real app, this would call a translation API
      const translations: Record<string, Record<string, string>> = {
        'Bonjour, comment allez-vous aujourd\'hui?': {
          en: 'Hello, how are you today?',
          es: 'Hola, ¿cómo estás hoy?',
          de: 'Hallo, wie geht es dir heute?'
        },
        'Hola, ¿cómo estás hoy?': {
          en: 'Hello, how are you today?',
          fr: 'Bonjour, comment allez-vous aujourd\'hui?',
          de: 'Hallo, wie geht es dir heute?'
        },
        'Hallo, wie geht es dir heute?': {
          en: 'Hello, how are you today?',
          fr: 'Bonjour, comment allez-vous aujourd\'hui?',
          es: 'Hola, ¿cómo estás hoy?'
        }
      };

      const translated = translations[inputText]?.[targetLanguage] || inputText;
      setTranslatedText(translated);
      setIsTranslating(false);
    }, 800);
  };

  // Add function to play translated text
  const playTranslatedText = () => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // Set utterance properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set language based on target language
      const languageMap: Record<string, string> = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE'
      };
      utterance.lang = languageMap[targetLanguage] || 'en-US';
      
      // Handle playback events
      utterance.onstart = () => {
        setIsPlaying(true);
        setAudioProgress(0);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setAudioProgress(100);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };
      
      // Speak the utterance
      window.speechSynthesis.speak(utterance);
      
      // Update progress manually since speechSynthesis doesn't provide real-time progress
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100 || !isPlaying) {
            clearInterval(interval);
            return 100;
          }
          // Increment by 2% every 100ms, reaching 100% in 5 seconds
          return Math.min(prev + 2, 100);
        });
      }, 100);
    } else {
      // Fallback for browsers that don't support speech synthesis
      console.warn('Speech synthesis not supported');
      // Still simulate playback for UI consistency
      setIsPlaying(true);
      setAudioProgress(0);
      
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  // Add function to reset audio
  const resetAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setAudioProgress(0);
  };

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="container">
          <div className="loading-state">
            <p>{t('ui.labels.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  const languageNames: Record<string, string> = {
    fr: 'French',
    es: 'Spanish',
    de: 'German'
  };

  // Add target language options
  const targetLanguages = [
    { code: 'en', name: t('languages.en') },
    { code: 'es', name: t('languages.es') },
    { code: 'fr', name: t('languages.fr') },
    { code: 'de', name: t('languages.de') }
  ];

  return (
    <div className="event-details-page">
      <div className="container">
        {/* Back Button */}
        <div className="page-header-actions" style={{ marginBottom: '24px' }}>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft size={16} />
            {t('ui.navigation.back')}
          </button>
        </div>

        {/* Event Header */}
        <div className="card event-header-card">
          <div className="card-content">
            <div className="event-header">
              <div className="event-info">
                <h1 className="event-title">{event.title}</h1>
                <p className="event-description">{event.description}</p>
                
                <div className="event-meta">
                  <div className="meta-item">
                    <Calendar size={18} />
                    <span>{formatDate(event.date, { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  
                  <div className="meta-item">
                    <Clock size={18} />
                    <span>{event.duration} minutes</span>
                  </div>
                  
                  <div className="meta-item">
                    <Users size={18} />
                    <span>{event.participants}/{event.maxParticipants} participants</span>
                  </div>
                  
                  <div className="meta-item">
                    <Globe size={18} />
                    <span>{languageNames[event.language]} ({event.level})</span>
                  </div>
                  
                  <div className="meta-item">
                    <MapPin size={18} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="event-actions">
                {!isRegistered ? (
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleJoinEvent}
                  >
                    {t('ui.buttons.joinEvent')}
                  </button>
                ) : (
                  <div className="registration-confirmed">
                    <CheckCircle size={24} />
                    <div>
                      <div className="registration-confirmed-title">{t('ui.labels.registered')}</div>
                      <div className="registration-confirmed-subtitle">{t('ui.labels.eventConfirmation')}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="event-content-grid">
          {/* Left Column */}
          <div className="event-main-content">
            {/* Agenda Section */}
            <section className="event-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">{t('pages.headings.eventAgenda')}</h2>
                </div>
                <div className="card-content">
                  <div className="agenda-list">
                    {event.agenda.map((item: string, index: number) => (
                      <div key={index} className="agenda-item">
                        <div className="agenda-number">{index + 1}</div>
                        <div className="agenda-text">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Enhanced Pronunciation Practice */}
            <section className="event-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">{t('pages.headings.pronunciationPractice')}</h2>
                  <p className="card-description">{t('pages.descriptions.pronunciationPractice')}</p>
                </div>
                <div className="card-content">
                  <div className="audio-practice-content">
                    {/* Translation Input Section */}
                    <div className="translation-section">
                      <div className="form-group">
                        <label className="form-label">
                          <Languages size={16} />
                          {t('forms.labels.enterText')}
                        </label>
                        <textarea
                          className="form-input"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder={t('forms.placeholders.typeHere')}
                          rows={3}
                        />
                      </div>
                      
                      <div className="translation-controls">
                        <div className="form-group">
                          <label className="form-label">{t('ui.labels.selectLanguage')}</label>
                          <select
                            className="form-select"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                          >
                            {targetLanguages
                              .filter(lang => lang.code !== event.language)
                              .map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                  {lang.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        
                        <button
                          className="btn btn-primary"
                          onClick={handleTranslate}
                          disabled={isTranslating}
                        >
                          {isTranslating ? (
                            <>
                              <span className="loading-spinner"></span>
                              {t('ui.labels.loading')}
                            </>
                          ) : (
                            <>
                              <Languages size={16} />
                              {t('ui.buttons.translate')}
                            </>
                          )}
                        </button>
                      </div>
                      
                      {translatedText && (
                        <div className="translation-result">
                          <div className="result-header">
                            <Languages size={16} />
                            <span>{t('ui.labels.translation')}</span>
                          </div>
                          <div className="result-content">
                            <p className="translated-text">{translatedText}</p>
                          </div>
                          <div className="translation-actions">
                            <button 
                              className="btn btn-outline"
                              onClick={() => {
                                navigator.clipboard.writeText(translatedText);
                                // In a real app, you might want to show a toast notification
                              }}
                            >
                              {t('ui.buttons.copy')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Audio Visualization */}
                    <div className="audio-visualizer">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i} 
                          className="bar"
                          style={{ 
                            height: `${Math.random() * 60 + 10}%`,
                            animationDelay: `${i * 0.1}s`,
                            backgroundColor: isPlaying ? `hsl(${i * 18}, 70%, 50%)` : undefined
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    {/* Enhanced Audio Controls */}
                    <div className="audio-controls">
                      <div className="audio-buttons">
                        <button 
                          className="audio-play-btn"
                          onClick={playTranslatedText}
                          disabled={!translatedText}
                          title={t('ui.buttons.listen')}
                        >
                          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        {(audioProgress > 0 || isPlaying) && (
                          <button 
                            className="btn btn-outline"
                            onClick={resetAudio}
                            title={t('ui.buttons.reset')}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="audio-progress">
                        <div className="audio-progress-bar">
                          <div className="audio-progress-fill" style={{ width: `${audioProgress}%` }}></div>
                        </div>
                        <div className="audio-time">
                          <span>{Math.floor(audioProgress * 2.5 / 60)}:{String(Math.floor(audioProgress * 2.5 % 60)).padStart(2, '0')}</span>
                          <span>4:10</span>
                        </div>
                      </div>
                      
                      <div className="audio-text">
                        <div className="text-pair">
                          <p className="audio-sentence">
                            <Mic size={16} />
                            {inputText}
                          </p>
                          <p className="audio-translation">
                            <Volume2 size={16} />
                            {translatedText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="event-sidebar">
            {/* Host Information */}
            <section className="event-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">{t('pages.headings.eventHost')}</h2>
                </div>
                <div className="card-content">
                  <div className="host-info">
                    <div className="host-avatar">
                      {event.host.avatar ? (
                        <img src={event.host.avatar} alt={event.host.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                    <div className="host-details">
                      <h3 className="host-name">{event.host.name}</h3>
                      <p className="host-role">{event.host.role}</p>
                      <div className="host-rating">
                        <Star size={16} fill="currentColor" />
                        <span>{event.host.rating}</span>
                        <span className="rating-count">(127 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="host-badges">
                    <div className="badge">
                      <Award size={16} />
                      <span>Top Rated</span>
                    </div>
                    <div className="badge">
                      <CheckCircle size={16} />
                      <span>Verified</span>
                    </div>
                  </div>
                  
                  <div className="host-bio">
                    <p>Experienced language educator with 10+ years of teaching French to international students. Specializes in conversational practice and cultural immersion.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Participants */}
            <section className="event-section">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">{t('pages.headings.participants')}</h2>
                </div>
                <div className="card-content">
                  <div className="participants-list">
                    {event.participantsList.map((participant: any, index: number) => (
                      <div key={index} className="participant-item">
                        <div className="participant-avatar">
                          {participant.avatar ? (
                            <img src={participant.avatar} alt={participant.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div className="participant-info">
                          <h4 className="participant-name">{participant.name}</h4>
                          <p className="participant-level">{participant.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="invite-friends">
                    <button className="btn btn-outline btn-block">
                      <MessageCircle size={16} />
                      {t('ui.buttons.inviteFriends')}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;