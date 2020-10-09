import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { CardBody, CardHeader, Collapse } from 'reactstrap';

type CustomCollapseProps = {
  isOpen: boolean;
  toggleCollapse: () => void;
  iconClass?: string;
  title: string;
};

const CustomCollapse: React.FC<CustomCollapseProps> = ({
  title,
  isOpen,
  toggleCollapse,
  iconClass,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Link to="#" onClick={toggleCollapse} className="text-dark">
        <CardHeader id="profile-user-headingOne">
          <h5 className="font-size-14 m-0">
            {iconClass && (
              <i className={classNames(iconClass, 'mr-2 align-middle d-inline-block')}></i>
            )}
            {t(title)}
            <i
              className={
                isOpen
                  ? 'mdi mdi-chevron-up float-right accor-plus-icon'
                  : 'mdi mdi-chevron-right float-right accor-plus-icon'
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

export default CustomCollapse;
