import MessageInput from '../components/MessageInput';
import useSWR from 'swr';
import MessageList from '../components/MessageList';
import Hot from '../components/Hot';
import Not from '../components/Not';
import Stream from '../components/Stream';
import Agenda from '../components/Agenda';
import Infobox from '../components/Infobox';
import styles from './index.module.css';

// Socket
import socketIOClient from 'socket.io-client';
import HotReactionWindow from '../components/HotReactionWindow';
import NotReactionWindow from '../components/NotReactionWindow';
import { useState } from 'react';
import ReactionToggle from '../components/ReactionToggle';

const socket = socketIOClient(process.env.NEXT_PUBLIC_SOCKET_URL);

const fetcher = (url) => fetch(url).then((res) => res.json());

const Index = () => {
  const { data, error } = useSWR('/api/state', fetcher);

  const [showReactions, setShowReactions] = useState(true);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.centerContent}>
        <div className={styles.header}>
          <img className={styles.headerImg} src="/header_tinderfest.png" />
        </div>
        <div className={styles.streamAndMessages}>
          <div className={styles.streamAndVoting}>
            <div className={styles.streamAndReactions}>
              <HotReactionWindow
                socket={socket}
                showReactions={showReactions}
              />
              <Stream streamId="LA4ewa851CY" />
              <NotReactionWindow
                socket={socket}
                showReactions={showReactions}
              />
            </div>
            <div className={styles.votingAndToggle}>
              <div className={styles.voting}>
                <Hot socket={socket} />
                <Not socket={socket} />
              </div>
              <ReactionToggle
                setShowReactions={setShowReactions}
                showReactions={showReactions}
              />
            </div>
          </div>
          <div className={styles.chat}>
            <MessageList socket={socket} />
            <MessageInput />
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        {data.info.length != 0 && <Infobox info={data.info} />}
        <div style={{ flex: 2 }}>
          <Agenda agenda={data.agenda} />
        </div>
      </div>
    </div>
  );
};
export default Index;
