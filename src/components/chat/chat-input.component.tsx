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
import { Picker, BaseEmoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

type ChatInputProps = {
  onCreateMessage: (
    message: string,
    type: 'textMessage' | 'fileMessage' | 'mediaMessage',
    size?: number,
  ) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onCreateMessage }) => {
  const [textMessage, setTextMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setTextMessage(e.target.value);
  };

  const addEmoji = (e: BaseEmoji) => {
    setTextMessage(textMessage + e.native);
  };

  const onSubmitMessage = (e: React.FormEvent<HTMLFormElement>, message: string) => {
    e.preventDefault();

    if (message !== '') {
      onCreateMessage(message, 'textMessage');
      setTextMessage('');
    }
  };
  return (
    <>
      <div className="p-3 p-lg-4 border-top mb-0">
        <Form onSubmit={(e) => onSubmitMessage(e, textMessage)}>
          <Row noGutters>
            <Col>
              <div>
                <Input
                  type="text"
                  value={textMessage}
                  onChange={handleChange}
                  className="form-control form-control-lg bg-light border-light"
                  placeholder="Enter Message..."
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
                      isOpen={isOpen}
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
                          console.log(e.target.files && URL.createObjectURL(e.target.files[0]))
                        }
                        type="file"
                        name="fileInput"
                        size={60}
                      />
                    </Label>
                    <UncontrolledTooltip target="files" placement="top">
                      Attached File
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
    </>
  );
};

export default ChatInput;
