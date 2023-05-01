import { useFormik } from 'formik';
import _ from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';
import * as Yup from 'yup';

import { useQueryOnContacts, useQueryOnUserChannels } from '../../../hooks';
import {
  createChannel,
  deleteUserFromChannel,
  IChannel,
  IUser,
  setLastOpenedChannel,
  useAppDispatch,
} from '../../../redux';
import ContactFinder from './contact-finder.component';

const CreateGroupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().min(2).max(255),
});

type ChannelsTabProps = {
  uid: string;
  displayName: string | null;
};

export const ChannelsTab = ({ uid, displayName }: ChannelsTabProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showCreateChannelModal, setShowCreateChannelModal] =
    useState<boolean>(false);
  const [showCreateChannelAlert, setShowCreateChannelAlert] =
    useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [createChannelFormError, setCreateChannelFormError] =
    useState<string>();
  const [userChannelsSearchQuery, setUserChannelsSearchQuery] =
    useState<string>();
  const [userSearchQuery, setUserSearchQuery] = useState<string>();

  const contacts = useQueryOnContacts(uid, 1000, userSearchQuery);
  const { channels: filteredChannels, loading } = useQueryOnUserChannels(
    uid,
    userChannelsSearchQuery
  );

  const toggleCreateGroupModal = () => {
    setCreateChannelFormError(undefined);
    setShowCreateChannelModal(!showCreateChannelModal);
  };

  const handleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    contact: IUser
  ) => {
    if (e.target.checked) {
      setSelectedContacts(
        (prev) => new Set([...prev, JSON.stringify(contact)])
      );
    } else {
      setSelectedContacts(
        (prev) =>
          new Set([...prev].filter((x) => x !== JSON.stringify(contact)))
      );
    }
  };

  const onOpenChannel = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    channel: IChannel
  ) => {
    e.preventDefault();

    // set last viewed channel
    dispatch(setLastOpenedChannel({ uid, channelId: channel.id }));

    navigate(`/${channel.id}`);
  };

  const handleOnLeaveClick = async (channelId: string) => {
    // remove channel id from user and edit group
    dispatch(deleteUserFromChannel({ channelId, userId: uid }));
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    errors,
    touched,
    values,
  } = useFormik({
    validationSchema: CreateGroupSchema,
    initialValues: {
      name: '',
      photo: '',
    },
    onSubmit: async ({ name, photo }) => {
      console.log(photo);

      if (selectedContacts.size >= 2) {
        // TODO refactor to allow for image upload to firebae
        await dispatch(
          createChannel({
            name,
            photoURL: 'https://via.placeholder.com/100',
            // TODO: Refactor this to not pass in a JSON strinfied object but rather IUser
            members: [
              JSON.stringify({ uid, displayName }),
              ...selectedContacts,
            ],
            createdAt: new Date().toISOString(),
          })
        );

        // clear selectedContacts array and close modal
        setSelectedContacts(new Set());
        resetForm();
        setShowCreateChannelModal(false);
      } else if (selectedContacts.size === 1) {
        setShowCreateChannelAlert(true);
        setCreateChannelFormError(
          t('Minimum 2 other members are required to create a group.') ??
            'Minimum 2 other members are required to create a group.'
        );
      } else {
        setShowCreateChannelAlert(true);
        setCreateChannelFormError(
          t(
            'Please choose at least 2 other contacts to create a channel with.'
          ) ??
            'Please choose at least 2 other contacts to create a channel with.'
        );
      }
    },
  });

  return (
    <>
      <div className="p-4">
        <div className="user-chat-nav float-end">
          <div id="create-group">
            <Button
              onClick={toggleCreateGroupModal}
              type="button"
              color="link"
              className="text-decoration-none text-muted font-size-18 py-0"
            >
              <i className="ri-group-line me-1"></i>
            </Button>
          </div>
          <UncontrolledTooltip target="create-group" placement="bottom">
            Create channel
          </UncontrolledTooltip>
        </div>
        <h4 className="mb-4">{t('Channels')}</h4>

        <Modal
          isOpen={showCreateChannelModal}
          centered
          toggle={toggleCreateGroupModal}
        >
          <ModalHeader
            tag="h5"
            className="modal-title font-size-16"
            toggle={toggleCreateGroupModal}
          >
            {t('Create Channel')}
          </ModalHeader>
          <ModalBody className="p-4">
            <Alert isOpen={showCreateChannelAlert} color="danger">
              {createChannelFormError}
            </Alert>
            <FormGroup className="mb-4">
              <Label htmlFor="addgroupname-input">{t('Channel Name')}</Label>
              <Input
                type="text"
                id="addgroupname-input"
                name="name"
                className="form-control"
                placeholder="Enter Channel Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                invalid={!!touched.name && !!errors.name}
              />
              {touched.name && errors.name ? (
                <FormFeedback type="invalid">{errors.name}</FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup className="mb-4">
              <Label>{t('Channel Members')}</Label>

              <Collapse isOpen={true} id="groupmembercollapse">
                <Card className="border">
                  <CardHeader>
                    {/* <h5 className="font-size-15 mb-0">{t('Contacts')}</h5> */}
                    <InputGroup>
                      <InputGroupText>
                        <i className="ri-search-line"></i>
                      </InputGroupText>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Search members..."
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                  </CardHeader>
                  <CardBody className="p-2">
                    {loading ? (
                      <Spinner className="spinner" color="dark" type="grow" />
                    ) : (
                      <SimpleBar style={{ maxHeight: '150px' }}>
                        <ContactFinder {...{ uid, contacts, handleCheck }} />
                      </SimpleBar>
                    )}
                  </CardBody>
                </Card>
              </Collapse>
            </FormGroup>
            <FormGroup>
              <Label for="channelphoto-input">Channel Photo</Label>
              <Input
                type="file"
                id="channelphoto-input"
                name="photo"
                className="form-control"
                onChange={(event) => {
                  const file = event.target.files
                    ? event.target.files[0]
                    : null;
                  file && setFieldValue('photo', file);
                }}
                accept="image/png, image/gif, image/jpeg"
                onBlur={handleBlur}
                invalid={!!touched.photo && !!errors.photo}
              />
              {touched.photo && errors.photo ? (
                <FormFeedback type="invalid">{errors.photo}</FormFeedback>
              ) : null}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="link" onClick={toggleCreateGroupModal}>
              {t('Close')}
            </Button>
            <Button
              type="submit"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Create Group
            </Button>
          </ModalFooter>
        </Modal>

        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="bg-light rounded-lg">
            <Button
              color="link"
              className="text-decoration-none text-muted pr-1"
              type="button"
            >
              <i className="ri-search-line search-icon font-size-18"></i>
            </Button>
            <Input
              type="text"
              className="form-control bg-light"
              placeholder="Search channels..."
              onChange={(e) => setUserChannelsSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      <SimpleBar
        style={{ maxHeight: '100%' }}
        className="p-4 chat-message-list chat-group-list"
      >
        <ul className="list-unstyled chat-list" id="channel-list">
          {filteredChannels.length >= 1 ? (
            filteredChannels.map((channel, key) => (
              <li key={key} id={`channel-${channel.id}`}>
                <Link
                  to={`/${channel.id}`}
                  onClick={(e) => onOpenChannel(e, channel)}
                >
                  <Media className="d-flex align-items-center">
                    <div className="chat-user-img me-3 ms-0">
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {channel.isDirectMessage ? (
                            <img
                              src={channel.photoURL}
                              alt="channel"
                              className="rounded-circle"
                              style={{
                                width: '35px',
                                height: '35px',
                                // borderRadius: '50%',
                              }}
                            />
                          ) : (
                            channel.name.charAt(0)
                          )}
                        </span>
                      </div>
                    </div>
                    <Media body className="flex-grow-1 overflow-hidden">
                      <h5 className="text-truncate font-size-14 mb-0">
                        {channel.isDirectMessage ? (
                          <>
                            {channel.name}
                            <Badge
                              color="none"
                              pill
                              className="badge-soft-warning float-end"
                            >
                              Direct messages
                            </Badge>
                          </>
                        ) : (
                          <>
                            {`#${channel.name}`}
                            <Badge
                              color="none"
                              pill
                              className="badge-soft-info float-end"
                            >
                              {_.values(channel.members).length} members
                            </Badge>
                          </>
                        )}
                      </h5>
                    </Media>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="div" className="text-muted">
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem
                          onClick={() => handleOnLeaveClick(channel.id)}
                        >
                          {t('Leave')}{' '}
                          <i className="ri-forbid-line float-end text-muted"></i>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Media>
                </Link>
              </li>
            ))
          ) : (
            <li>
              <Alert color="warning">{t('No channels found.')}</Alert>
            </li>
          )}
        </ul>
      </SimpleBar>
    </>
  );
};

export default ChannelsTab;
