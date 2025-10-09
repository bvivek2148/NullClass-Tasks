import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { formatDate } from '../../i18n';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('pages.headings.aboutUs'),
      links: [
        { label: t('ui.navigation.about'), href: '/about' },
        { label: t('pages.headings.features'), href: '/features' },
        { label: t('pages.headings.testimonials'), href: '/testimonials' }
      ]
    },
    {
      title: t('ui.navigation.contact'),
      links: [
        { label: t('ui.navigation.contact'), href: '/contact' },
        { label: 'Support', href: '/support' },
        { label: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' }
      ]
    }
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Globe size={32} />
              <span className="footer-brand-text">GlobeSpeak</span>
            </div>
            <p className="footer-description">
              {t('pages.descriptions.home')}
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>contact@globespeak.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            {footerLinks.map((section, index) => (
              <div key={index} className="footer-section">
                <h3 className="footer-section-title">{section.title}</h3>
                <ul className="footer-section-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href} 
                        className="footer-link"
                        aria-label={link.label}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="footer-newsletter">
            <h3 className="footer-section-title">Stay Updated</h3>
            <p className="newsletter-description">
              Get the latest updates and features delivered to your inbox.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder={t('forms.placeholders.enterEmail')}
                  className="newsletter-input"
                  aria-label="Email for newsletter"
                  required
                />
                <button 
                  type="submit" 
                  className="newsletter-button"
                  aria-label="Subscribe to newsletter"
                >
                  {t('ui.buttons.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} GlobeSpeak. Created by Vivek. All rights reserved.
            </p>
            <div className="footer-meta">
              <span className="footer-meta-item">
                {t('ui.labels.language')}: {t(`languages.${document.documentElement.lang || 'en'}`)}
              </span>
              <span className="footer-meta-item">
                {t('ui.status.online')}
              </span>
              <span className="footer-meta-item">
                {formatDate(new Date(), { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
