// tslint:disable: no-console
import React, { useRef, useState } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
  Media,
  Button,
  UncontrolledDropdown,
  Input,
  Label,
  Form,
  FormFeedback,
  Alert,
} from 'reactstrap';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';
import CustomCollapse from 'components/collapse/custom-collapse.component';
import { FirebaseReducer, useFirebase } from 'react-redux-firebase';
import { IApplicationState, IProfile } from 'store';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';

type SettingsTabProps = {
  profile: FirebaseReducer.Profile<IProfile>;
};

const ProfileEditSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
});

const SettingsTab: React.FC<SettingsTabProps> = ({ profile }) => {
  const firebase = useFirebase();
  const uploadedFiles = useSelector(({ firebase: { data } }: IApplicationState) => data);
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const [showCollapsibleProfileEditor, setShowCollapsibleProfileEditor] = useState<boolean>(true);
  const [showCollapsiblePrivacySettings, setShowCollapsiblePrivacySettings] = useState<boolean>(
    false,
  );
  const [showCollapsibleSecuritySettings, setShowCollapsibleSecuritySettings] = useState<boolean>(
    false,
  );
  const [showCollapsibleHelp, setShowCollapsibleHelp] = useState<boolean>(false);
  const [showProfileStatusDropdown, setShowProfileStatusDropdown] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string>();
  const { handleChange, handleBlur, handleSubmit, errors, touched, values } = useFormik({
    validationSchema: ProfileEditSchema,
    initialValues: { name: profile.displayName, location: profile.location || '' },
    onSubmit: async ({ name, location }, actions) => {
      try {
        firebase.updateProfile({ displayName: name, location });

        actions.resetForm({
          values: {
            name,
            location,
          },
        });
      } catch (error) {
        setFormErrors((error as Error).message);
      }
    },
  });
  const updateProfileStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.textContent);
    return firebase.updateProfile({ status: event.currentTarget.textContent });
  };

  const onFileSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(uploadedFiles);
    if (event.currentTarget.files) {
      // TODO fix not writing to firestore on upload
      const uploadTaskSnap = await firebase.uploadFile(
        `photos/profile/${firebase.auth().currentUser?.uid}`,
        event.currentTarget.files[0],
      );
      console.log('uploadTaskSnapshot', uploadTaskSnap);
    }
  };

  const toggleCollapse1 = () => {
    setShowCollapsibleProfileEditor(!showCollapsibleProfileEditor);
    setShowCollapsiblePrivacySettings(false);
    setShowCollapsibleSecuritySettings(false);
    setShowCollapsibleHelp(false);
  };

  const toggleCollapse2 = () => {
    setShowCollapsiblePrivacySettings(!showCollapsiblePrivacySettings);
    setShowCollapsibleProfileEditor(false);
    setShowCollapsibleSecuritySettings(false);
    setShowCollapsibleHelp(false);
  };

  const toggleCollapse3 = () => {
    setShowCollapsibleSecuritySettings(!showCollapsibleSecuritySettings);
    setShowCollapsibleProfileEditor(false);
    setShowCollapsiblePrivacySettings(false);
    setShowCollapsibleHelp(false);
  };

  const toggleCollapse4 = () => {
    setShowCollapsibleHelp(!showCollapsibleHelp);
    setShowCollapsibleProfileEditor(false);
    setShowCollapsibleSecuritySettings(false);
    setShowCollapsiblePrivacySettings(false);
  };

  const toggle = () => setShowProfileStatusDropdown(!showProfileStatusDropdown);
  return (
    <>
      <div className="px-4 pt-4">
        <h4 className="mb-0">{t('Settings')}</h4>
      </div>

      <div className="text-center border-bottom p-4">
        <div className="mb-4 profile-user">
          <img
            src={profile.photoURL}
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

        <h5 className="font-size-16 mb-1 text-truncate">{t(profile.displayName)}</h5>
        <Dropdown
          isOpen={showProfileStatusDropdown}
          toggle={toggle}
          className="d-inline-block mb-1"
        >
          <DropdownToggle tag="a" className="text-muted pb-1 d-block">
            {t(profile.status || 'Status not set')} <i className="mdi mdi-chevron-down"></i>
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem onClick={updateProfileStatus}>{t('Online')}</DropdownItem>
            <DropdownItem onClick={updateProfileStatus}>{t('Busy')}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <SimpleBar style={{ maxHeight: '100%' }} className="p-4 user-profile-desc">
        <div id="profile-setting-accordion" className="custom-accordion">
          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Personal Data"
              isOpen={showCollapsibleProfileEditor}
              toggleCollapse={toggleCollapse1}
            >
              <Form onSubmit={handleSubmit}>
                {formErrors && <Alert color="danger">{formErrors}</Alert>}
                <div className="float-right">
                  <Button color="light" size="sm" type="submit">
                    <i className="ri-edit-fill mr-1 align-middle"></i> {t('Confirm')}
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
                    invalid={touched.name && errors.name ? true : false}
                  />
                  {touched.name && errors.name ? (
                    <FormFeedback type="invalid">{errors.name}</FormFeedback>
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
                    invalid={touched.location && errors.location ? true : false}
                  />
                  {touched.location && errors.location ? (
                    <FormFeedback type="invalid">{errors.location}</FormFeedback>
                  ) : null}
                </div>
              </Form>
            </CustomCollapse>
          </Card>

          <Card className="shadow-none border mb-2">
            <CustomCollapse
              title="Privacy"
              isOpen={showCollapsiblePrivacySettings}
              toggleCollapse={toggleCollapse2}
            >
              <div className="py-3">
                <Media className="align-items-center">
                  <Media body className="overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">{t('Profile photo')}</h5>
                  </Media>
                  <UncontrolledDropdown className="ml-2">
                    <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                      {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>{t('Everyone')}</DropdownItem>
                      <DropdownItem>{t('Nobody')}</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Media>
              </div>
              <div className="py-3 border-top">
                <Media className="align-items-center">
                  <Media body className="overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">{t('Last seen')}</h5>
                  </Media>
                  <div className="ml-2">
                    <div className="custom-control custom-switch">
                      <Input
                        type="checkbox"
                        className="custom-control-input"
                        id="privacy-lastseenSwitch"
                        defaultChecked
                      />
                      <Label
                        className="custom-control-label"
                        htmlFor="privacy-lastseenSwitch"
                      ></Label>
                    </div>
                  </div>
                </Media>
              </div>

              <div className="py-3 border-top">
                <Media className="align-items-center">
                  <Media body className="overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">{t('Status')}</h5>
                  </Media>
                  <UncontrolledDropdown className="ml-2">
                    <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                      {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>{t('Everyone')}</DropdownItem>
                      <DropdownItem>{t('Nobody')}</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Media>
              </div>

              <div className="py-3 border-top">
                <Media className="align-items-center">
                  <Media body className="overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">{t('Read receipts')}</h5>
                  </Media>
                  <div className="ml-2">
                    <div className="custom-control custom-switch">
                      <Input
                        type="checkbox"
                        className="custom-control-input"
                        id="privacy-readreceiptSwitch"
                        defaultChecked
                      />
                      <Label
                        className="custom-control-label"
                        htmlFor="privacy-readreceiptSwitch"
                      ></Label>
                    </div>
                  </div>
                </Media>
              </div>

              <div className="py-3 border-top">
                <Media className="align-items-center">
                  <Media body className="overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">{t('Groups')}</h5>
                  </Media>
                  <UncontrolledDropdown className="ml-2">
                    <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                      {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
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
              toggleCollapse={toggleCollapse3}
            >
              <div>
                <Media className="align-items-center">
                  <Media body className="overflow-hidden">
                    <h5 className="font-size-13 mb-0 text-truncate">
                      {t('Show security notification')}
                    </h5>
                  </Media>
                  <div className="ml-2">
                    <div className="custom-control custom-switch">
                      <Input
                        type="checkbox"
                        className="custom-control-input"
                        id="security-notificationswitch"
                      />
                      <Label
                        className="custom-control-label"
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
              toggleCollapse={toggleCollapse4}
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
