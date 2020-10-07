import React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Container, Row } from 'reactstrap';

import './non-auth-layout.styles.scss';

const NonAuthLayout: React.FC = ({ children }) => {
  return (
    <>
      <Helmet title="Chatr - Messaging Platform" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {children}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default NonAuthLayout;
