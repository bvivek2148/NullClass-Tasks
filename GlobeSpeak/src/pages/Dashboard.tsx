import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Globe, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Settings,
  Award,
  Target,
  BookOpen,
  Zap,
  ChevronRight,
  BarChart3,
  CalendarDays,
  Trophy,
  Languages,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  Volume2,
  Mic,
  Play,
  Pause
} from 'lucide-react';
import { formatDate, formatRelativeTime, formatNumber } from '../i18n';

// Mock data for charts
const weeklyActivityData = [
  { day: 'Mon', messages: 42, translations: 38 },
  { day: 'Tue', messages: 56, translations: 52 },
  { day: 'Wed', messages: 38, translations: 35 },
  { day: 'Thu', messages: 64, translations: 59 },
  { day: 'Fri', messages: 72, translations: 68 },
  { day: 'Sat', messages: 48, translations: 45 },
  { day: 'Sun', messages: 32, translations: 30 }
];

const languageDistributionData = [
  { language: 'Spanish', percentage: 35, users: 12400 },
  { language: 'French', percentage: 25, users: 8900 },
  { language: 'German', percentage: 15, users: 5300 },
  { language: 'Italian', percentage: 12, users: 4200 },
  { language: 'Other', percentage: 13, users: 4600 }
];

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  // Add new state for translation feature
  const [inputText, setInputText] = useState('Hello, how are you today?');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('Hola, ¿cómo estás hoy?');
  const [isTranslating, setIsTranslating] = useState(false);

  // Mock data - in a real app, this would come from an API
  const userStats = {
    messagesTranslated: 1247,
    languagesUsed: 8,
    conversationsStarted: 156,
    friendsConnected: 42,
    streak: 12,
    accuracy: 94,
    wordsLearned: 1240
  };

  const recentActivity = [
    {
      id: 1,
      type: 'translation',
      message: 'Translated message from Spanish to English',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      language: 'es',
      status: 'success'
    },
    {
      id: 2,
      type: 'conversation',
      message: 'Started conversation with Maria from Mexico',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      language: 'es',
      status: 'success'
    },
    {
      id: 3,
      type: 'friend',
      message: 'Connected with Jean from France',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      language: 'fr',
      status: 'success'
    },
    {
      id: 4,
      type: 'achievement',
      message: 'Earned "Polyglot" badge for using 5+ languages',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      status: 'success'
    },
    {
      id: 5,
      type: 'practice',
      message: 'Completed daily language practice',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      language: 'de',
      status: 'success'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'French Conversation Group',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      participants: 12,
      language: 'fr',
      type: 'group'
    },
    {
      id: 2,
      title: 'Spanish Language Exchange',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      participants: 8,
      language: 'es',
      type: 'exchange'
    },
    {
      id: 3,
      title: 'German Pronunciation Workshop',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      participants: 15,
      language: 'de',
      type: 'workshop'
    }
  ];

  const languageProgress = [
    { language: 'Spanish', code: 'es', progress: 85, level: 'Advanced', nextMilestone: 'Fluent' },
    { language: 'French', code: 'fr', progress: 60, level: 'Intermediate', nextMilestone: 'Advanced' },
    { language: 'German', code: 'de', progress: 30, level: 'Beginner', nextMilestone: 'Intermediate' },
    { language: 'Italian', code: 'it', progress: 15, level: 'Beginner', nextMilestone: 'Elementary' }
  ];

  const quickActions = [
    { icon: <MessageCircle size={20} />, label: 'Start Conversation', action: () => {} },
    { icon: <BookOpen size={20} />, label: 'Language Practice', action: () => {} },
    { icon: <Users size={20} />, label: 'Find Friends', action: () => {} },
    { icon: <Target size={20} />, label: 'Set Goals', action: () => {} },
    { icon: <Mic size={20} />, label: 'Pronunciation', action: () => {} },
    { icon: <Volume2 size={20} />, label: 'Listening Practice', action: () => {} }
  ];

  const performanceMetrics = [
    { icon: <BarChart3 size={20} />, label: 'Translation Accuracy', value: '94%', change: '+2%', trend: 'up' },
    { icon: <CalendarDays size={20} />, label: 'Daily Streak', value: '12 days', change: '+1', trend: 'up' },
    { icon: <Trophy size={20} />, label: 'Achievements', value: '7/15', change: '+1', trend: 'up' },
    { icon: <Languages size={20} />, label: 'Words Learned', value: '1,240', change: '+42', trend: 'up' },
    { icon: <UserCheck size={20} />, label: 'Friends Connected', value: '42', change: '+3', trend: 'up' },
    { icon: <Globe size={20} />, label: 'Languages Used', value: '8', change: '+1', trend: 'up' }
  ];

  const getActivityIcon = (type: string, status?: string) => {
    const iconProps = { size: 16 };
    
    if (status === 'error') return <XCircle {...iconProps} />;
    if (status === 'warning') return <AlertCircle {...iconProps} />;
    
    switch (type) {
      case 'translation':
        return <Globe {...iconProps} />;
      case 'conversation':
        return <MessageCircle {...iconProps} />;
      case 'friend':
        return <Users {...iconProps} />;
      case 'achievement':
        return <Star {...iconProps} />;
      case 'practice':
        return <BookOpen {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const getActivityStatusClass = (status?: string) => {
    switch (status) {
      case 'success':
        return 'activity-success';
      case 'error':
        return 'activity-error';
      case 'warning':
        return 'activity-warning';
      default:
        return '';
    }
  };

  const toggleAudioPlayback = () => {
    if (isPlaying) {
      // Stop playback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setAudioProgress(0);
    } else {
      // Start playback
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create a new speech utterance with translated text
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
          'de': 'de-DE',
          'it': 'it-IT',
          'pt': 'pt-PT',
          'ru': 'ru-RU',
          'ja': 'ja-JP',
          'ko': 'ko-KR',
          'zh': 'zh-CN'
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
        
        // Update progress manually
        const interval = setInterval(() => {
          setAudioProgress(prev => {
            if (prev >= 100 || !isPlaying) {
              clearInterval(interval);
              return 100;
            }
            return Math.min(prev + 2, 100);
          });
        }, 100);
      } else {
        // Fallback for browsers that don't support speech synthesis
        console.warn('Speech synthesis not supported');
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
    }
  };

  // Add function to handle text translation
  const handleTranslate = () => {
    setIsTranslating(true);
    // Simulate translation API call with more comprehensive translations
    setTimeout(() => {
      // In a real app, this would call a translation API
      const translations: Record<string, Record<string, string>> = {
        'Hello, how are you today?': {
          es: 'Hola, ¿cómo estás hoy?',
          fr: 'Bonjour, comment allez-vous aujourd\'hui?',
          de: 'Hallo, wie geht es dir heute?',
          it: 'Ciao, come stai oggi?',
          pt: 'Olá, como você está hoje?',
          ru: 'Привет, как ты сегодня?',
          ja: 'こんにちは、今日はどうですか？',
          ko: '안녕하세요, 오늘 어떻게 지내세요?',
          zh: '你好，今天怎么样？'
        },
        'Hello, how are you': {
          es: 'Hola, ¿cómo estás?',
          fr: 'Bonjour, comment allez-vous?',
          de: 'Hallo, wie geht es dir?',
          it: 'Ciao, come stai?',
          pt: 'Olá, como você está?',
          ru: 'Привет, как ты?',
          ja: 'こんにちは、元気ですか？',
          ko: '안녕하세요, 어떻게 지내세요?',
          zh: '你好，你好吗？'
        },
        'Hello how are you': {
          es: 'Hola, ¿cómo estás?',
          fr: 'Bonjour, comment allez-vous?',
          de: 'Hallo, wie geht es dir?',
          it: 'Ciao, come stai?',
          pt: 'Olá, como você está?',
          ru: 'Привет, как ты?',
          ja: 'こんにちは、元気ですか？',
          ko: '안녕하세요, 어떻게 지내세요?',
          zh: '你好，你好吗？'
        },
        'Hello how are': {
          es: 'Hola, ¿cómo estás?',
          fr: 'Bonjour, comment allez-vous?',
          de: 'Hallo, wie geht es dir?',
          it: 'Ciao, come stai?',
          pt: 'Olá, como você está?',
          ru: 'Привет, как ты?',
          ja: 'こんにちは、元気ですか？',
          ko: '안녕하세요, 어떻게 지내세요?',
          zh: '你好，你好吗？'
        },
        'Hola, ¿cómo estás hoy?': {
          en: 'Hello, how are you today?',
          fr: 'Bonjour, comment allez-vous aujourd\'hui?',
          de: 'Hallo, wie geht es dir heute?',
          it: 'Ciao, come stai oggi?',
          pt: 'Olá, como você está hoje?',
          ru: 'Привет, как ты сегодня?',
          ja: 'こんにちは、今日はどうですか？',
          ko: '안녕하세요, 오늘 어떻게 지내세요?',
          zh: '你好，今天怎么样？'
        },
        'Bonjour, comment allez-vous aujourd\'hui?': {
          en: 'Hello, how are you today?',
          es: 'Hola, ¿cómo estás hoy?',
          de: 'Hallo, wie geht es dir heute?',
          it: 'Ciao, come stai oggi?',
          pt: 'Olá, como você está hoje?',
          ru: 'Привет, как ты сегодня?',
          ja: 'こんにちは、今日はどうですか？',
          ko: '안녕하세요, 오늘 어떻게 지내세요?',
          zh: '你好，今天怎么样？'
        },
        'Good morning': {
          es: 'Buenos días',
          fr: 'Bonjour',
          de: 'Guten Morgen',
          it: 'Buongiorno',
          pt: 'Bom dia',
          ru: 'Доброе утро',
          ja: 'おはようございます',
          ko: '좋은 아침',
          zh: '早上好'
        },
        'Good evening': {
          es: 'Buenas noches',
          fr: 'Bonsoir',
          de: 'Guten Abend',
          it: 'Buonasera',
          pt: 'Boa noite',
          ru: 'Добрый вечер',
          ja: 'こんばんは',
          ko: '안녕하세요',
          zh: '晚上好'
        },
        'Thank you': {
          es: 'Gracias',
          fr: 'Merci',
          de: 'Danke',
          it: 'Grazie',
          pt: 'Obrigado',
          ru: 'Спасибо',
          ja: 'ありがとう',
          ko: '감사합니다',
          zh: '谢谢'
        },
        'Please': {
          es: 'Por favor',
          fr: 'S\'il vous plaît',
          de: 'Bitte',
          it: 'Per favore',
          pt: 'Por favor',
          ru: 'Пожалуйста',
          ja: 'お願いします',
          ko: '제발',
          zh: '请'
        },
        'Yes': {
          es: 'Sí',
          fr: 'Oui',
          de: 'Ja',
          it: 'Sì',
          pt: 'Sim',
          ru: 'Да',
          ja: 'はい',
          ko: '예',
          zh: '은'
        },
        'No': {
          es: 'No',
          fr: 'Non',
          de: 'Nein',
          it: 'No',
          pt: 'Não',
          ru: 'Нет',
          ja: 'いいえ',
          ko: '아니요',
          zh: '아니요'
        },
        'I love learning languages': {
          es: 'Me encanta aprender idiomas',
          fr: 'J\'adore apprendre les langues',
          de: 'Ich liebe es, Sprachen zu lernen',
          it: 'Mi piace imparare le lingue',
          pt: 'Eu amo aprender idiomas',
          ru: 'Я люблю изучать языки',
          ja: '私は言語学習が大好きです',
          ko: '나는 언어 학습을 사랑해요',
          zh: '나는 언어 학습을 사랑해요'
        },
        'How do you say this in Spanish?': {
          es: '¿Cómo se dice esto en español?',
          fr: 'Comment dit-on cela en espagnol?',
          de: 'Wie sagt man das auf Spanisch?',
          it: 'Come si dice questo in spagnolo?',
          pt: 'Como se diz isso em espanhol?',
          ru: 'Как это сказать по-испански?',
          ja: 'これはスペイン語で何と言いますか？',
          ko: '이것을 스페인어로 어떻게 말합니까?',
          zh: '이것을 스페인어로 어떻게 말합니까?'
        }
      };

      // Normalize input text for better matching
      const normalizedInput = inputText.trim();
      
      // If we have a predefined translation, use it
      if (translations[normalizedInput] && translations[normalizedInput][targetLanguage]) {
        setTranslatedText(translations[normalizedInput][targetLanguage]);
      } else {
        // For text not in our predefined list, create a more realistic simulation
        // Check for partial matches with common phrases
        let foundMatch = false;
        
        // Check for partial matches
        for (const [key, value] of Object.entries(translations)) {
          if (normalizedInput.toLowerCase().includes(key.toLowerCase()) || 
              key.toLowerCase().includes(normalizedInput.toLowerCase())) {
            if (value[targetLanguage]) {
              setTranslatedText(value[targetLanguage]);
              foundMatch = true;
              break;
            }
          }
        }
        
        // If no partial match found, provide a more realistic fallback
        if (!foundMatch) {
          const languageNames: Record<string, string> = {
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            it: 'Italian',
            pt: 'Portuguese',
            ru: 'Russian',
            ja: 'Japanese',
            ko: 'Korean',
            zh: 'Chinese'
          };
          
          // Create a more natural translation simulation
          const commonGreetings = ['hello', 'hi', 'good morning', 'good evening'];
          const commonQuestions = ['how are you', 'how are'];
          
          let translatedPhrase = normalizedInput;
          
          // Handle common greetings
          if (commonGreetings.some(greeting => normalizedInput.toLowerCase().includes(greeting))) {
            const greetingsMap: Record<string, Record<string, string>> = {
              hello: {
                es: 'Hola',
                fr: 'Bonjour',
                de: 'Hallo',
                it: 'Ciao',
                pt: 'Olá',
                ru: 'Привет',
                ja: 'こんにちは',
                ko: '안녕하세요',
                zh: '你好'
              }
            };
            
            for (const greeting of commonGreetings) {
              if (normalizedInput.toLowerCase().includes(greeting)) {
                if (greetingsMap[greeting] && greetingsMap[greeting][targetLanguage]) {
                  translatedPhrase = greetingsMap[greeting][targetLanguage];
                  break;
                }
              }
            }
          }
          
          // Handle common questions
          for (const question of commonQuestions) {
            if (normalizedInput.toLowerCase().includes(question)) {
              const questionsMap: Record<string, Record<string, string>> = {
                'how are you': {
                  es: '¿cómo estás?',
                  fr: 'comment allez-vous?',
                  de: 'wie geht es dir?',
                  it: 'come stai?',
                  pt: 'como você está?',
                  ru: 'как ты?',
                  ja: '元気ですか？',
                  ko: '어떻게 지내세요?',
                  zh: '你好吗？'
                },
                'how are': {
                  es: '¿cómo estás?',
                  fr: 'comment allez-vous?',
                  de: 'wie geht es dir?',
                  it: 'come stai?',
                  pt: 'como você está?',
                  ru: 'как ты?',
                  ja: '원기ですか？',
                  ko: '어떻게 지내세요?',
                  zh: '你好吗？'
                }
              };
              
              if (questionsMap[question] && questionsMap[question][targetLanguage]) {
                translatedPhrase = `${translatedPhrase} ${questionsMap[question][targetLanguage]}`;
                break;
              }
            }
          }
          
          setTranslatedText(translatedPhrase);
        }
      }
      
      setIsTranslating(false);
    }, 800);
  };

  // Add function to reset audio
  const resetAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleJoinEvent = (eventId: number, eventTitle: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">{t('pages.headings.dashboard')}</h1>
            <p className="page-subtitle">{t('pages.descriptions.dashboard')}</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline">
              <Settings size={16} />
              {t('ui.navigation.settings')}
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <section className="performance-metrics-section">
          <div className="performance-metrics-grid grid grid-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="metric-card card">
                <div className="card-content">
                  <div className="metric-header">
                    <div className="metric-icon">
                      {metric.icon}
                    </div>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                  <div className="metric-value">{metric.value}</div>
                  <div className={`metric-change ${metric.trend === 'up' ? 'positive' : 'negative'}`}>
                    {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />}
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-description">Get started with these helpful actions</p>
          </div>
          <div className="quick-actions-grid grid grid-6">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="quick-action-card card"
                onClick={action.action}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-content">
                  <div className="quick-action-icon">
                    {action.icon}
                  </div>
                  <div className="quick-action-label">{action.label}</div>
                  <ChevronRight size={16} className="quick-action-arrow" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Overview */}
        <section className="stats-overview">
          <div className="section-header">
            <h2 className="section-title">Your Statistics</h2>
            <p className="section-description">Track your progress and achievements</p>
          </div>
          <div className="stats-grid grid grid-6">
            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <MessageCircle className="stat-icon" size={24} />
                  <span className="stat-label">{t('messages.info.welcome')}</span>
                </div>
                <div className="stat-value">{formatNumber(userStats.messagesTranslated)}</div>
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  +12% {t('time.weekAgo')}
                </div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <Globe className="stat-icon" size={24} />
                  <span className="stat-label">Languages Used</span>
                </div>
                <div className="stat-value">{userStats.languagesUsed}</div>
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  +2 {t('time.monthAgo')}
                </div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <MessageCircle className="stat-icon" size={24} />
                  <span className="stat-label">Conversations</span>
                </div>
                <div className="stat-value">{formatNumber(userStats.conversationsStarted)}</div>
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  +8% {t('time.weekAgo')}
                </div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <Users className="stat-icon" size={24} />
                  <span className="stat-label">Friends</span>
                </div>
                <div className="stat-value">{userStats.friendsConnected}</div>
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  +5 {t('time.weekAgo')}
                </div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <CalendarDays className="stat-icon" size={24} />
                  <span className="stat-label">Current Streak</span>
                </div>
                <div className="stat-value">{userStats.streak} days</div>
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  +1 {t('time.dayAgo')}
                </div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="card-content">
                <div className="stat-header">
                  <CheckCircle className="stat-icon" size={24} />
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat-value">{userStats.accuracy}%</div>
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  +1% {t('time.weekAgo')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="section-header">
            <h2 className="section-title">Activity Overview</h2>
            <p className="section-description">Your language learning progress over time</p>
          </div>
          <div className="charts-grid grid grid-2">
            {/* Weekly Activity Chart */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Weekly Activity</h2>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="period-selector"
                  aria-label="Select time period"
                >
                  <option value="week">{t('time.weekAgo')}</option>
                  <option value="month">{t('time.monthAgo')}</option>
                  <option value="year">{t('time.yearAgo')}</option>
                </select>
              </div>
              <div className="card-content">
                <div className="chart-container">
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="legend-color messages"></div>
                      <span>Messages</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color translations"></div>
                      <span>Translations</span>
                    </div>
                  </div>
                  <div className="bar-chart">
                    {weeklyActivityData.map((data, index) => (
                      <div key={index} className="bar-group">
                        <div className="bar-container">
                          <div 
                            className="bar messages-bar" 
                            style={{ height: `${(data.messages / 80) * 100}%` }}
                          ></div>
                          <div 
                            className="bar translations-bar" 
                            style={{ height: `${(data.translations / 80) * 100}%` }}
                          ></div>
                        </div>
                        <span className="bar-label">{data.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Language Distribution Chart */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Language Distribution</h2>
              </div>
              <div className="card-content">
                <div className="chart-container">
                  <div className="pie-chart">
                    <div className="pie-chart-inner">
                      {languageDistributionData.map((data, index) => (
                        <div 
                          key={index} 
                          className="pie-segment"
                          style={{ 
                            '--start': `${index * (360 / languageDistributionData.length)}deg`,
                            '--end': `${(index + 1) * (360 / languageDistributionData.length)}deg`,
                            '--color': `hsl(${index * 60}, 70%, 50%)`
                          } as React.CSSProperties}
                        >
                          <span className="pie-label">{data.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="chart-legend vertical">
                    {languageDistributionData.map((data, index) => (
                      <div key={index} className="legend-item">
                        <div 
                          className="legend-color" 
                          style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                        ></div>
                        <div className="legend-text">
                          <span className="legend-language">{data.language}</span>
                          <span className="legend-percentage">{data.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Activity */}
          <section className="recent-activity">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Activity</h2>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="period-selector"
                  aria-label="Select time period"
                >
                  <option value="day">{t('time.dayAgo')}</option>
                  <option value="week">{t('time.weekAgo')}</option>
                  <option value="month">{t('time.monthAgo')}</option>
                </select>
              </div>
              <div className="card-content">
                <div className="activity-list">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className={`activity-item ${getActivityStatusClass(activity.status)}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        // Handle activity click based on type
                        switch(activity.type) {
                          case 'translation':
                            // Navigate to translation history
                            break;
                          case 'conversation':
                            // Navigate to conversation
                            break;
                          case 'friend':
                            // Navigate to friend profile
                            break;
                          case 'achievement':
                            // Navigate to achievements
                            break;
                          case 'practice':
                            // Navigate to practice session
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      <div className="activity-icon">
                        {getActivityIcon(activity.type, activity.status)}
                      </div>
                      <div className="activity-content">
                        <p className="activity-message">{activity.message}</p>
                        <span className="activity-time">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      {activity.language && (
                        <span className="activity-language">
                          {activity.language.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Language Progress */}
          <section className="language-progress">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Language Progress</h2>
              </div>
              <div className="card-content">
                <div className="progress-list">
                  {languageProgress.map((lang, index) => (
                    <div 
                      key={index} 
                      className="progress-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        // Navigate to language practice page
                        navigate(`/practice/${lang.code}`);
                      }}
                    >
                      <div className="progress-header">
                        <span className="progress-language">{lang.language}</span>
                        <span className="progress-level">{lang.level}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${lang.progress}%` }}
                        />
                      </div>
                      <div className="progress-footer">
                        <span className="progress-percentage">{lang.progress}%</span>
                        <span className="progress-next">Next: {lang.nextMilestone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="upcoming-events">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Upcoming Events</h2>
              </div>
              <div className="card-content">
                {upcomingEvents.length > 0 ? (
                  <div className="events-list">
                    {upcomingEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="event-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleJoinEvent(event.id, event.title)}
                      >
                        <div className="event-date">
                          <Calendar size={16} />
                          {formatDate(event.date, { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="event-content">
                          <h3 className="event-title">{event.title}</h3>
                          <p className="event-participants">
                            <Users size={14} />
                            {event.participants} participants
                          </p>
                        </div>
                        <div className="event-actions">
                          <span className="event-language">
                            {event.language.toUpperCase()}
                          </span>
                          <button className="btn btn-primary btn-sm" onClick={(e) => {
                            e.stopPropagation();
                            handleJoinEvent(event.id, event.title);
                          }}>
                            Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Calendar size={48} />
                    <p>{t('ui.labels.noData')}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Audio Practice */}
          <section className="audio-practice">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Pronunciation Practice</h2>
              </div>
              <div className="card-content">
                <div className="audio-practice-content">
                  {/* Translation Input Section */}
                  <div className="translation-section">
                    <div className="form-group">
                      <label className="form-label">Enter Text to Translate</label>
                      <textarea
                        className="form-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type or paste text here..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="translation-controls">
                      <div className="form-group">
                        <label className="form-label">Select Language</label>
                        <select
                          className="form-select"
                          value={targetLanguage}
                          onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="it">Italian</option>
                          <option value="pt">Portuguese</option>
                          <option value="ru">Russian</option>
                          <option value="ja">Japanese</option>
                          <option value="ko">Korean</option>
                          <option value="zh">Chinese</option>
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
                            Translating...
                          </>
                        ) : (
                          'Translate'
                        )}
                      </button>
                    </div>
                    
                    {translatedText && (
                      <div className="translation-result">
                        <div className="result-header">
                          <span>Translation Result</span>
                        </div>
                        <div className="result-content">
                          <p className="translated-text">{translatedText}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Audio Visualizer */}
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
                  
                  {/* Audio Controls */}
                  <div className="audio-controls">
                    <div className="audio-buttons">
                      <button 
                        className="audio-play-btn"
                        onClick={toggleAudioPlayback}
                        disabled={!translatedText}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      {(audioProgress > 0 || isPlaying) && (
                        <button 
                          className="btn btn-outline"
                          onClick={resetAudio}
                        >
                          Reset
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
                      <p className="audio-sentence">{inputText}</p>
                      <p className="audio-translation">{translatedText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
