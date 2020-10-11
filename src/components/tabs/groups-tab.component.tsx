import React, { useState } from 'react';
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
} from 'reactstrap';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import SimpleBar from 'simplebar-react';
import * as chatActions from 'store/chat/actions';
import { useTranslation } from 'react-i18next';
import { IChatState, IContact } from 'store/chat';
import { useFormik } from 'formik';
import ContactFinder from 'components/contacts/contact-finder/contact-finder.component';
import { useDispatch } from 'react-redux';

const CreateGroupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().min(2).max(255),
});

type GroupsTabProps = Pick<IChatState, 'groups' | 'contacts'>;

const GroupsTab: React.FC<GroupsTabProps> = ({ groups, contacts }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>();
  const [showCreateGroupAlert, setShowCreateGroupAlert] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([]);
  const toggleCreateGroupModal = () => setShowCreateGroupModal(!showCreateGroupModal);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const selected = selectedContacts;
    if (e.target.checked) {
      selected.push({
        id,
        name: e.target.value,
      });
      setSelectedContacts(selected);
    }
  };
  const { handleChange, handleBlur, handleSubmit, errors, touched, values } = useFormik({
    validationSchema: CreateGroupSchema,
    initialValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ name, description }, actions) => {
      try {
        console.log(name, description, selectedContacts);

        if (selectedContacts.length >= 2) {
          dispatch(
            chatActions.createGroup({
              groupId: groups.length + 1,
              name,
              desc: description,
              members: selectedContacts,
              profilePicture: 'Null',
              isGroup: true,
              unRead: 0,
              isNew: true,
            }),
          );
          toggleCreateGroupModal();
        } else if (selectedContacts.length === 1) {
          setShowCreateGroupAlert(true);
          setFormError(t('Minimum 2 members are required to create a group'));
        } else {
          setShowCreateGroupAlert(true);
          setFormError(t('Please select at least 2 contacts to create a group with'));
        }
        // timeout to close the modal
        // setTimeout(() => setShowCreateGroupAlert(false), 3000);
        actions.resetForm({
          values: {
            name,
            description,
          },
        });
      } catch (error) {
        setShowCreateGroupAlert(true);
        setFormError((error as Error).message);
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
            Create group
          </UncontrolledTooltip>
        </div>
        <h4 className="mb-4">{t('Groups')}</h4>

        <Modal isOpen={showCreateGroupModal} centered toggle={toggleCreateGroupModal}>
          <ModalHeader
            tag="h5"
            className="modal-title font-size-16"
            toggle={toggleCreateGroupModal}
          >
            {t('Create New Group')}
          </ModalHeader>
          <ModalBody className="p-4">
            <FormGroup className="mb-4">
              <Label htmlFor="addgroupname-input">{t('Group Name')}</Label>
              <Input
                type="text"
                id="addgroupname-input"
                name="name"
                className="form-control"
                placeholder="Enter Group Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                invalid={touched.name && errors.name ? true : false}
              />
              {touched.name && errors.name ? (
                <FormFeedback type="invalid">{errors.name}</FormFeedback>
              ) : null}
            </FormGroup>
            <FormGroup className="mb-4">
              <Label>{t('Group Members')}</Label>
              <Alert isOpen={showCreateGroupAlert} color="danger">
                {formError}
              </Alert>
              <Collapse isOpen={true} id="groupmembercollapse">
                <Card className="border">
                  <CardHeader>
                    <h5 className="font-size-15 mb-0">{t('Contacts')}</h5>
                  </CardHeader>
                  <CardBody className="p-2">
                    <SimpleBar style={{ maxHeight: '150px' }}>
                      <ContactFinder {...{ handleCheck, contacts }} />
                    </SimpleBar>
                  </CardBody>
                </Card>
              </Collapse>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="addgroupdescription-input">Description</Label>
              <Input
                type="textarea"
                id="addgroupdescription-input"
                placeholder="Enter Description"
                name="description"
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                invalid={touched.description && errors.description ? true : false}
              />
              {touched.description && errors.description ? (
                <FormFeedback type="invalid">{errors.description}</FormFeedback>
              ) : null}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="button" color="link" onClick={toggleCreateGroupModal}>
              {t('Close')}
            </Button>
            <Button type="submit" color="primary" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </Modal>

        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="bg-light rounded-lg">
            <InputGroupAddon addonType="prepend">
              <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                <i className="ri-search-line search-icon font-size-18"></i>
              </Button>
            </InputGroupAddon>
            <Input type="text" className="form-control bg-light" placeholder="Search groups..." />
          </InputGroup>
        </div>
        {/* end search-box */}
      </div>

      {/* Start chat-group-list */}
      <SimpleBar style={{ maxHeight: '100%' }} className="p-4 chat-message-list chat-group-list">
        <ul className="list-unstyled chat-list">
          {groups.map((group, key) => (
            <li key={key}>
              <Link to="#">
                <Media className="align-items-center">
                  <div className="chat-user-img mr-3">
                    <div className="avatar-xs">
                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                        {group.name.charAt(1)}
                      </span>
                    </div>
                  </div>
                  <Media body className="overflow-hidden">
                    <h5 className="text-truncate font-size-14 mb-0">
                      {group.name}
                      {group.unRead !== 0 ? (
                        <Badge color="none" pill className="badge-soft-danger float-right">
                          {group.unRead >= 20 ? group.unRead + '+' : group.unRead}
                        </Badge>
                      ) : null}

                      {group.isNew && (
                        <Badge color="none" pill className="badge-soft-danger float-right">
                          New
                        </Badge>
                      )}
                    </h5>
                  </Media>
                </Media>
              </Link>
            </li>
          ))}
        </ul>
      </SimpleBar>
    </>
  );
};

export default GroupsTab;
