import React, { ReactNode } from 'react';

const ErrorMessage = ({ children }: { children: ReactNode }) => {
  return <p className="text-red-500 font-bold text-sm">{children}</p>;
};

export default ErrorMessage;
