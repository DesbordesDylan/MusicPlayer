import React, { useState, useRef, useEffect } from 'react'
import songs from "../../model/songs"
import "./AudioPlayer.css"

export default function AudioPlayer() {

  const [currentSong, setCurrentSong] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [style, setStyle] = useState("icon");

  console.log(isPlaying)

  const { title, artist, artwork, music, id, timer, url } = songs[currentSong];

  const audioRef = useRef(new Audio(music));
  const intervalRef = useRef();
  const isReady = useRef(false);

  const { duration } = audioRef.current;

  const togglePlayback = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const toNextTrack = () => {
    if (currentSong < songs.length - 1) {
      setCurrentSong(currentSong + 1);
    } else {
      setCurrentSong(0);
    }
  }

  const toPrevTrack = () => {
    if (currentSong - 1 < 0) {
      setCurrentSong(songs.length - 1);
    } else {
      setCurrentSong(currentSong - 1);
    }
  }

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(music);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {;
      audioRef.current.play();
      startTimer();
    } else {
      isReady.current = true;
    }
  }, [currentSong]);

  const startTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  }

  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  }

  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  }

  var s = parseInt(audioRef.current.currentTime % 60)
  if (s < 10) {
    s = '0' + s;
  }
  var m = parseInt((audioRef.current.currentTime / 60) % 60)

  var time = m + ":" + s;

  return (
    <div id="app" className="wrapper">
      <div className="player">
        <div className="player-top">
          <div className="player-cover">
            <span>
              <div key={id} className="player-cover-item"><img className="player-cover-item" src={artwork} alt="" /></div>
            </span>
          </div>
          <div className="player-controls">
            <a className="player-controls-item" href={url}><img src="assets/images/link.png" className="icon" alt="" /></a>
            <div className="player-controls-item" onClick={toNextTrack}><img src="assets/images/next.png" className="icon" alt="" /></div>
            <div className="player-controls-item" onClick={toPrevTrack}><img src="assets/images/prev.png" className="icon" alt="" /></div>
            <div onClick={togglePlayback} className="player-controls-item-play">{isPlaying ? <img src="assets/images/pause.png" className="icon" alt="" /> : <img src="assets/images/play.png" className="icon" alt="" />}</div>
          </div>
        </div>
        <div className="progress">
          <div className="progress-top">
            <div className="album-info">
              <div className="album-info-name">{artist}</div>
              <div className="album-info-track">{title}</div>
            </div>
            <div className="progress-duration">{timer}</div>
          </div>
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress-bar"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          />
          <div className="progress-time">{time}</div>
        </div>
      </div>
    </div>
  )
}
