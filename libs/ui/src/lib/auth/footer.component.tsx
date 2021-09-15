import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type FooterProps = {
  text: string;
  link: string;
  linkText: string;
};

const year = new Date().getFullYear();

export const Footer: React.FC<FooterProps> = ({ text, linkText, link }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-5 text-center">
      <p>
        {t(text)}?{' '}
        <Link to={link} className="font-weight-medium text-primary">
          {' '}
          {t(linkText)}{' '}
        </Link>{' '}
      </p>
      <p>
        © {t(`${year} Chatr`)}. {t('Crafted with')}{' '}
        <i className="mdi mdi-heart text-danger"></i> {t('by Sal')}
      </p>
    </div>
  );
};
