import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
  FormGroup,
  Label,
  Input,
  Collapse,
  CardHeader,
  CardBody,
  Alert,
  InputGroup,
  InputGroupAddon,
  Media,
  Card,
  Badge,
  FormFeedback,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import ReactMoment from 'react-moment';

import {
  createChannel,
  deleteChannelForUser,
  fetchChannels,
  IChannel,
  IUser,
  useAppDispatch,
} from '@chatr/redux';
import ContactFinder from './contact-finder.component';

const CreateGroupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().min(2).max(255),
});

type ChannelsTabProps = {
  uid: string;
  channels: IChannel[];
  contacts?: IUser[];
};

const ChannelsTab: React.FC<ChannelsTabProps> = ({
  uid,
  channels,
  contacts,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [filteredChannels, setFilteredChannels] = useState<
    Omit<IChannel, 'isDirectMessage'>[]
  >([]);
  const [showCreateChannelModal, setShowCreateChannelModal] =
    useState<boolean>(false);
  const [showCreateChannelAlert, setShowCreateChannelAlert] =
    useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [createChannelFormError, setCreateChannelFormError] =
    useState<string>();

  useEffect(() => {
    setFilteredChannels(channels.filter((channel) => !channel.isDirectMessage));
  }, [channels]);

  const toggleCreateGroupModal = () =>
    setShowCreateChannelModal(!showCreateChannelModal);

  const handleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkedUid: string
  ) => {
    if (e.target.checked) {
      setSelectedContacts([...selectedContacts, checkedUid]);
    }
  };

  const handleOnLeaveClick = async (channelId: string) => {
    // remove channel id from user and edit group
    await dispatch(deleteChannelForUser({ channelId, userId: uid }));
    // refetch channels
    dispatch(fetchChannels(uid));
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
      if (selectedContacts.length >= 2) {
        // TODO refactor to allow for image upload to firebae
        await dispatch(
          createChannel({
            name,
            photoURL: 'https://picsum.photos/50',
            memberIds: [uid, ...selectedContacts],
            createdAt: new Date().getTime(),
          })
        );
        // refetch channels
        dispatch(fetchChannels(uid));

        // clear selectedContacts array and close modal
        setSelectedContacts([]);
        resetForm();
        setShowCreateChannelModal(false);
      } else if (selectedContacts.length === 1) {
        setShowCreateChannelAlert(true);
        setCreateChannelFormError(
          t('Minimum 2 other members are required to create a group.')
        );
      } else {
        setShowCreateChannelAlert(true);
        setCreateChannelFormError(
          t('Please choose at least 2 other contacts to create a channel with.')
        );
      }
    },
  });

  return (
    <>
      <div className="p-4">
        <div className="user-chat-nav float-right">
          <div id="create-group">
            <Button
              onClick={toggleCreateGroupModal}
              type="button"
              color="link"
              className="text-decoration-none text-muted font-size-18 py-0"
            >
              <i className="ri-group-line mr-1"></i>
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
                    <h5 className="font-size-15 mb-0">{t('Contacts')}</h5>
                  </CardHeader>
                  <CardBody className="p-2">
                    <SimpleBar style={{ maxHeight: '150px' }}>
                      <ContactFinder {...{ uid, contacts, handleCheck }} />
                    </SimpleBar>
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
            <InputGroupAddon addonType="prepend">
              <Button
                color="link"
                className="text-decoration-none text-muted pr-1"
                type="button"
              >
                <i className="ri-search-line search-icon font-size-18"></i>
              </Button>
            </InputGroupAddon>
            <Input
              type="text"
              className="form-control bg-light"
              placeholder="Search channels..."
            />
          </InputGroup>
        </div>
      </div>

      <SimpleBar
        style={{ maxHeight: '100%' }}
        className="p-4 chat-message-list chat-group-list"
      >
        <ul className="list-unstyled chat-list">
          {filteredChannels.length >= 1 ? (
            filteredChannels.map((channel, key) => (
              <li key={key}>
                <Link to="#">
                  <Media className="align-items-center">
                    <div className="chat-user-img mr-3">
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {channel.photoURL ? (
                            <img
                              src={channel.photoURL}
                              alt="channel"
                              className="rounded-circle"
                            />
                          ) : (
                            channel.name[uid].charAt(0)
                          )}
                        </span>
                      </div>
                    </div>
                    <Media body className="overflow-hidden">
                      <h5 className="text-truncate font-size-14 mb-0">
                        {channel.name[uid]}

                        <Badge
                          color="none"
                          pill
                          className="badge-soft-danger float-right"
                        >
                          <ReactMoment format="YYYY-MM-DD	HH:mm:ss">
                            {channel.createdAt}
                          </ReactMoment>
                        </Badge>
                        <Badge
                          color="none"
                          pill
                          className="badge-soft-info float-right"
                        >
                          {_.values(channel.members).length} Members
                        </Badge>
                      </h5>
                    </Media>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="div" className="text-muted">
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          onClick={() => handleOnLeaveClick(channel.id)}
                        >
                          {t('Leave')}{' '}
                          <i className="ri-forbid-line float-right text-muted"></i>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Media>
                </Link>
              </li>
            ))
          ) : (
            <li>
              <Alert color="info">{t('No group channels.')}</Alert>
            </li>
          )}
        </ul>
      </SimpleBar>
    </>
  );
};

export default ChannelsTab;
