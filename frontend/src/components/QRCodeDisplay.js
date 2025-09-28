import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  logoUrl?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  value, 
  size = 180,
  logoUrl 
}) => {
  return (
    <div style={{ 
      background: "#fff", 
      padding: 16, 
      borderRadius: 12, 
      boxShadow: "0 2px 8px #0001", 
      display: "inline-block",
      position: "relative"
    }}>
      <QRCodeCanvas 
        value={value} 
        size={size}
        level="M"
        includeMargin={false}
      />
      
      {/* Logo central opcional */}
      {logoUrl && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '4px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={logoUrl} 
            alt="Logo" 
            style={{ width: 24, height: 24, objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;