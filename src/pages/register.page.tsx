import React, { memo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import Footer from 'components/auth/footer.component';
import Header from 'components/auth/header.component';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Enter proper email').required('Required'),
  password: Yup.string().min(8, 'Too Short!').max(50, 'Too Long!').required('Required'),
});

const RegisterPage = () => {
  const firebase = useFirebase();
  const history = useHistory();
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string>();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [finishedRegistration, setFinishedRegistration] = useState<boolean>(false);
  // validation
  const { handleChange, handleBlur, handleSubmit, errors, touched, values } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async ({ name, email, password }) => {
      try {
        setFormError(undefined);

        await firebase.createUser(
          { email, password },
          {
            email,
          },
        );

        // firebase set profile settings
        firebase.updateAuth(
          {
            displayName: name,
            photoURL: Gravatar.url(email, {
              protocol: 'https',
              s: '100',
              r: 'pg',
            }),
          },
          true,
        );
        setFinishedRegistration(true);
        history.push('/');
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
                  {formError && (
                    <Alert variant="danger" color="danger">
                      {formError}
                    </Alert>
                  )}
                  {finishedRegistration && (
                    <Alert variant="success">Thank You for registering with us!</Alert>
                  )}
                  <div className="p-3">
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>{t('Name')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <InputGroupAddon addonType="prepend">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-user-2-line"></i>
                            </span>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            invalid={touched.name && errors.name ? true : false}
                          />
                          {touched.name && errors.name ? (
                            <FormFeedback type="invalid">{errors.name}</FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

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

                      <FormGroup className="mb-4">
                        <Label>{t('Password')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <InputGroupAddon addonType="prepend">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-lock-2-line"></i>
                            </span>
                          </InputGroupAddon>
                          <Input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            invalid={touched.password && errors.password ? true : false}
                          />
                          <InputGroupAddon
                            addonType="append"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            <span className="input-group-text border-light text-muted">
                              {passwordVisible ? (
                                <i className="ri-eye-off-line"></i>
                              ) : (
                                <i className="ri-eye-line"></i>
                              )}
                            </span>
                          </InputGroupAddon>
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

export default memo(RegisterPage);
