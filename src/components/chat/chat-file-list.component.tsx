import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  UncontrolledDropdown,
} from 'reactstrap';

type ChatFileListProps = {
  fileName: string;
  fileSize?: number;
};

const ChatFileList: React.FC<ChatFileListProps> = ({ fileName, fileSize }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-2 mb-2">
      <Media className="align-items-center">
        <div className="avatar-sm me-3">
          <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
            <i className="ri-file-text-fill"></i>
          </div>
        </div>
        <Media body>
          <div className="text-left">
            <h5 className="font-size-14 mb-1">{fileName}</h5>
            <p className="text-muted font-size-13 mb-0">
              {fileSize || 'file size not calculated'}
            </p>
          </div>
        </Media>

        <div className="ms-4">
          <ul className="list-inline mb-0 font-size-20">
            <li className="list-inline-item">
              <Link to="#" className="text-muted">
                <i className="ri-download-2-line"></i>
              </Link>
            </li>
            <UncontrolledDropdown tag="li" className="list-inline-item">
              <DropdownToggle tag="a" className="dropdown-toggle text-muted">
                <i className="ri-more-fill"></i>
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>
                  {t('Share')}{' '}
                  <i className="ri-share-line float-end text-muted"></i>
                </DropdownItem>
                <DropdownItem>
                  {t('Delete')}{' '}
                  <i className="ri-delete-bin-line float-end text-muted"></i>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </ul>
        </div>
      </Media>
    </Card>
  );
};

export default ChatFileList;
