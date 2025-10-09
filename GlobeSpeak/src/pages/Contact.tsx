import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, Bug, Clock, User, Building, Globe } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours.',
      contact: 'support@globespeak.com',
      action: 'mailto:support@globespeak.com'
    },
    {
      icon: <Phone size={24} />,
      title: 'Call Us',
      description: 'Speak directly with Vivek for support.',
      contact: '+91 98765 43210',
      action: 'tel:+919876543210'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Live Chat',
      description: 'Chat with us in real-time for immediate assistance.',
      contact: 'Available 24/7',
      action: '#'
    }
  ];

  const officeInfo = [
    {
      icon: <Building size={24} />,
      title: 'Headquarters',
      address: '123 Tech Park, Bandra-Kurla Complex, Mumbai, India 400051',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM IST'
    },
    {
      icon: <Globe size={24} />,
      title: 'International',
      address: '456 Global Avenue, London, UK SW1A 1AA',
      hours: 'Monday - Friday: 9:00 AM - 5:00 PM GMT'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: <MessageCircle size={16} /> },
    { value: 'support', label: 'Technical Support', icon: <HelpCircle size={16} /> },
    { value: 'bug', label: 'Bug Report', icon: <Bug size={16} /> },
    { value: 'feature', label: 'Feature Request', icon: <Send size={16} /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-subtitle">
              We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-description">
              We're available through multiple channels to assist you.
            </p>
          </div>
          
          <div className="contact-methods grid grid-3">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method card">
                <div className="card-content">
                  <div className="method-icon">{method.icon}</div>
                  <h3 className="method-title">{method.title}</h3>
                  <p className="method-description">{method.description}</p>
                  <a 
                    href={method.action} 
                    className="method-contact"
                    aria-label={`${method.title}: ${method.contact}`}
                  >
                    {method.contact}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Offices</h2>
            <p className="section-description">
              Visit us at one of our locations around the world.
            </p>
          </div>
          
          <div className="office-info grid grid-2">
            {officeInfo.map((office, index) => (
              <div key={index} className="office-card card">
                <div className="card-content">
                  <div className="office-header">
                    <div className="office-icon">{office.icon}</div>
                    <h3 className="office-title">{office.title}</h3>
                  </div>
                  <div className="office-address">
                    <MapPin size={20} />
                    <span>{office.address}</span>
                  </div>
                  <div className="office-hours">
                    <Clock size={20} />
                    <span>{office.hours}</span>
                  </div>
                  <div className="map-placeholder">
                    <MapPin size={32} />
                    <p>Map Location</p>
                    <p className="map-note">Interactive map available in full version</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section">
        <div className="container">
          <div className="contact-form-section">
            <div className="form-header">
              <h2 className="section-title">Send us a Message</h2>
              <p className="section-description">
                Have a question or feedback? We'd love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form card">
              <div className="card-content">
                {submitStatus === 'success' && (
                  <div className="form-success">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="form-error">
                    There was an error submitting your message. Please try again.
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      {t('forms.labels.fullName')} *
                    </label>
                    <div className="input-group">
                      <User size={16} className="input-icon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder={t('forms.placeholders.enterFirstName')}
                        required
                        aria-describedby="name-help"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      {t('forms.labels.email')} *
                    </label>
                    <div className="input-group">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder={t('forms.placeholders.enterEmail')}
                        required
                        aria-describedby="email-help"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      aria-describedby="category-help"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      {t('forms.labels.subject')} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Brief description of your inquiry"
                      required
                      aria-describedby="subject-help"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    {t('forms.labels.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-input"
                    rows={6}
                    placeholder="Please provide as much detail as possible"
                    required
                    aria-describedby="message-help"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;