import { useState } from 'react';
import { ChannelList } from './components/ChannelList';
import { MessageList } from './components/MessageList';
import { ThreadView } from './components/ThreadView';
import './App.css';

function App() {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [threadMessageId, setThreadMessageId] = useState<string | null>(null);
  const [currentUser] = useState('User' + Math.floor(Math.random() * 1000));

  return (
    <div className="app">
      <ChannelList
        selectedChannelId={selectedChannelId}
        onSelectChannel={(channelId) => {
          setSelectedChannelId(channelId);
          setThreadMessageId(null); // Close thread when switching channels
        }}
      />
      <MessageList
        channelId={selectedChannelId}
        currentUser={currentUser}
        onOpenThread={setThreadMessageId}
      />
      {threadMessageId && selectedChannelId && (
        <ThreadView
          messageId={threadMessageId}
          channelId={selectedChannelId}
          currentUser={currentUser}
          onClose={() => setThreadMessageId(null)}
        />
      )}
    </div>
  );
}

export default App;

