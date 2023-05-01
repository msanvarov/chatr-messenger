import _ from 'lodash';
import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

import 'react-alice-carousel/lib/alice-carousel.css';

const responsive = {
  0: { items: 4 },
  1024: { items: 4 },
};

type ContactsCarouselProps = {
  uid: string;
};

const ContactsCarousel: React.FC<ContactsCarouselProps> = ({ uid }) => {
  // TODO move business logic to redux
  const [users, setUsers] = useState<
    { uid: string; displayName: string; photoURL: string }[]
  >([
    {
      uid: '1',
      displayName: 'John Doe',
      photoURL: 'https://i.pravatar.cc/200?u=1',
    },
    {
      uid: '2',
      displayName: 'Jane Doe',
      photoURL: 'https://i.pravatar.cc/200?u=1',
    },
  ]);

  return (
    <div className="px-4 pb-4" dir="ltr">
      <AliceCarousel
        responsive={responsive}
        disableButtonsControls
        disableDotsControls
        mouseTracking
      >
        {users &&
          _.map(
            _.filter(users, (user) => user.uid !== uid),
            (user, i) => (
              <div className="item" key={i}>
                <Link to={user.uid} className="user-status-box">
                  <div className="avatar-xs mx-auto d-block chat-user-img online">
                    <img
                      src={user.photoURL}
                      alt="user-img"
                      className="img-fluid rounded-circle"
                    />
                    <span className="user-status"></span>
                  </div>

                  <h5 className="font-size-13 text-truncate mt-3 mb-1">
                    {user.displayName}
                  </h5>
                </Link>
              </div>
            )
          )}
      </AliceCarousel>
    </div>
  );
};

export default ContactsCarousel;
