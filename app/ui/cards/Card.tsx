import React from 'react';

const Card = ({ children, className = '', style = {}}: {children: React.ReactNode, className?: string, style?: any}) => {
  return (
    <div style={style} className={`border border-gray-300 shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
