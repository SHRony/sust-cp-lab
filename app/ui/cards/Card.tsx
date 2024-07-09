import React from 'react';

const Card = ({ children, className = '', style = {}}: {children: React.ReactNode, className?: string, style?: any}) => {
  return (
    <div style={style} className={`shadow-card border-card border ${className}`}>
      {children}
    </div>
  );
};

export default Card;
