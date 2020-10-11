import React, { memo, useState } from 'react';
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
import globalFirebase from 'firebase';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFirebase } from 'react-redux-firebase';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Footer from 'components/auth/footer.component';
import Header from 'components/auth/header.component';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too Short!').max(50, 'Too Long!').required('Required'),
});

const LoginPage = () => {
  const firebase = useFirebase();
  const history = useHistory();
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string>();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    setFieldValue,
  } = useFormik({
    validationSchema: LoginSchema,
    initialValues: { email: '', password: '', remember: true },
    onSubmit: async ({ email, password, remember }) => {
      try {
        // checkbox persistance preference
        if (remember) {
          await firebase.auth().setPersistence(globalFirebase.auth.Auth.Persistence.LOCAL);
        } else {
          await firebase.auth().setPersistence(globalFirebase.auth.Auth.Persistence.SESSION);
        }
        // login
        const { user } = await firebase.login({ email, password });
        if (!user?.emailVerified) {
          setFormError(
            'Please verify your account by clicking the Chatr registration link in the email',
          );
        }
        history.push('/dashboard');
      } catch (error) {
        setFormError((error as Error).message);
      }
    },
  });
  const loginWithGoogle = async () => {
    try {
      await firebase.login({ provider: 'google', type: 'popup' });
      history.push('/dashboard');
    } catch (error) {
      setFormError((error as Error).message);
    }
  };

  return (
    <>
      <Helmet title="Login | Chatr - Messaging Platform" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header heading={t('Sign in')} subHeading={t('Sign in to continue to Chatr.')} />

              <Card>
                <CardBody className="p-4">
                  {formError && <Alert color="danger">{formError}</Alert>}
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
                          <Link to="/forgot-password" className="text-muted font-size-13">
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

                      <div className="custom-control custom-checkbox mb-4">
                        <Input
                          type="checkbox"
                          checked={values.remember}
                          onChange={() => setFieldValue('remember', !values.remember)}
                          className="custom-control-input"
                          id="remember-check"
                        />
                        <Label className="custom-control-label" htmlFor="remember-check">
                          {t('Remember me')}
                        </Label>
                      </div>

                      <div>
                        <Button
                          color="primary"
                          block
                          className="waves-effect waves-light"
                          type="submit"
                        >
                          {t('Sign in')}
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-2">
                      <Button
                        outline
                        onClick={loginWithGoogle}
                        block
                        color="secondary"
                        className="waves-effect waves-light"
                        type="submit"
                      >
                        {t('Sign in with Google')}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Footer text="Don't have an account" linkText="Signup now" linkTo="/register" />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default memo(LoginPage);
