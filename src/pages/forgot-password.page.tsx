import React, { memo, useState } from 'react';
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
import Header from 'components/auth/header/header.component';
import { useFirebase } from 'react-redux-firebase';
import Footer from 'components/auth/footer/footer.component';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPasswordPage = () => {
  const [formError, setFormError] = useState<string>();
  const [passwordReset, setPasswordReset] = useState<boolean>(false);
  const firebase = useFirebase();
  const { t } = useTranslation();
  const { handleChange, handleBlur, handleSubmit, errors, touched, values, resetForm } = useFormik({
    validationSchema: ForgotPasswordSchema,
    initialValues: { email: '' },
    onSubmit: async ({ email }) => {
      try {
        await firebase.resetPassword(email);
        setPasswordReset(true);
        resetForm();
      } catch (error) {
        setFormError(error);
      }
    },
  });
  return (
    <>
      <Helmet title="Forgot Password | Chatr - Messaging Platform" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header heading={t('Reset Password')} subHeading={t('Reset Password With Chatr.')} />
              <Card>
                <CardBody className="p-4">
                  <div className="p-3">
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    {passwordReset && (
                      <Alert variant="success" className="text-center mb-4">
                        {t('Password reset email has been successfully sent.')}
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
                            invalid={touched.email && errors.email ? true : false}
                          />
                          {touched.email && errors.email ? (
                            <FormFeedback type="invalid">{errors.email}</FormFeedback>
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

              <Footer text="Remember password" linkText="Signin" linkTo="/login" />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default memo(ForgotPasswordPage);
