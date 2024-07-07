import React from 'react';

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ image, title, description }) => {
  return (
    <div className="col-md-4">
      <div className="card" style={{ width: '18rem' }}>
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title display-6">{title}</h5>
          <p className="card-text lead">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
