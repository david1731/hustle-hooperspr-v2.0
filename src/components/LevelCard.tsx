import React from 'react';

interface LevelCardProps {
  title: string;
  description: string;
}

const LevelCard: React.FC<LevelCardProps> = ({ title, description }) => {
  return (
    <div className="col-md-4">
      <h3>{title}</h3>
      <p className="lead">{description}</p>
    </div>
  );
};

export default LevelCard;
