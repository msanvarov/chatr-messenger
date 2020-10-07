import React, { useState } from 'react';
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
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFirebase } from 'react-redux-firebase';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LogoDarkPNG from 'assets/logo-dark.png';
import LogoLightPNG from 'assets/logo-light.png';
import Footer from 'components/non-auth-layout/footer/footer.component';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
});

const LoginPage = () => {
  const firebase = useFirebase();
  const { t } = useTranslation();
  const [formErrors, setFormErrors] = useState<string>();
  const { handleChange, handleBlur, handleSubmit, errors, touched, values } = useFormik({
    validationSchema: LoginSchema,
    initialValues: { email: '', password: '' },
    onSubmit: async ({ email, password }) => {
      try {
        // login
        const { user } = await firebase.login({ email, password });
        if (!user?.emailVerified) {
          setFormErrors(
            'Please verify your account by clicking the Hopin registration link in the email',
          );
        }
      } catch (error) {
        setFormErrors((error as Error).message);
      }
    },
  });
  return (
    <>
      <Helmet title="Login" />

      <div className="text-center mb-4">
        <Link to="/" className="auth-logo mb-5 d-block">
          <img src={LogoDarkPNG} alt="dark logo" height="120" className="logo logo-dark" />
          <img src={LogoLightPNG} alt="light logo" height="120" className="logo logo-light" />
        </Link>

        <h4>{t('Sign in')}</h4>
        <p className="text-muted mb-4">{t('Sign in to continue to Chatr.')}</p>
      </div>

      <Card>
        <CardBody className="p-4">
          {formErrors && <Alert color="danger">{formErrors}</Alert>}
          <div className="p-3">
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>{t('Email')}</Label>
                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                  <InputGroupAddon addonType="prepend">
                    <span className="input-group-text border-light text-muted">
                      <i className="ri-user-2-line"></i>
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
                <div className="float-right">
                  <Link to="forget-password" className="text-muted font-size-13">
                    {t('Forgot password')}?
                  </Link>
                </div>
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

              <div className="custom-control custom-checkbox mb-4">
                <Input type="checkbox" className="custom-control-input" id="remember-check" />
                <Label className="custom-control-label" htmlFor="remember-check">
                  {t('Remember me')}
                </Label>
              </div>

              <div>
                <Button color="primary" block className=" waves-effect waves-light" type="submit">
                  {t('Sign in')}
                </Button>
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>

      <Footer text="Don't have an account" linkText="Signup now" linkTo="/register" />
    </>
  );
};

export default LoginPage;
