import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTime } from '../store/actions';

const VideoPlayer = ({ onPlayerReady }) => {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const videoId = useSelector(state => state.videoId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current = new window.YT.Player('player', {
          videoId,
          events: {
            onReady: (event) => {
              onPlayerReady(event.target);
              dispatch(setCurrentTime(videoId, event.target.getCurrentTime()));
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                playerRef.current.interval = setInterval(() => {
                  dispatch(setCurrentTime(videoId, event.target.getCurrentTime()));
                }, 1000);
              } else {
                clearInterval(playerRef.current.interval);
              }
            },
          },
        });
      }
    };

    const fetchVideoTitle = async () => {
      try {
        const apiKey = process.env.REACT_APP_API_KEY;
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
        const data = await response.json();
        if (data?.items?.length > 0) {
          setTitle(data.items[0].snippet.title);
          setDescription(data.items[0].snippet.description);
          setLoading(false);
        }
      } catch (error) {
        setError('Failed to fetch video title and description');
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }
    fetchVideoTitle();

    return () => {
      if (playerRef.current) {
        clearInterval(playerRef.current.interval);
        if (playerRef.current.destroy) {
          playerRef.current.destroy();
        }
        playerRef.current = null;
      }
    };
  }, [videoId, dispatch, onPlayerReady]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='w-full mb-5'>
      <div id="player" className="w-full h-800px"></div>
      {!loading && (
        <>
          <div className='font-bold w-full mt-10'>{title}</div>
          <div className='w-full text-gray-600'>{description}</div>
        </>
      )}
    </div>
  );
  
};

export default VideoPlayer;
