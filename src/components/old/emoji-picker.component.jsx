import Picker from 'emoji-picker-react';
import { useState } from 'react';

function EmojiPicker() {
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return (
    <div>
      <Picker onEmojiClick={onEmojiClick} />
      {chosenEmoji && <span>{chosenEmoji.emoji}</span>}
    </div>
  );
}

export default EmojiPicker;
