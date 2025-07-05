import React from 'react';

interface ErrorViewProps {
  error: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '24px', color: '#e74c3c', marginBottom: '20px' }}>
        Error Loading Content
      </div>
      <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
        {error}
      </div>
      <div style={{ fontSize: '14px', color: '#999' }}>
        Make sure the content file exists in the dist directory.
      </div>
    </div>
  );
}; 