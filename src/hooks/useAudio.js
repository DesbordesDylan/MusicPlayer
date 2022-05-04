import { useState, useEffect } from 'react'

export default function useAudio(url) {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const togglePlayback = () => setPlaying(!playing);

    useEffect(() => {
        if (playing) {
            audio.play();
          } else {
            audio.pause();
          }
        }, [playing]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, audio, togglePlayback];
};
