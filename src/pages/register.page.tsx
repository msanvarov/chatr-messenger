import { useFormik } from 'formik';
import gravatar from 'gravatar';
import { useState } from 'react';
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
} from 'reactstrap';
import * as Yup from 'yup';

import { Footer, Header } from '../components/auth';
import {
  AppState,
  AuthErrorCodeEnum,
  register,
  useAppDispatch,
  useAppSelector,
} from '../redux';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Enter proper email').required('Required'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { error, loading, isAuthenticated } = useAppSelector(
    (state: AppState) => state.auth
  );

  const { handleChange, handleBlur, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
      },
      validationSchema: RegisterSchema,
      onSubmit: async ({ name, email, password }) => {
        dispatch(
          register({
            email,
            password,
            name,
            picture: gravatar.url(email, {
              protocol: 'https',
              s: '100',
              r: 'pg',
            }),
          })
        );
      },
    });

  if (!error && !loading && isAuthenticated) {
    navigate('/');
  }

  return (
    <>
      <Helmet title="Register" />
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Header
                heading={t('Sign up')}
                subheading={`${t('Get your Chatr account now')}.`}
              />

              <Card>
                <CardBody className="p-4">
                  {!loading &&
                    error?.code === AuthErrorCodeEnum.REGISTER_FAILED && (
                      <Alert variant="danger" color="danger">
                        {error.message}
                      </Alert>
                    )}
                  <div className="p-3">
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label>{t('Name')}</Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                          <span className="input-group-text border-light text-muted">
                            <i className="ri-user-2-line"></i>
                          </span>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control bg-soft-light border-light"
                            placeholder="Enter name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            invalid={!!touched.name && !!errors.name}
                          />
                          {touched.name && errors.name ? (
                            <FormFeedback type="invalid">
                              {errors.name}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <FormGroup>
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
                            <FormFeedback type="invalid">
                              {errors.email}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>

                      <FormGroup className="mb-4">
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

                      <div className="d-grid">
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

              <Footer
                text="Already have an account?"
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

export default RegisterPage;
