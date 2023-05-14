import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  Input,
  Label,
  Media,
  UncontrolledDropdown,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';
import * as Yup from 'yup';

import {
  IUserState,
  patchUserMetadata,
  setUserMetadata,
  useAppDispatch,
} from '../../../redux';
import { CustomCollapse } from '../custom-collapse.component';

// TODO implment precense via firebase using this guide https://firebase.google.com/docs/firestore/solutions/presence

const ProfileEditSchema = Yup.object().shape({
  name: Yup.string().min(2).required('Required'),
  bio: Yup.string().min(2).max(255),
  location: Yup.string().required('Required'),
});

type SettingsTabProps = { user: IUserState };

const SettingsTab = ({ user }: SettingsTabProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const [showCollapsibleProfileEditor, setShowCollapsibleProfileEditor] =
    useState<boolean>(true);
  const [showCollapsiblePrivacySettings, setShowCollapsiblePrivacySettings] =
    useState<boolean>(false);
  const [showCollapsibleSecuritySettings, setShowCollapsibleSecuritySettings] =
    useState<boolean>(false);
  const [showCollapsibleHelp, setShowCollapsibleHelp] =
    useState<boolean>(false);
  const [showProfileStatusDropdown, setShowProfileStatusDropdown] =
    useState<boolean>(false);
  const [showProfileUpdateAlert, setShowProfileUpdateAlert] =
    useState<boolean>(false);

  useEffect(() => {
    setValues({
      name: user.displayName ?? '',
      bio: user.bio ?? '',
      location: user.location ?? '',
    });
  }, [user]);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    setValues,
    resetForm,
  } = useFormik({
    validationSchema: ProfileEditSchema,
    initialValues: {
      name: user.displayName ?? '',
      location: user.location ?? '',
      bio: user.bio ?? '',
    },
    onSubmit: async ({ name, location, bio }) => {
      // TODO use react-places-autocomplete for location changing

      if (user.uid) {
        const userMetadataPayload = {
          uid: user.uid,
          displayName: name,
          location,
          bio,
        };

        await patchUserMetadata(user.uid, userMetadataPayload);

        dispatch(setUserMetadata(userMetadataPayload));

        resetForm({
          values: {
            name,
            location,
            bio,
          },
        });
        setShowProfileUpdateAlert(true);
      }
    },
  });

  useEffect(() => {
    if (touched.bio || touched.name || touched.location) {
      setShowProfileUpdateAlert(false);
    }
  }, [touched]);

  const toggleProfileEditorCollapsible = () => {
    setShowCollapsibleProfileEditor(!showCollapsibleProfileEditor);
    setShowCollapsiblePrivacySettings(false);
    setShowCollapsibleSecuritySettings(false);
    setShowCollapsibleHelp(false);
  };

  const togglePrivacyEditorCollapsible = () => {
    setShowCollapsiblePrivacySettings(!showCollapsiblePrivacySettings);
    setShowCollapsibleProfileEditor(false);
    setShowCollapsibleSecuritySettings(false);
    setShowCollapsibleHelp(false);
  };

  const toggleSecurityEditorCollapsible = () => {
    setShowCollapsibleSecuritySettings(!showCollapsibleSecuritySettings);
    setShowCollapsibleProfileEditor(false);
    setShowCollapsiblePrivacySettings(false);
    setShowCollapsibleHelp(false);
  };

  const toggleHelpCollapsible = () => {
    setShowCollapsibleHelp(!showCollapsibleHelp);
    setShowCollapsibleProfileEditor(false);
    setShowCollapsibleSecuritySettings(false);
    setShowCollapsiblePrivacySettings(false);
  };

  const toggle = () => setShowProfileStatusDropdown(!showProfileStatusDropdown);

  const onFileSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      console.log(event.currentTarget.files);
    }
  };

  const updateProfileStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.textContent);
  };

  return (
    <>
      <div className="px-4 pt-4">
        <h4 className="mb-0">{t('Settings')}</h4>
      </div>

      <div className="text-center border-bottom p-4">
        <div className="mb-4 profile-user">
          <img
            src={user.photoURL || 'https://via.placeholder.com/200'}
            alt="profile"
            className="rounded-circle avatar-lg img-thumbnail"
          />

          <input
            id="file"
            ref={fileInputRef}
            name="file"
            type="file"
            className="d-none"
            accept="image/x-png,image/jpeg"
            onChange={onFileSubmit}
          />
          <Button
            type="button"
            color="light"
            className="avatar-xs p-0 rounded-circle profile-photo-edit"
            onClick={() => fileInputRef.current.click()}
          >
            <i className="ri-pencil-fill"></i>
          </Button>
        </div>

        <h5 className="font-size-16 mb-1 text-truncate">
          {t(user.displayName ?? 'Display name not found')}
        </h5>
        <Dropdown
          isOpen={showProfileStatusDropdown}
          toggle={toggle}
          className="d-inline-block mb-1"
        >
          <DropdownToggle tag="a" className="text-muted pb-1 d-block">
            {t('Status not set')} <i className="mdi mdi-chevron-down"></i>
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem onClick={updateProfileStatus}>
              {t('Online')}
            </DropdownItem>
            <DropdownItem onClick={updateProfileStatus}>
              {t('Busy')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <SimpleBar
        style={{ maxHeight: '100%' }}
        className="p-4 user-profile-desc"
      >
        <div id="profile-setting-accordion" className="custom-accordion">
          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Personal Data"
              isOpen={showCollapsibleProfileEditor}
              toggleCollapse={toggleProfileEditorCollapsible}
            >
              {showProfileUpdateAlert && <Alert>Updated Profile</Alert>}
              <Form onSubmit={handleSubmit}>
                {!user.loading && user.error && (
                  <Alert color="danger">{user.error}</Alert>
                )}
                <div className="float-end">
                  <Button
                    color="light"
                    size="sm"
                    type="submit"
                    disabled={
                      !touched.name && !touched.bio && !touched.location
                    }
                  >
                    <i className="ri-edit-fill me-1 align-middle"></i>{' '}
                    {t('Confirm')}
                  </Button>
                </div>
                <div>
                  <p className="text-muted mb-1">{t('Name')}</p>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-4 form-control bg-soft-light border-light"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    invalid={!!touched.name && !!errors.name}
                  />
                  {touched.name && errors.name ? (
                    <FormFeedback type="invalid">{errors.name}</FormFeedback>
                  ) : null}
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t('Bio')}</p>
                  <Input
                    type="textarea"
                    id="bio"
                    name="bio"
                    className="mt-4 form-control bg-soft-light border-light"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bio}
                    invalid={!!touched.bio && !!errors.bio}
                  />
                  {touched.bio && errors.bio ? (
                    <FormFeedback type="invalid">{errors.bio}</FormFeedback>
                  ) : null}
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t('Location')}</p>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    className="mt-4 form-control bg-soft-light border-light"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.location}
                    invalid={!!touched.location && !!errors.location}
                  />
                  {touched.location && errors.location ? (
                    <FormFeedback type="invalid">
                      {errors.location}
                    </FormFeedback>
                  ) : null}
                </div>
              </Form>
            </CustomCollapse>
          </Card>

          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Privacy"
              isOpen={showCollapsiblePrivacySettings}
              toggleCollapse={togglePrivacyEditorCollapsible}
            >
              <div className="py-3">
                <Media className="d-flex align-items-center">
                  <Media body className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Profile photo')}
                    </h5>
                  </Media>
                  <UncontrolledDropdown className="ms-2">
                    <DropdownToggle
                      className="btn btn-light btn-sm w-sm"
                      tag="button"
                    >
                      {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem>{t('Everyone')}</DropdownItem>
                      <DropdownItem>{t('Nobody')}</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Media>
              </div>
              <div className="py-3 border-top">
                <Media className="d-flex align-items-center">
                  <Media body className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Last seen')}
                    </h5>
                  </Media>
                  <div className="ms-2">
                    <div className="form-check form-switch">
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="privacy-lastseenSwitch"
                        defaultChecked
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="privacy-lastseenSwitch"
                      ></Label>
                    </div>
                  </div>
                </Media>
              </div>

              <div className="py-3 border-top">
                <Media className="d-flex align-items-center">
                  <Media body className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Status')}
                    </h5>
                  </Media>
                  <UncontrolledDropdown className="ms-2">
                    <DropdownToggle
                      className="btn btn-light btn-sm w-sm"
                      tag="button"
                    >
                      {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem>{t('Everyone')}</DropdownItem>
                      <DropdownItem>{t('Nobody')}</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Media>
              </div>

              <div className="py-3 border-top">
                <Media className="d-flex align-items-center">
                  <Media body className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Read receipts')}
                    </h5>
                  </Media>
                  <div className="ms-2">
                    <div className="form-check form-switch">
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="privacy-readreceiptSwitch"
                        defaultChecked
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="privacy-readreceiptSwitch"
                      ></Label>
                    </div>
                  </div>
                </Media>
              </div>

              <div className="py-3 border-top">
                <Media className="d-flex align-items-center">
                  <Media body className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Groups')}
                    </h5>
                  </Media>
                  <UncontrolledDropdown className="ms-2">
                    <DropdownToggle
                      className="btn btn-light btn-sm w-sm"
                      tag="button"
                    >
                      {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem>{t('Everyone')}</DropdownItem>
                      <DropdownItem>{t('Nobody')}</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Media>
              </div>
            </CustomCollapse>
          </Card>

          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Security"
              isOpen={showCollapsibleSecuritySettings}
              toggleCollapse={toggleSecurityEditorCollapsible}
            >
              <div>
                <Media className="d-flex align-items-center">
                  <Media body className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Show security notification')}
                    </h5>
                  </Media>
                  <div className="ms-2 me-0">
                    <div className="form-check form-switch">
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="security-notificationswitch"
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="security-notificationswitch"
                      ></Label>
                    </div>
                  </div>
                </Media>
              </div>
            </CustomCollapse>
          </Card>

          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Help"
              isOpen={showCollapsibleHelp}
              toggleCollapse={toggleHelpCollapsible}
            >
              <div>
                <div className="py-3">
                  <h5 className="font-size-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {t('FAQs')}
                    </Link>
                  </h5>
                </div>
                <div className="py-3 border-top">
                  <h5 className="font-size-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {t('Contact')}
                    </Link>
                  </h5>
                </div>
                <div className="py-3 border-top">
                  <h5 className="font-size-13 mb-0">
                    <Link to="#" className="text-body d-block">
                      {t('Terms & Privacy policy')}
                    </Link>
                  </h5>
                </div>
              </div>
            </CustomCollapse>
          </Card>
        </div>
      </SimpleBar>
    </>
  );
};

export default SettingsTab;
