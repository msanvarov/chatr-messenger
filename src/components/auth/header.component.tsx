import React from 'react';
import { Link } from 'react-router-dom';
import LogoDarkPNG from 'assets/logo-dark.png';
import LogoLightPNG from 'assets/logo-light.png';

type HeaderProps = {
  heading: string;
  subHeading: string;
};

const Header: React.FC<HeaderProps> = ({ heading, subHeading }) => {
  return (
    <div className="text-center mb-4">
      <Link to="/" className="auth-logo mb-5 d-block">
        <img src={LogoDarkPNG} alt="dark logo" height="100" className="logo logo-dark" />
        <img src={LogoLightPNG} alt="light logo" height="100" className="logo logo-light" />
      </Link>

      <h4>{heading}</h4>
      <p className="text-muted mb-4">{subHeading}</p>
    </div>
  );
};

export default Header;
