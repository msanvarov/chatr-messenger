import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  UncontrolledDropdown,
} from 'reactstrap';

import { useTranslation } from 'react-i18next';

type Group = { name: string; thumbnail: string };

type GroupCardProps = {
  groups: Group[];
};

const GroupCard: React.FC<GroupCardProps> = ({ groups }) => {
  const { t } = useTranslation();
  return (
    <>
      {groups.map((group, key) => (
        <Card key={key} className="p-2 border mb-2">
          <Media className="d-flex align-items-center">
            <div className="avatar-sm me-3 ms-0">
              <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                <i className={group.thumbnail}></i>
              </div>
            </div>
            <Media body className="flex-grow-1 overflow-hidden">
              <div className="text-left">
                <h5 className="font-size-14 mb-1">{group.name}</h5>
              </div>
            </Media>

            <div className="ms-4">
              <ul className="list-inline mb-0 font-size-18">
                <li className="list-inline-item">
                  <Link to="#" className="text-muted px-1">
                    <i className="ri-arrow-drop-right-line"></i>
                  </Link>
                </li>
                <UncontrolledDropdown className="list-inline-item">
                  <DropdownToggle className="text-muted px-1" tag="a">
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem>{t('Action')}</DropdownItem>
                    <DropdownItem>{t('Another Action')}</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>{t('Delete')}</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </ul>
            </div>
          </Media>
        </Card>
      ))}
    </>
  );
};

export default GroupCard;
