import React, { useState } from 'react';
import {
  Button,
  Input,
  Row,
  Col,
  UncontrolledTooltip,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  Label,
  Form,
} from 'reactstrap';
import * as Yup from 'yup';
import { Picker, BaseEmoji } from 'emoji-mart';
import { useFormik } from 'formik';

import {
  fetchChannel,
  useAppDispatch,
  writeMessageToChannel,
} from '@chatr/redux';

import 'emoji-mart/css/emoji-mart.css';

const ChatInputSchema = Yup.object().shape({
  message: Yup.string().required(),
});

type ChatInputProps = {
  uid: string;
  channelId?: string;
  displayName: string;
  photoURL: string;
};
const ChatInput: React.FC<ChatInputProps> = ({
  uid,
  displayName,
  photoURL,
  channelId,
}) => {
  const dispatch = useAppDispatch();
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
          writeMessageToChannel({
            channelId,
            message: {
              author: {
                id: uid,
                name: displayName,
                photoURL,
              },
              content: message,
              createdAt: new Date().getTime(),
            },
          })
        );

        resetForm();
      }
    },
  });

  const toggle = () => setShowEmojiPickerModal(!showEmojiPickerModal);

  const addEmoji = (e: BaseEmoji) => {
    setFieldValue('message', values.message + e.native);
  };

  return (
    <div className="p-3 p-lg-4 border-top mb-0">
      <Form onSubmit={handleSubmit}>
        <Row noGutters>
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
            <div className="chat-input-links ml-md-2">
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
                      <Picker native onSelect={addEmoji} />
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
                    Attach a file
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
