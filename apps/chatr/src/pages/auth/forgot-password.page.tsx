import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Container,
  Row,
  Col,
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

import { AuthFooter, AuthHeader } from '@chatr/ui';
import {
  AppState,
  forgotPassword,
  resetErrorState,
  useAppDispatch,
  useAppSelector,
} from '@chatr/redux';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { loading, error } = useAppSelector((state: AppState) => state.auth);
  const [passwordResetPrompt, setPasswordResetPrompt] =
    useState<boolean>(false);

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
              <AuthHeader
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
                        {t('Password reset email has been sent.')}
                      </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                      <FormGroup className="mb-4">
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
                            invalid={!!touched.email && !!errors.email}
                          />
                          {touched.email && errors.email ? (
                            <FormFeedback type="invalid">
                              {errors.email}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <div>
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

              <AuthFooter
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
