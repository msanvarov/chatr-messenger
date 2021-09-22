import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
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

import {
  AppState,
  login,
  resetErrorState,
  useAppDispatch,
  useAppSelector,
} from '@chatr/redux';
import { AuthFooter, AuthHeader } from '@chatr/ui';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const LoginPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { isAuthenticated, loading, error } = useAppSelector(
    (state: AppState) => state.auth
  );

  useEffect(() => {
    // clear the error state from previous render
    if (error) {
      dispatch(resetErrorState());
    }
  }, []);

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
    initialValues: { email: '', password: '', keepLoggedOn: true },
    onSubmit: async ({ email, password, keepLoggedOn }) => {
      dispatch(login({ email, password, keepLoggedOn }));
    },
  });

  if (!error && !loading && isAuthenticated) {
    history.push('/');
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <AuthHeader
                heading={t('Sign in')}
                subheading={t('Sign in to continue to Chatr.')}
              />

              <Card>
                <CardBody className="p-4">
                  {!loading && error && (
                    <Alert variant="danger" color="danger">
                      {error}
                    </Alert>
                  )}
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
                        <div className="float-right">
                          <Link
                            to="/auth/forgot-password"
                            className="text-muted font-size-13"
                          >
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
                            invalid={!!touched.password && !!errors.password}
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
                            <FormFeedback type="invalid">
                              {errors.password}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <div className="custom-control custom-checkbox mb-4">
                        <Input
                          type="checkbox"
                          checked={values.keepLoggedOn}
                          onChange={() =>
                            setFieldValue('keepLoggedOn', !values.keepLoggedOn)
                          }
                          className="custom-control-input"
                          id="keepLoggedOn-check"
                        />
                        <Label
                          className="custom-control-label"
                          htmlFor="keepLoggedOn-check"
                        >
                          {t('Stay signed in for longer')}
                        </Label>
                      </div>

                      <Button
                        color="primary"
                        block
                        className="waves-effect waves-light"
                        type="submit"
                      >
                        {t('Sign in')}
                      </Button>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <AuthFooter
                text="Don't have an account"
                linkText="Signup now"
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
