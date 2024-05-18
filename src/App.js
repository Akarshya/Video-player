import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoPlayer from './components/Videoplayer';
import Annotations from './components/Annotations';
import { setVideoId } from './store/actions';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const [inputVideoId, setInputVideoId] = useState('');
  const videoId = useSelector(state => state.videoId);

  useEffect(() => {
    // Reset video ID on mount to avoid persisting the last video ID
    dispatch(setVideoId(''));
  }, [dispatch]);

  const handleVideoChange = () => {
    dispatch(setVideoId(inputVideoId));
    setInputVideoId('');
  };

  const jumpToTimestamp = (timestamp) => {
    if (window.player) {
      window.player.seekTo(timestamp, true);
    }
  };

  const onPlayerReady = (player) => {
    window.player = player;
  };

  return (
    <div className="App container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <input
          className="border border-gray-300 p-2 rounded-lg w-1/2"
          type="text"
          value={inputVideoId}
          onChange={(e) => setInputVideoId(e.target.value)}
          placeholder="Enter YouTube video ID"
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleVideoChange}
        >
          Load Video
        </button>
      </div>
      {videoId && (
        <>
          <VideoPlayer onPlayerReady={onPlayerReady} videoId={videoId} />
          <Annotations videoId={videoId} jumpToTimestamp={jumpToTimestamp} />
        </>
      )}
    </div>
  );
};

export default App;
