import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type FooterProps = {
  text: string;
  linkTo: string;
  linkText: string;
};

const Footer: React.FC<FooterProps> = ({ text, linkText, linkTo }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-5 text-center">
      <p>
        {t(text)}?{' '}
        <Link to={linkTo} className="font-weight-medium text-primary">
          {' '}
          {t(linkText)}{' '}
        </Link>{' '}
      </p>
      <p>
        © {t('2020 Chatr')}. {t('Crafted with')} <i className="mdi mdi-heart text-danger"></i>{' '}
        {t('by Sal')}
      </p>
    </div>
  );
};

export default Footer;
