import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  User, 
  Lock, 
  Download, 
  Trash2, 
  Key, 
  CreditCard, 
  Mail, 
  Smartphone, 
  Wifi, 
  Database, 
  Eye, 
  EyeOff, 
  Check,
  X
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

export const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    account: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '',
      confirmPassword: ''
    },
    notifications: {
      email: true,
      push: false,
      marketing: false,
      sms: true
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      searchVisibility: true
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      language: 'en'
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: '30'
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  const accountActions = [
    { icon: <User size={20} />, label: 'Edit Profile', description: 'Update your personal information and avatar' },
    { icon: <Lock size={20} />, label: 'Change Password', description: 'Update your account password for security' },
    { icon: <Key size={20} />, label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' },
    { icon: <CreditCard size={20} />, label: 'Payment Methods', description: 'Manage your payment methods and billing info' },
    { icon: <Download size={20} />, label: 'Export Data', description: 'Download your account data and conversation history' },
    { icon: <Trash2 size={20} />, label: 'Delete Account', description: 'Permanently delete your account and all data' }
  ];

  const notificationChannels = [
    { id: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
    { id: 'push', label: 'Push Notifications', description: 'Get real-time notifications on your device' },
    { id: 'sms', label: 'SMS Notifications', description: 'Receive text messages for critical alerts' },
    { id: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features and promotions' }
  ];

  const privacySettings = [
    { id: 'profileVisible', label: 'Profile Visibility', description: 'Allow others to find and view your profile' },
    { id: 'activityVisible', label: 'Activity Status', description: 'Show when you\'re online and active' },
    { id: 'searchVisibility', label: 'Search Visibility', description: 'Appear in search results for other users' }
  ];

  const securitySettings = [
    { id: 'twoFactor', label: 'Two-Factor Authentication', description: 'Require additional verification when signing in' },
    { id: 'loginAlerts', label: 'Login Alerts', description: 'Receive notifications when someone signs into your account' },
    { id: 'sessionTimeout', label: 'Session Timeout', description: 'Automatically sign out after inactivity' }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t('pages.headings.accountSettings')}</h1>
          <p className="page-subtitle">{t('pages.descriptions.settings')}</p>
        </div>
      </div>

      <div className="container">
        <div className="settings-content">
          {/* Account Settings */}
          <div className="settings-section card">
            <div className="card-header">
              <User size={24} />
              <h2 className="card-title">Account Settings</h2>
            </div>
            <div className="card-content">
              <div className="account-actions-grid grid grid-2">
                {accountActions.map((action, index) => (
                  <div key={index} className="account-action-card card">
                    <div className="card-content">
                      <div className="account-action-icon">
                        {action.icon}
                      </div>
                      <div className="account-action-info">
                        <h3 className="account-action-title">{action.label}</h3>
                        <p className="account-action-description">{action.description}</p>
                      </div>
                      <button className="btn btn-outline btn-sm">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="settings-section card">
            <div className="card-header">
              <User size={24} />
              <h2 className="card-title">Profile Information</h2>
            </div>
            <div className="card-content">
              <div className="form-grid grid grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.account.name}
                    onChange={(e) => handleSettingChange('account', 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settings.account.email}
                    onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="settings-section card">
            <div className="card-header">
              <Lock size={24} />
              <h2 className="card-title">Change Password</h2>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your current password"
                  />
                  <button 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your new password"
                  />
                  <button 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Confirm your new password"
                  />
                  <button 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li className="requirement met">
                    <Check size={14} />
                    At least 8 characters
                  </li>
                  <li className="requirement met">
                    <Check size={14} />
                    Contains uppercase letter
                  </li>
                  <li className="requirement">
                    <X size={14} />
                    Contains number
                  </li>
                  <li className="requirement">
                    <X size={14} />
                    Contains special character
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="settings-section card">
            <div className="card-header">
              <Globe size={24} />
              <h2 className="card-title">Language & Region</h2>
            </div>
            <div className="card-content">
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">{t('ui.labels.language')}</label>
                  <p className="setting-description">
                    Choose your preferred language for the interface.
                  </p>
                </div>
                <div className="setting-control">
                  <LanguageSelector showLabel={false} />
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Time Zone</label>
                  <p className="setting-description">
                    Select your local time zone for accurate scheduling.
                  </p>
                </div>
                <div className="setting-control">
                  <select className="form-input">
                    <option>(UTC-08:00) Pacific Time</option>
                    <option>(UTC-07:00) Mountain Time</option>
                    <option>(UTC-06:00) Central Time</option>
                    <option>(UTC-05:00) Eastern Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section card">
            <div className="card-header">
              <Bell size={24} />
              <h2 className="card-title">Notifications</h2>
            </div>
            <div className="card-content">
              {notificationChannels.map((channel) => (
                <div key={channel.id} className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">{channel.label}</label>
                    <p className="setting-description">{channel.description}</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications[channel.id as keyof typeof settings.notifications]}
                        onChange={(e) => handleSettingChange('notifications', channel.id, e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="settings-section card">
            <div className="card-header">
              <Shield size={24} />
              <h2 className="card-title">Privacy</h2>
            </div>
            <div className="card-content">
              {privacySettings.map((setting) => (
                <div key={setting.id} className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">{setting.label}</label>
                    <p className="setting-description">{setting.description}</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.privacy[setting.id as keyof typeof settings.privacy]}
                        onChange={(e) => handleSettingChange('privacy', setting.id, e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="settings-section card">
            <div className="card-header">
              <Lock size={24} />
              <h2 className="card-title">Security</h2>
            </div>
            <div className="card-content">
              {securitySettings.map((setting) => (
                <div key={setting.id} className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">{setting.label}</label>
                    <p className="setting-description">{setting.description}</p>
                  </div>
                  <div className="setting-control">
                    {setting.id === 'sessionTimeout' ? (
                      <select 
                        className="form-input"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    ) : (
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={Boolean(settings.security[setting.id as keyof typeof settings.security])}
                          onChange={(e) => handleSettingChange('security', setting.id, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="settings-section card">
            <div className="card-header">
              <Palette size={24} />
              <h2 className="card-title">Appearance</h2>
            </div>
            <div className="card-content">
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">{t('ui.labels.theme')}</label>
                  <p className="setting-description">
                    Choose your preferred color theme.
                  </p>
                </div>
                <div className="setting-control">
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="form-input"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Font Size</label>
                  <p className="setting-description">
                    Adjust the text size for better readability.
                  </p>
                </div>
                <div className="setting-control">
                  <select
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                    className="form-input"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;