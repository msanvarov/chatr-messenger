import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { auth, db, storage } from '../config/firebase';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const channelId = 'exampleChannelId'; // Replace with the selected channel ID
  const { currentUser } = auth;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (selectedFile) {
      const filePath = `files/${currentUser.uid}/${selectedFile.name}`;
      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, `channels/${channelId}/messages`), {
        fileURL: downloadURL,
        fileName: selectedFile.name,
        timestamp: new Date(),
        user: currentUser.uid,
      });

      setSelectedFile(null);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}

export default FileUpload;
