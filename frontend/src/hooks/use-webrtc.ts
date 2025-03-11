import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { io, type Socket } from 'socket.io-client';
interface ServerToClientEvents {
  answer: (data: RTCSessionDescriptionInit) => void;
  'ice-candidate': (data: RTCIceCandidateInit) => void;
}

interface ClientToServerEvents {
  'ice-candidate': (data: RTCIceCandidateInit) => void;
  offer: (data: RTCSessionDescriptionInit) => void;
}
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:5000'
);

export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [isInitiator, setIsInitiator] = useState<boolean>(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get local media stream (audio and video)
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
      } catch (error) {
        toast.error('Error accessing media devices.');
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (localStream && !isInitiator) {
      // Create the RTCPeerConnection when the local stream is available
      createPeerConnection();
    }
  }, [localStream, isInitiator]);

  const createPeerConnection = () => {
    try {
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.stunserver.org:3478' }, // STUN server for NAT traversal
        ],
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to the peer connection
      localStream?.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, localStream);
      });

      // Event handlers for peer connection events

      // Handle incoming ice candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          // Send the ICE candidate to the remote peer
          socket.emit('ice-candidate', event.candidate);
        }
      };

      // Handle changes in the connection state
      peerConnectionRef.current.oniceconnectionstatechange = () => {
        console.log(
          'ICE connection state:',
          peerConnectionRef.current?.iceConnectionState
        );
      };
    } catch (error) {
      toast.error('Error creating peer connection');
    }
  };
  const handleAnswer = async (data: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data)
      );
    } catch (error) {
      toast.error('Error setting remote description.');
    }
  };
  const handleIceCandidate = async (iceCandidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;
    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    } catch (error) {
      toast.error('Error adding ICE candidate.');
    }
  };
  useEffect(() => {
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate); // Ensure correct event name

    return () => {
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, []);
  // Create offer and set it as the local description
  const createOffer = async () => {
    const offer = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(offer);
    if (offer)
      // Send the offer to the remote peer
      socket.emit('offer', offer);
  };

  const initiateCall = () => {
    setIsInitiator(true);
    try {
      // Create the RTCPeerConnection when initiating the call
      createPeerConnection();

      createOffer();
    } catch (error) {
      toast.error('Error creating offer.');
    }
  };

  return {
    localStream,
    initiateCall,
  };
};
