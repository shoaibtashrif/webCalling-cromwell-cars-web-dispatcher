import React, { useState, useCallback } from 'react';
import { Role } from 'ultravox-client';
import { toggleMute } from '@/lib/callFunctions';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';

interface MicToggleButtonProps {
  role: Role;
}

const MicToggleButton: React.FC<MicToggleButtonProps> = ({ role }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMic = useCallback(async () => {
    try {
      toggleMute(role);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  }, [isMuted]);

  return (
    <button
      onClick={toggleMic}
      className={`group flex items-center justify-center px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
        isMuted 
          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
      } text-white shadow-lg`}
    >
      {isMuted ? (
        <>
          { role === Role.USER ? (
            <MicOffIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          ) : (
            <VolumeOffIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          )}
          <span className="font-medium">Unmute</span>
        </>
      ) : (
        <>
          { role === Role.USER ? (
            <MicIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          ) : (
            <Volume2Icon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          )}
          <span className="font-medium">Mute</span>
        </>
      )}
    </button>
  );
};

export default MicToggleButton;