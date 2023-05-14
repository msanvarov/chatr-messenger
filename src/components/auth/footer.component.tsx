import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type FooterProps = {
  text: string;
  url: string;
  linkBody: string;
};

const year = new Date().getFullYear();

export const Footer = ({ text, linkBody, url }: FooterProps) => {
  const { t } = useTranslation();
  return (
    <div className="mt-5 text-center">
      <p>
        {t(text)}
        <Link to={url} className="font-weight-medium text-primary">
          {' '}
          {t(linkBody)}{' '}
        </Link>{' '}
      </p>
      <p>
        © {t(`${year} Chatr`)}. {t('Crafted with')}{' '}
        <i className="mdi mdi-heart text-danger"></i> {t('by Sal')}
      </p>
    </div>
  );
};
