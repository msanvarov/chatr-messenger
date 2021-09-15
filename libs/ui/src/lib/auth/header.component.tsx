import React from 'react';
import { Link } from 'react-router-dom';

import LogoDarkPng from '../../assets/logo-dark.png';
import LogoLightPng from '../../assets/logo-light.png';

type HeaderProps = {
  heading: string;
  subheading: string;
};

export const Header: React.FC<HeaderProps> = ({ heading, subheading }) => {
  return (
    <div className="text-center mb-4">
      <Link to="/" className="auth-logo mb-5 d-block">
        <img
          src={LogoDarkPng}
          alt="dark logo"
          height="100"
          className="logo logo-dark"
        />
        <img
          src={LogoLightPng}
          alt="light logo"
          height="100"
          className="logo logo-light"
        />
      </Link>

      <h4>{heading}</h4>
      <p className="text-muted mb-4">{subheading}</p>
    </div>
  );
};
