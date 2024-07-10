import React from 'react';
import Image from 'next/image';

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ image, title, description }) => {
  // You need to know the width and height of your images
  const width = 629; // Example width, you need to update it with the actual width of your image
  const height = 479; // Example height, you need to update it with the actual height of your image

  return (
    <div className="col-md-4">
      <div className="card" style={{ width: '18rem' }}>
        <Image src={image} width={width} height={height} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title display-6">{title}</h5>
          <p className="card-text lead">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

