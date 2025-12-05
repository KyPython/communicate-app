import { useEffect, useState } from 'react';
import { fetchChannels, createChannel } from '../api';
import type { Channel } from '../types';
import './ChannelList.css';

interface ChannelListProps {
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
}

export function ChannelList({ selectedChannelId, onSelectChannel }: ChannelListProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const data = await fetchChannels();
      setChannels(data);
      // Auto-select first channel if none selected
      if (!selectedChannelId && data.length > 0) {
        onSelectChannel(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load channels:', error);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !newChannelDesc.trim()) return;

    try {
      const channel = await createChannel(newChannelName.trim(), newChannelDesc.trim());
      setChannels([...channels, channel]);
      setNewChannelName('');
      setNewChannelDesc('');
      setIsCreating(false);
      onSelectChannel(channel.id);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  return (
    <div className="channel-list">
      <div className="channel-list-header">
        <h2>Channels</h2>
        <button onClick={() => setIsCreating(!isCreating)}>+</button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateChannel} className="create-channel-form">
          <input
            type="text"
            placeholder="Channel name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newChannelDesc}
            onChange={(e) => setNewChannelDesc(e.target.value)}
            required
          />
          <div className="form-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={() => setIsCreating(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="channels">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className={selectedChannelId === channel.id ? 'active' : ''}
            onClick={() => onSelectChannel(channel.id)}
          >
            <div className="channel-name">#{channel.name}</div>
            <div className="channel-desc">{channel.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

