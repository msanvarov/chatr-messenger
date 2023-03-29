import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CardBody, CardHeader, Collapse } from 'reactstrap';
import { Children } from '../global-types';

type CustomCollapseProps = {
  isOpen: boolean;
  toggleCollapse: () => void;
  iconClass?: string;
  title: string;
} & Children;

export const CustomCollapse = ({
  title,
  isOpen,
  toggleCollapse,
  iconClass,
  children,
}: CustomCollapseProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Link to="#" onClick={toggleCollapse} className="text-dark">
        <CardHeader id="profile-user-headingOne">
          <h5 className="font-size-14 m-0">
            {iconClass && (
              <i
                className={classNames(
                  iconClass,
                  'me-2 align-middle d-inline-block'
                )}
              ></i>
            )}
            {t(title)}
            <i
              className={
                isOpen
                  ? 'mdi mdi-chevron-up float-end accor-plus-icon'
                  : 'mdi mdi-chevron-right float-end accor-plus-icon'
              }
            ></i>
          </h5>
        </CardHeader>
      </Link>
      <Collapse isOpen={isOpen}>
        <CardBody>{children}</CardBody>
      </Collapse>
    </>
  );
};
