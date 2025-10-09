import React from 'react';

export default function SimplePage() {
  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#1e40af',
          marginBottom: '16px' 
        }}>
          🛫 Yatra Saathi
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto' 
        }}>
          AI से चलने वाला यात्रा मंच - आपके सफर का विश्वसनीय साथी
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        marginBottom: '40px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
            24/7 AI सहायता
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            किसी भी समय अपने सवालों का तुरंत जवाब पाएं। हमारा AI सहायक हमेशा आपकी मदद के लिए तैयार है।
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
            आसान बुकिंग
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            सेकंडों में अपनी यात्रा बुक करें। बस हमारे सहायक से बात करें और अपनी यात्रा बुक करें।
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
            रूट जानकारी
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            उपलब्ध रूट, समय सारणी और कीमतों की जानकारी प्राप्त करें। अपनी यात्रा के लिए सभी विवरण पाएं।
          </p>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '20px' 
        }}>
          अपनी यात्रा शुरू करने के लिए तैयार हैं?
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: '#6b7280',
          marginBottom: '30px' 
        }}>
          हजारों संतुष्ट यात्रियों के साथ जुड़ें और आज ही यात्रा बुकिंग के भविष्य का अनुभव करें।
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            💬 अभी बात करें
          </button>
          <button style={{
            backgroundColor: 'white',
            color: '#3b82f6',
            padding: '12px 24px',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            🗺️ रूट देखें
          </button>
        </div>
      </div>
    </div>
  );
}