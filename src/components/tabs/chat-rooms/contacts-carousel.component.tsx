import _ from 'lodash';
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

import 'react-alice-carousel/lib/alice-carousel.css';
import { UncontrolledTooltip } from 'reactstrap';
import { useContacts } from '../../../hooks';

const responsive = {
  0: { items: 4 },
  1024: { items: 4 },
};

type ContactsCarouselProps = {
  uid: string;
};

const ContactsCarousel: React.FC<ContactsCarouselProps> = ({ uid }) => {
  const users = useContacts(uid, 100);

  return (
    <div className="px-4 pb-4" dir="ltr">
      <AliceCarousel
        responsive={responsive}
        disableButtonsControls
        disableDotsControls
        mouseTracking
        autoPlay
      >
        {users &&
          _.map(users, (user, i) => (
            <div className="item" key={i} id={`name${i}`}>
              <Link to={user.uid} className="user-status-box">
                <div className="avatar-xs mx-auto d-block chat-user-img online">
                  <img
                    src={user.photoURL ?? 'https://via.placeholder.com/100'}
                    alt="user-img"
                    className="img-fluid rounded-circle"
                  />
                  <span className="user-status"></span>
                </div>
                <h5 className="font-size-13 text-truncate mt-3 mb-1">
                  {user.displayName}
                </h5>
                <UncontrolledTooltip target={`name${i}`} placement="bottom">
                  {user.displayName}
                </UncontrolledTooltip>
              </Link>
            </div>
          ))}
      </AliceCarousel>
    </div>
  );
};

export default ContactsCarousel;
