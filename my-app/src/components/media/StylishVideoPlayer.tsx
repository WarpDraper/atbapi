import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from "react-icons/fa";

interface StylishVideoPlayerProps {
    src: string;
}

const StylishVideoPlayer: React.FC<StylishVideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [animating, setAnimating] = useState(false);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        setProgress((video.currentTime / video.duration) * 100);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        video.volume = newVolume;
        setMuted(newVolume === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setMuted(video.muted);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * video.duration;
        video.currentTime = newTime;
        setProgress((newTime / video.duration) * 100);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            setAnimating(true);
            setTimeout(() => {
                container.requestFullscreen().then(() => {
                    setIsFullscreen(true);
                    setAnimating(false);
                }).catch(err => console.error(err));
            }, 150);
        } else {
            setAnimating(true);
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
                setAnimating(false);
            });
        }
    };

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        return () => document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative max-w-xl mx-auto bg-gray-900 overflow-hidden shadow-2xl transition-all duration-700
                ${isFullscreen ? "w-screen h-screen rounded-none" : "rounded-xl"}
                ${animating ? "scale-105" : "scale-100"}
            `}
        >
            {/* затемнення під час fullscreen */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none ${
                    isFullscreen ? "opacity-40" : "opacity-0"
                }`}
            ></div>

            <div className="relative group w-full h-full">
                <video
                    ref={videoRef}
                    src={src}
                    className="w-full h-auto rounded-xl transition-transform duration-500 transform group-hover:scale-[1.03]"
                    onTimeUpdate={handleTimeUpdate}
                />

                {/* Контроли */}
                <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-gradient-to-t from-black/80 to-transparent
                    opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={togglePlay}
                            className="text-white text-2xl hover:text-purple-400 transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_8px_#a855f7]"
                        >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_8px_#a855f7]"
                            >
                                {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-24 h-1 rounded-lg appearance-none bg-gray-700 accent-purple-400 cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-purple-400 transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_8px_#a855f7]"
                        >
                            <FaExpand />
                        </button>
                    </div>

                    {/* Прогрес-бар */}
                    <div
                        className="w-full h-3 bg-gray-700 rounded mt-3 overflow-hidden cursor-pointer shadow-inner"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StylishVideoPlayer;