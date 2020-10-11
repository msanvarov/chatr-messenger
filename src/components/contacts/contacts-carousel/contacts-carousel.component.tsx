import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';

const responsive = {
  0: { items: 4 },
  1024: { items: 4 },
};

const ContactsCarousel = () => {
  return (
    <div className="px-4 pb-4" dir="ltr">
      <AliceCarousel
        responsive={responsive}
        disableButtonsControls
        disableDotsControls
        mouseTracking
      >
        <div className="item">
          <Link to="#" className="user-status-box">
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <img
                src="https://via.placeholder.com/100"
                alt="user-img"
                className="img-fluid rounded-circle"
              />
              <span className="user-status"></span>
            </div>

            <h5 className="font-size-13 text-truncate mt-3 mb-1">Patrick</h5>
          </Link>
        </div>
        <div className="item">
          <Link to="#" className="user-status-box">
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <img
                src="https://via.placeholder.com/100"
                alt="user-img"
                className="img-fluid rounded-circle"
              />
              <span className="user-status"></span>
            </div>

            <h5 className="font-size-13 text-truncate mt-3 mb-1">Doris</h5>
          </Link>
        </div>

        <div className="item">
          <Link to="#" className="user-status-box">
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <img
                src="https://via.placeholder.com/100"
                alt="user-img"
                className="img-fluid rounded-circle"
              />
              <span className="user-status"></span>
            </div>

            <h5 className="font-size-13 text-truncate mt-3 mb-1">Emily</h5>
          </Link>
        </div>

        <div className="item">
          <Link to="#" className="user-status-box">
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <span className="avatar-title rounded-circle bg-soft-primary text-primary">S</span>
              <span className="user-status"></span>
            </div>

            <h5 className="font-size-13 text-truncate mt-3 mb-1">Steve</h5>
          </Link>
        </div>

        <div className="item">
          <Link to="#" className="user-status-box">
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <span className="avatar-title rounded-circle bg-soft-primary text-primary">T</span>
              <span className="user-status"></span>
            </div>

            <h5 className="font-size-13 text-truncate mt-3 mb-1">Teresa</h5>
          </Link>
        </div>
      </AliceCarousel>
    </div>
  );
};

export default ContactsCarousel;
