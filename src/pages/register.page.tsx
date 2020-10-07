import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import LogoDarkPNG from 'assets/logo-dark.png';
import LogoLightPNG from 'assets/logo-light.png';
import { Helmet } from 'react-helmet';
import Footer from 'components/non-auth-layout/footer/footer.component';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formError] = useState<string>();
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
    onSubmit: ({ username, email, password }) => {
      console.log(username, email, password);
    },
  });

  return (
    <>
      <Helmet title="Register" />

      <div className="text-center mb-4">
        <Link to="/" className="auth-logo mb-5 d-block">
          <img src={LogoDarkPNG} alt="dark logo" height="120" className="logo logo-dark" />
          <img src={LogoLightPNG} alt="light logo" height="120" className="logo logo-light" />
        </Link>

        <h4>{t('Sign up')}</h4>
        <p className="text-muted mb-4">{t('Get your Chatr account now')}.</p>
      </div>

      <Card>
        <CardBody className="p-4">
          {formError && <Alert color="danger">{formError}</Alert>}
          {false && <Alert variant="success">Thank You for registering with us!</Alert>}
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
                <Button color="primary" block className=" waves-effect waves-light" type="submit">
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
    </>
  );
};

export default RegisterPage;
