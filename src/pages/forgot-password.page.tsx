import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
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
} from 'reactstrap';
import * as Yup from 'yup';

import { Footer, Header } from '../components/auth';
import {
  AppState,
  forgotPassword,
  useAppDispatch,
  useAppSelector,
} from '../redux';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email format not correct')
    .required('Please provide an email address'),
});

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { loading, error } = useAppSelector((state: AppState) => state.auth);
  const [passwordResetPrompt, setPasswordResetPrompt] =
    useState<boolean>(false);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    resetForm,
  } = useFormik({
    validationSchema: ForgotPasswordSchema,
    initialValues: { email: '' },
    onSubmit: async ({ email }) => {
      dispatch(forgotPassword(email));
      setPasswordResetPrompt(true);
      resetForm();
    },
  });
  return (
    <>
      <Helmet title="Forgot Password" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header
                heading={t('Reset Password')}
                subheading={t('Reset Password With Chatr.')}
              />
              <Card>
                <CardBody className="p-4">
                  <div className="p-3">
                    {!loading && error && (
                      <Alert variant="danger" color="danger">
                        {error}
                      </Alert>
                    )}
                    {passwordResetPrompt && (
                      <Alert variant="success" className="text-center mb-4">
                        {t(
                          'If a email address provided is associated with an account, a password reset email will be sent.'
                        )}
                      </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                      <FormGroup className="mb-4">
                        <Label>{t('Email')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <span className="input-group-text border-light text-muted">
                            <i className="ri-mail-line"></i>
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
                            <FormFeedback type="invalid ">
                              {errors.email}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <div className="d-grid">
                        <Button
                          color="primary"
                          block
                          className="waves-effect waves-light"
                          type="submit"
                        >
                          {t('Reset')}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <Footer
                text="Remember password"
                linkText="Signin"
                link="/auth/login"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
