import { useEffect, useState } from 'react';
import styles from './MessageInput.module.css';

const MessageInput = () => {
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarExists, setAvatarExists] = useState(false);
  const avatars = [
    'avatar1',
    'avatar2',
    'avatar3',
    'avatar4',
    'avatar5',
    'avatar6',
    'avatar7',
  ];

  const maxTextLength = 55;
  const maxUsernameLength = 20;

  const handleInputTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleAvatarSubmit = () => {
    setAvatar(avatars[Math.floor(Math.random() * avatars.length)]);
    sessionStorage.setItem('avatar', avatar);
    setAvatarExists(true);
  };

  const handleUsernameSubmit = () => {
    sessionStorage.setItem('name', username);
    setUsernameExists(true);
  };

  const handleUserSubmit = (event) => {
    if (!username || username > maxUsernameLength) {
      event.preventDefault();
      return;
    }
    handleUsernameSubmit();
    event.preventDefault();
  };

  useEffect(() => {
    if (sessionStorage.getItem('name')) {
      setUsername(sessionStorage.getItem('name'));
      setUsernameExists(true);
    }
    if (sessionStorage.getItem('avatar')) {
      setAvatar(sessionStorage.getItem('avatar'));
      setAvatarExists(true);
    }
  }, []);

  const handleMessageSubmit = (event) => {
    if (!inputText || inputText > maxTextLength) {
      event.preventDefault();
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username,
        text: inputText,
        avatar: avatar,
      }),
    })
      .then()
      .catch((error) => {
        console.error(error);
      });
    setInputText('');
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      {!usernameExists && (
        <form className={styles.form} onSubmit={handleUserSubmit}>
          <label>
            <input
              type="text"
              value={username}
              placeholder="Navn"
              onChange={handleUsernameChange}
              className={styles.usernameInput}
              maxLength={maxUsernameLength}
            />
          </label>
          <input
            className={styles.submitInput}
            type="submit"
            value="Sett brukernavn"
          />
        </form>
      )}
      {!avatarExists && handleAvatarSubmit()}
      {usernameExists && avatarExists && (
        <form className={styles.form} onSubmit={handleMessageSubmit}>
          <label>
            <input
              type="text"
              value={inputText}
              placeholder="Skriv en melding ..."
              onChange={handleInputTextChange}
              className={styles.messageInput}
              maxLength={maxTextLength}
            />
          </label>
          <input className={styles.submitInput} type="submit" value="Send" />
        </form>
      )}
    </div>
  );
};
export default MessageInput;
