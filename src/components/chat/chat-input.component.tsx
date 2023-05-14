import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {} from 'emoji-mart';
import { useFormik } from 'formik';
import { useState } from 'react';
import {
  Button,
  ButtonDropdown,
  Col,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import * as Yup from 'yup';

import { useTranslation } from 'react-i18next';
import { createMessage, useAppDispatch } from '../../redux';

const ChatInputSchema = Yup.object().shape({
  message: Yup.string().required(),
});

type ChatInputProps = {
  uid: string;
  channelId?: string;
};
const ChatInput = ({ uid, channelId }: ChatInputProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [showEmojiPickerModal, setShowEmojiPickerModal] =
    useState<boolean>(false);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    values,
    setFieldValue,
    resetForm,
  } = useFormik({
    validationSchema: ChatInputSchema,
    initialValues: { message: '' },
    onSubmit: async ({ message }) => {
      console.log('submit', message, channelId);
      if (channelId) {
        // write
        dispatch(
          createMessage({
            channelId,
            text: message,
            user: uid,
            timestamp: new Date().toISOString(),
          })
        );

        resetForm();
      }
    },
  });

  const toggle = () => setShowEmojiPickerModal(!showEmojiPickerModal);

  const addEmoji = (e: Record<string, string>) => {
    setFieldValue('message', values.message + e.native); // or e.native
  };

  return (
    <div className="p-3 p-lg-4 border-top mb-0">
      <Form onSubmit={handleSubmit}>
        <Row className="g-0">
          <Col>
            <div>
              <Input
                type="text"
                id="message"
                name="message"
                className="form-control form-control-lg bg-light border-light"
                placeholder="Enter Message..."
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
                invalid={!!errors.message && touched.message}
              />
            </div>
          </Col>
          <Col xs="auto">
            <div className="chat-input-links ms-md-2">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <ButtonDropdown
                    className="emoji-dropdown"
                    direction="up"
                    isOpen={showEmojiPickerModal}
                    toggle={toggle}
                  >
                    <DropdownToggle
                      id="emoji"
                      color="link"
                      className="text-decoration-none font-size-16 btn-md waves-effect"
                    >
                      <i className="ri-emotion-laugh-line"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-lg-right">
                      <Picker native data={data} onEmojiSelect={addEmoji} />
                    </DropdownMenu>
                  </ButtonDropdown>
                  <UncontrolledTooltip target="emoji" placement="top">
                    Emoji
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item input-file">
                  <Label
                    id="files"
                    className="btn btn-link text-decoration-none font-size-16 btn-md waves-effect"
                  >
                    <i className="ri-attachment-line"></i>
                    <Input
                      onChange={(e) =>
                        console.log(
                          e.target.files &&
                            URL.createObjectURL(e.target.files[0])
                        )
                      }
                      type="file"
                      name="fileInput"
                      size={60}
                    />
                  </Label>
                  <UncontrolledTooltip target="files" placement="top">
                    {t('Publish File')}
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item">
                  <Button
                    type="submit"
                    color="primary"
                    className="font-size-16 btn-lg chat-send waves-effect waves-light"
                  >
                    <i className="ri-send-plane-2-fill"></i>
                  </Button>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ChatInput;
