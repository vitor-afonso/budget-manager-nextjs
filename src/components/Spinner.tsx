import React from 'react';
import Image from 'next/image';

const Spinner = ({ size }:{ size?: number }) => {
  return <div className="text-center">
    <Image src="./images/budget-spinner.svg" alt="spinner" width={size || 100} height={100} />
  </div>;
};

export default Spinner;
