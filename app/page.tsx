'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { startCall, endCall } from '@/lib/callFunctions'
import { CallConfig, SelectedTool } from '@/lib/types'
import demoConfig, { loadDemoConfig } from './demo-config';
import { Role, Transcript, UltravoxExperimentalMessageEvent, UltravoxSessionStatus } from 'ultravox-client';
import BorderedImage from '@/app/components/BorderedImage';
import UVLogo from '@/public/UVMark-White.svg';
import CallStatus from './components/CallStatus';
import DebugMessages from '@/app/components/DebugMessages';
import MicToggleButton from './components/MicToggleButton';
import { PhoneOffIcon, PhoneIcon, MicIcon, CarIcon, MapPinIcon, ClockIcon, UserIcon } from 'lucide-react';
import OrderDetails from './components/OrderDetails';

type SearchParamsProps = {
  showMuteSpeakerButton: boolean;
  modelOverride: string | undefined;
  showDebugMessages: boolean;
  showUserTranscripts: boolean;
};

type SearchParamsHandlerProps = {
  children: (props: SearchParamsProps) => React.ReactNode;
};

function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
  // Process query params to see if we want to change the behavior for showing speaker mute button or changing the model
  const searchParams = useSearchParams();
  const showMuteSpeakerButton = searchParams.get('showSpeakerMute') === 'true';
  const showDebugMessages = searchParams.get('showDebugMessages') === 'true';
  const showUserTranscripts = searchParams.get('showUserTranscripts') === 'true';
  let modelOverride: string | undefined;

  if (searchParams.get('model')) {
    modelOverride = "fixie-ai/" + searchParams.get('model');
  }

  return children({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts });
}

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('Loading configuration from ultravox-config.js...');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
  const [actualDemoConfig, setActualDemoConfig] = useState(demoConfig);

  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  // Load configuration from your ultravox-config.js
  useEffect(() => {
    loadDemoConfig().then(config => {
      setActualDemoConfig(config);
      setAgentStatus('Configuration loaded from ultravox-config.js ✅');
    }).catch(error => {
      console.error('Failed to load configuration:', error);
      setAgentStatus('Using fallback configuration ⚠️');
    });
  }, []);



  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if (status) {
      setAgentStatus(status);
    } else {
      setAgentStatus('off');
    }

  }, []);

  const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
    if (transcripts) {
      setCallTranscript([...transcripts]);
    }
  }, []);

  const handleDebugMessage = useCallback((debugMessage: UltravoxExperimentalMessageEvent) => {
    setCallDebugMessages(prevMessages => [...prevMessages, debugMessage]);
  }, []);

  const clearCustomerProfile = useCallback(() => {
    // This will trigger a re-render of CustomerProfileForm with a new empty profile
    setCustomerProfileKey(prev => prev ? `${prev}-cleared` : 'cleared');
  }, []);

  const handleStartCallButtonClick = async (modelOverride?: string, showDebugMessages?: boolean) => {
    try {
      handleStatusChange('Starting call...');
      setCallTranscript(null);
      setCallDebugMessages([]);
      clearCustomerProfile();

      // Generate a new key for the customer profile
      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);

      // Setup our call config using loaded configuration
      let callConfig: CallConfig = {
        systemPrompt: actualDemoConfig.callConfig.systemPrompt,
        model: modelOverride || actualDemoConfig.callConfig.model,
        languageHint: actualDemoConfig.callConfig.languageHint,
        voice: actualDemoConfig.callConfig.voice,
        temperature: actualDemoConfig.callConfig.temperature,
        maxDuration: actualDemoConfig.callConfig.maxDuration,
        timeExceededMessage: actualDemoConfig.callConfig.timeExceededMessage
      };

      const paramOverride: { [key: string]: any } = {
        "callId": newKey
      }

      let cpTool: SelectedTool | undefined = actualDemoConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "createProfile");

      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = actualDemoConfig.callConfig.selectedTools;

      await startCall({
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
        onDebugMessage: handleDebugMessage
      }, callConfig, showDebugMessages);

      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      handleStatusChange(`Error starting call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      handleStatusChange('Ending call...');
      await endCall();
      setIsCallActive(false);

      clearCustomerProfile();
      setCustomerProfileKey(null);
      handleStatusChange('Call ended successfully');
    } catch (error) {
      handleStatusChange(`Error ending call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    }>
      <SearchParamsHandler>
        {({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts }: SearchParamsProps) => (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-10 opacity-50">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              </div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 container mx-auto px-4 py-8">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
                  <CarIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {actualDemoConfig.title}
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  AI-Powered Taxi Booking System
                </p>
              </div>

              {/* Main Content */}
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Panel - Main Interface */}
                  <div className="lg:col-span-2">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                      {!isCallActive ? (
                        /* Welcome State */
                        <div className="text-center">
                          {/* AI Avatar */}
                          <div className="relative mb-8">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                              <MicIcon className="w-16 h-16 text-white" />
                            </div>
                            <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-purple-400 rounded-full animate-ping opacity-75"></div>
                          </div>

                          {/* Features Grid */}
                          <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <MapPinIcon className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                              <h3 className="text-white font-semibold mb-2">Smart Routing</h3>
                              <p className="text-gray-300 text-sm">AI-powered address validation and optimal route planning</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <ClockIcon className="w-8 h-8 text-pink-400 mb-3 mx-auto" />
                              <h3 className="text-white font-semibold mb-2">Real-time Updates</h3>
                              <p className="text-gray-300 text-sm">Live booking status and driver location tracking</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <UserIcon className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
                              <h3 className="text-white font-semibold mb-2">Natural Voice</h3>
                              <p className="text-gray-300 text-sm">Speak naturally - no complex commands needed</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                              <CarIcon className="w-8 h-8 text-green-400 mb-3 mx-auto" />
                              <h3 className="text-white font-semibold mb-2">Vehicle Options</h3>
                              <p className="text-gray-300 text-sm">Standard, Estate, MPV, and Luxury vehicles available</p>
                            </div>
                          </div>

                          {/* Overview Text */}
                          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-8 border border-purple-500/30">
                            <p className="text-white leading-relaxed">
                              {actualDemoConfig.overview}
                            </p>
                          </div>

                          {/* Start Call Button */}
                          <button
                            type="button"
                            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                            onClick={() => handleStartCallButtonClick(modelOverride, showDebugMessages)}
                          >
                            <PhoneIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                            Start Voice Call
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      ) : (
                        /* Active Call State */
                        <div>
                          {/* Call Header */}
                          <div className="text-center mb-6">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                              <MicIcon className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Call Active</h2>
                            <p className="text-gray-300">Speak naturally to book your taxi</p>
                          </div>

                          {/* Conversation Display */}
                          <div className="bg-black/30 rounded-2xl p-6 mb-6 border border-white/10">
                            <div
                              ref={transcriptContainerRef}
                              className="h-80 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent"
                            >
                              {callTranscript && callTranscript.map((transcript, index) => (
                                <div key={index} className={`flex ${transcript.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                                  {(showUserTranscripts || transcript.speaker === 'agent') && (
                                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${transcript.speaker === 'agent'
                                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                      : 'bg-white/20 text-white border border-white/30'
                                      }`}>
                                      <p className="text-xs opacity-75 mb-1">
                                        {transcript.speaker === 'agent' ? "AI Assistant" : "You"}
                                      </p>
                                      <p className="text-sm">{transcript.text}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Call Controls */}
                          <div className="flex justify-center space-x-4">
                            <MicToggleButton role={Role.USER} />
                            {showMuteSpeakerButton && <MicToggleButton role={Role.AGENT} />}
                            <button
                              type="button"
                              className="group flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              onClick={handleEndCallButtonClick}
                              disabled={!isCallActive}
                            >
                              <PhoneOffIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                              End Call
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Status & Details */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                      <CallStatus status={agentStatus}>
                        <OrderDetails />
                      </CallStatus>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Messages */}
            <DebugMessages debugMessages={callDebugMessages} />
          </div>
        )}
      </SearchParamsHandler>
    </Suspense>
  )
}