import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import * as Yup from 'yup';

import { Footer, Header } from '../components/auth';
import {
  AppState,
  AuthErrorCodeEnum,
  login,
  useAppDispatch,
  useAppSelector,
} from '../redux';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { isAuthenticated, loading, error } = useAppSelector(
    (state: AppState) => state.auth
  );

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
    initialValues: { email: '', password: '', persistLogin: true },
    onSubmit: async ({ email, password, persistLogin }) => {
      dispatch(login({ email, password, persistLogin }));
    },
  });

  if (!error && !loading && isAuthenticated) {
    navigate('/');
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header
                heading={t('Login')}
                subheading={t('Login to continue to Chatr.')}
              />

              <Card>
                <CardBody className="p-4">
                  {!loading &&
                    error?.code === AuthErrorCodeEnum.LOGIN_FAILED && (
                      <Alert variant="danger" color="danger">
                        {error.message}
                      </Alert>
                    )}
                  <div className="p-3">
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>{t('Email')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <span className="input-group-text border-light text-muted">
                            <i className="ri-user-2-line"></i>
                          </span>

                          <Input
                            type="text"
                            id="email"
                            name="email"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            invalid={!!touched.email && !!errors.email}
                          />
                          {touched.email && errors.email ? (
                            <FormFeedback type="invalid">
                              {errors.email}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <FormGroup className="mb-4">
                        <div className="float-end">
                          <Link
                            to="/auth/forgot-password"
                            className="text-muted font-size-13"
                          >
                            {t('Forgot password')}?
                          </Link>
                        </div>
                        <Label>{t('Password')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <span className="input-group-text border-light text-muted">
                            <i className="ri-lock-2-line"></i>
                          </span>

                          <Input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            name="password"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            invalid={!!touched.password && !!errors.password}
                          />
                          <span
                            className="input-group-text border-light text-muted"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? (
                              <i className="ri-eye-off-line"></i>
                            ) : (
                              <i className="ri-eye-line"></i>
                            )}
                          </span>

                          {touched.password && errors.password ? (
                            <FormFeedback type="invalid">
                              {errors.password}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <div className="form-check mb-4">
                        <Input
                          type="checkbox"
                          checked={values.persistLogin}
                          onChange={() =>
                            setFieldValue('persistLogin', !values.persistLogin)
                          }
                          className="form-check-input"
                          id="persistLogin-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="persistLogin-check"
                        >
                          {t('Persist Login')}
                        </Label>
                      </div>
                      <div className="d-grid">
                        <Button
                          color="primary"
                          block
                          className="waves-effect waves-light"
                          type="submit"
                        >
                          {loading ? (
                            <Spinner size="sm" type="grow" color="dark" />
                          ) : (
                            t('Login')
                          )}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <Footer
                text="Don't have an account?"
                linkText="Register"
                link="/auth/register"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoginPage;
