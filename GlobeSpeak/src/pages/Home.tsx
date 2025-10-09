import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Users, MessageCircle, Shield, Zap, Heart, ArrowRight, Star, CheckCircle, Award, TrendingUp, Lock, Headphones, Mic, BookOpen, Play } from 'lucide-react';
import { formatCompactNumber } from '../i18n';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Globe size={32} />,
      title: 'Global Communication',
      description: 'Connect with people from around the world in their native language.'
    },
    {
      icon: <Users size={32} />,
      title: 'Community Driven',
      description: 'Join a vibrant community of language learners and native speakers.'
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'Real-time Translation',
      description: 'Instant translation powered by advanced AI technology.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Privacy First',
      description: 'Your conversations are secure and private by design.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      description: 'Experience seamless communication without delays.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Made with Love',
      description: 'Crafted with care to bring people together across cultures.'
    }
  ];

  const stats = [
    { number: 50000, label: 'Active Users' },
    { number: 25, label: 'Languages Supported' },
    { number: 1000000, label: 'Messages Translated' },
    { number: 150, label: 'Countries Reached' }
  ];

  const testimonials = [
    {
      name: 'Maria González',
      role: 'Language Teacher',
      content: 'GlobeSpeak has revolutionized how I connect with my international students. The real-time translation is incredibly accurate.',
      rating: 5
    },
    {
      name: 'Chen Wei',
      role: 'Business Owner',
      content: 'Perfect for communicating with our global clients. Highly recommended for any business looking to expand internationally.',
      rating: 5
    },
    {
      name: 'Vivek',
      role: 'Founder & Creator',
      content: 'I created GlobeSpeak as a solo developer from India to solve real communication challenges I faced while working with global teams.',
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      title: 'Seamless Communication',
      description: 'Break down language barriers with real-time translation'
    },
    {
      icon: <Award size={24} />,
      title: 'Expert Quality',
      description: 'Professional-grade translation accuracy'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Continuous Learning',
      description: 'Improve your language skills with every conversation'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <MessageCircle size={32} />,
      title: 'Start a Conversation',
      description: 'Connect with native speakers from around the world'
    },
    {
      step: 2,
      icon: <Mic size={32} />,
      title: 'Speak Naturally',
      description: 'Our AI translates your speech in real-time'
    },
    {
      step: 3,
      icon: <Headphones size={32} />,
      title: 'Listen & Respond',
      description: 'Hear the translation and respond naturally'
    },
    {
      step: 4,
      icon: <BookOpen size={32} />,
      title: 'Learn & Improve',
      description: 'Enhance your language skills with each interaction'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('pages.headings.welcome')}
            </h1>
            <p className="hero-subtitle">
              {t('pages.descriptions.home')}
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                {t('pages.headings.getStarted')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                {t('ui.navigation.about')}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="hero-stack"
              aria-hidden="true"
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                el.style.setProperty('--tiltX', `${y * -10}deg`);
                el.style.setProperty('--tiltY', `${x * 10}deg`);
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.setProperty('--tiltX', '0deg');
                el.style.setProperty('--tiltY', '0deg');
              }}
            >
              <div className="hero-card layer-1">
                <div className="ui-header">
                  <div className="header-icons">
                    <div className="header-icon"></div>
                    <div className="header-icon"></div>
                    <div className="header-icon"></div>
                  </div>
                </div>
                <div className="ui-body">
                  <div className="ui-panel">
                    <div className="panel-header">
                      <div className="panel-title"></div>
                      <div className="panel-actions">
                        <div className="panel-action"></div>
                        <div className="panel-action"></div>
                      </div>
                    </div>
                    <div className="panel-content">
                      <div className="message-bubble incoming">
                        <div className="message-text"></div>
                        <div className="message-text short"></div>
                      </div>
                      <div className="message-bubble outgoing">
                        <div className="message-text"></div>
                        <div className="message-text short"></div>
                      </div>
                    </div>
                  </div>
                  <div className="ui-input">
                    <div className="input-field"></div>
                    <div className="input-button"></div>
                  </div>
                </div>
              </div>
              <div className="hero-card layer-2"></div>
              <div className="hero-card layer-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item card stat-card-elevated">
                <div className="card-content">
                  <div className="stat-number">
                    {formatCompactNumber(stat.number)}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How GlobeSpeak Works</h2>
            <p className="section-description">
              Experience seamless global communication in four simple steps.
            </p>
          </div>
          <div className="how-it-works-grid grid grid-4">
            {howItWorks.map((step, index) => (
              <div key={index} className="how-it-works-card card">
                <div className="card-content">
                  <div className="step-number">{step.step}</div>
                  <div className="how-it-works-icon">{step.icon}</div>
                  <h3 className="how-it-works-title">{step.title}</h3>
                  <p className="how-it-works-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose GlobeSpeak?</h2>
            <p className="section-description">
              Experience the future of global communication with our cutting-edge platform.
            </p>
          </div>
          <div className="benefits-grid grid grid-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card card">
                <div className="card-content">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('pages.headings.features')}</h2>
            <p className="section-description">
              Discover what makes GlobeSpeak the perfect platform for global communication.
            </p>
          </div>
          <div className="features-grid grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="card-content">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('pages.headings.testimonials')}</h2>
            <p className="section-description">
              See what our users are saying about their GlobeSpeak experience.
            </p>
          </div>
          <div className="testimonials-grid grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card card">
                <div className="card-content">
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < testimonial.rating ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <div className="avatar-placeholder">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div className="author-info">
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section section">
        <div className="container">
          <div className="security-content">
            <div className="security-icon">
              <Lock size={48} />
            </div>
            <div className="security-text">
              <h2 className="security-title">Enterprise-Grade Security</h2>
              <p className="security-description">
                Your conversations are encrypted end-to-end and never stored. We prioritize your privacy above all else.
              </p>
            </div>
            <div className="security-actions">
              <Link to="/about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Connect with the World?</h2>
            <p className="cta-description">
              Join thousands of users who are already breaking down language barriers.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                {t('pages.headings.getStarted')}
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                {t('ui.navigation.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;