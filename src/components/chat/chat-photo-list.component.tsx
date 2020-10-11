import React, { useState } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

type Photo = { source: string; title: string };

type ChatPhotoListProps = {
  photos: Photo[];
};

const ChatPhotoList: React.FC<ChatPhotoListProps> = ({ photos }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo>();
  const toggleLightbox = (photo: Photo) => {
    setIsOpen(!isOpen);
    setCurrentPhoto(photo);
  };
  return (
    <>
      <ul className="list-inline message-img  mb-0">
        {photos.map((photo, key) => (
          <li key={key} className="list-inline-item message-img-list">
            <div>
              <Link
                to="#"
                onClick={() => toggleLightbox(photo)}
                className="popup-img d-inline-block m-1"
                title="Project 1"
              >
                <img src={photo.source} alt="attachment" className="rounded border" />
              </Link>
            </div>
            <div className="message-img-link">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Link to="#">
                    <i className="ri-download-2-line"></i>
                  </Link>
                </li>
                <UncontrolledDropdown tag="li" className="list-inline-item">
                  <DropdownToggle tag="a">
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      {t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      {t('Save')} <i className="ri-save-line float-right text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      {t('Forward')} <i className="ri-chat-forward-line float-right text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      {t('Delete')} <i className="ri-delete-bin-line float-right text-muted"></i>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </ul>
            </div>
          </li>
        ))}

        {isOpen && currentPhoto && (
          <Lightbox
            mainSrc={currentPhoto.source}
            onCloseRequest={() => setIsOpen(false)}
            imageTitle={currentPhoto.title}
          />
        )}
      </ul>
    </>
  );
};

export default ChatPhotoList;
