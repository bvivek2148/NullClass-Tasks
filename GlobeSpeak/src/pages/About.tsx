import React from 'react';
import { Globe, Users, Heart, Target, Award, Zap } from 'lucide-react';

// Note: Linkedin and Twitter icons are not available in lucide-react
// Using placeholder divs for social icons

export const About: React.FC = () => {

  const values = [
    {
      icon: <Globe size={32} />,
      title: 'Global Connection',
      description: 'Breaking down language barriers to connect people worldwide.'
    },
    {
      icon: <Users size={32} />,
      title: 'Community First',
      description: 'Building inclusive communities where everyone can participate.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Made with Care',
      description: 'Every feature is crafted with love and attention to detail.'
    },
    {
      icon: <Target size={32} />,
      title: 'Purpose Driven',
      description: 'Focused on making real-world impact through technology.'
    },
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality experience.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Innovation',
      description: 'Constantly pushing boundaries with cutting-edge solutions.'
    }
  ];


  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '25', label: 'Languages' },
    { number: '100+', label: 'Countries' },
    { number: '99%', label: 'Uptime' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">About GlobeSpeak</h1>
            <p className="hero-subtitle">
              Connecting the world through innovative communication technology
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid grid grid-4">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item card stat-card-elevated">
                <div className="card-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="mission-content grid grid-2">
            <div className="mission-text">
              <h2 className="section-title">Our Mission</h2>
              <p className="section-description">
                At GlobeSpeak, I believe that language should never be a barrier to human connection. 
                My mission is to create a world where anyone can communicate with anyone, regardless 
                of the language they speak.
              </p>
              <p className="section-description">
                I'm building the future of global communication through innovative technology, 
                thoughtful design, and a deep commitment to bringing people together across cultures 
                and continents.
              </p>
            </div>
            <div className="mission-visual">
              <div className="mission-globe">
                <Globe size={200} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
            <p className="section-description">
              The principles that guide everything we do at GlobeSpeak.
            </p>
          </div>
          <div className="values-grid grid grid-3">
            {values.map((value, index) => (
              <div key={index} className="value-card card">
                <div className="card-content">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className="story-content">
            <h2 className="section-title">Our Story</h2>
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3>The Beginning</h3>
                  <p>
                    Founded by Vivek, a solo developer from India who experienced firsthand 
                    the challenges of cross-cultural communication while working with global teams.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-content">
                  <h3>First Product Launch</h3>
                  <p>
                    Launched our MVP with support for 5 languages and gained our first 
                    1,000 users within the first month.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-content">
                  <h3>Global Expansion</h3>
                  <p>
                    Expanded to 15 languages and reached 50,000 active users across 
                    100+ countries worldwide.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2023</div>
                <div className="timeline-content">
                  <h3>AI Revolution</h3>
                  <p>
                    Integrated advanced AI technology to provide real-time, context-aware 
                    translations with 95% accuracy.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h3>Community Platform</h3>
                  <p>
                    Launched community features enabling language learners and native 
                    speakers to connect and learn from each other.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;