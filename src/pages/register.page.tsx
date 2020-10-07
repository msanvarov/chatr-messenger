import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Gravatar from 'gravatar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Card,
  CardBody,
  FormGroup,
  Alert,
  Form,
  Input,
  Button,
  FormFeedback,
  Label,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { useFirebase } from 'react-redux-firebase';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import Footer from 'components/auth/footer/footer.component';
import Header from 'components/auth/header/header.component';

const RegisterPage = () => {
  const firebase = useFirebase();
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string>();
  const [finishedRegistration, setFinishedRegistration] = useState<boolean>(false);
  // validation
  const { handleChange, handleBlur, handleSubmit, errors, touched, values } = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Enter proper email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async ({ username, email, password }) => {
      try {
        await firebase.createUser(
          { email, password },
          {
            email,
            username,
          },
        );

        // firebase set profile settings
        firebase.updateAuth(
          {
            displayName: username,
            photoURL: Gravatar.url(email, {
              protocol: 'https',
              s: '100',
              r: 'pg',
            }),
          },
          true,
        );
        setFinishedRegistration(true);
      } catch (error) {
        setFormError((error as Error).message);
      }
    },
  });

  return (
    <>
      <Helmet title="Register | Chatr - Messaging Platform" />

      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header heading={t('Sign up')} subHeading={`${t('Get your Chatr account now')}.`} />

              <Card>
                <CardBody className="p-4">
                  {formError && <Alert color="danger">{formError}</Alert>}
                  {finishedRegistration && (
                    <Alert variant="success">Thank You for registering with us!</Alert>
                  )}
                  <div className="p-3">
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>{t('Email')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <InputGroupAddon addonType="prepend">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-mail-line"></i>
                            </span>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            id="email"
                            name="email"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            invalid={touched.email && errors.email ? true : false}
                          />
                          {touched.email && errors.email ? (
                            <FormFeedback type="invalid">{errors.email}</FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <FormGroup>
                        <Label>{t('Username')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <InputGroupAddon addonType="prepend">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-user-2-line"></i>
                            </span>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter Username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            invalid={touched.username && errors.username ? true : false}
                          />
                          {touched.username && errors.username ? (
                            <FormFeedback type="invalid">{errors.username}</FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <FormGroup className="mb-4">
                        <Label>{t('Password')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <InputGroupAddon addonType="prepend">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-lock-2-line"></i>
                            </span>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            invalid={touched.password && errors.password ? true : false}
                          />
                          {touched.password && errors.password ? (
                            <FormFeedback type="invalid">{errors.password}</FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <div>
                        <Button
                          color="primary"
                          block
                          className=" waves-effect waves-light"
                          type="submit"
                        >
                          Sign up
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-muted mb-0">
                          {t('By registering you agree to the Chatr')}{' '}
                          <Link to="#" className="text-primary">
                            {t('Terms of Use')}
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <Footer text="Already have an account" linkText="Signin" linkTo="/login" />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default RegisterPage;
