import { RootState } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
interface ClientToServerEvents {
  sendIceCandidateToSignalingServer: (data: {
    iceCandidate: RTCIceCandidateInit;
    iceUserId: string;
    didIOffer: boolean;
  }) => void;
  offer: (data: {
    userId: string;
    newOffer: RTCSessionDescriptionInit;
  }) => void;
  register: (data: { userId: string; clientType: 'server' | 'client' }) => void;
  newAnswer: (data: {
    offer: RTCSessionDescriptionInit;
    answer: RTCSessionDescriptionInit;
    offererIceCandidates: RTCIceCandidateInit[];
    answererIceCandidates: RTCIceCandidateInit[];
    offererId: string;
  }) => Promise<RTCIceCandidateInit[]>;
  disconnect: () => void;
}
interface ServerToClientEvents {
  iceCandidateFromClient: (data: RTCIceCandidateInit) => void;
  iceCandidateFromServer: (data: RTCIceCandidateInit) => void;
  AnswerFromServer: (data: RTCSessionDescriptionInit) => void;
  offer: (data: {
    offer: RTCSessionDescriptionInit;
    answer: RTCSessionDescriptionInit | null;
    offererIceCandidates: RTCIceCandidateInit[];
    answererIceCandidates: RTCIceCandidateInit[];
    offererId: string;
  }) => void;
}
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:8181',
  {
    transports: ['websocket'], // Force WebSocket over polling
    withCredentials: true,
  }
);
let dataChannel: RTCDataChannel | null = null;
export const useWebRTC = () => {
  let userId = useSelector((state: RootState) => state.auth.userId);
  if (!userId) {
    userId = '65f2b6d2e6f1a5d47c3f91b7';
  }
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [isInitiator, setIsInitiator] = useState<boolean>(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [didIOffer, setDidIOffer] = useState(false);
  const navigate = useNavigate();
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
        navigate('/home');
        toast.error('Error accessing media devices.');
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (localStream && !isInitiator && !peerConnectionRef.current) {
      // Create the RTCPeerConnection when the local stream is available
      createPeerConnection();
    }
  }, [localStream, isInitiator]);
  // handling events from the server
  useEffect(() => {
    const handleAnswer = (answer: RTCSessionDescriptionInit) => {
      console.log('Received Answer from Server:', answer);
      peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    };

    const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
      console.log('Received ICE Candidate from Server:', candidate);
      peerConnectionRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    };

    socket.on('AnswerFromServer', handleAnswer);
    socket.on('iceCandidateFromServer', handleIceCandidate);

    return () => {
      socket.off('AnswerFromServer', handleAnswer);
      socket.off('iceCandidateFromServer', handleIceCandidate);
    };
  }, []);

  const createPeerConnection = () => {
    try {
      let peerConfiguration: RTCConfiguration = {
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302',
            ],
          },
        ],
      };

      const peerConnection = new RTCPeerConnection(peerConfiguration);
      dataChannel = peerConnection.createDataChannel('metadata');
      dataChannel.onopen = () => {
        console.log('Data channel opened successfully..');
      };
      dataChannel.onclose = () => {
        console.log('Data channel closed successfully..');
      };
      dataChannel.onerror = (err) => {
        console.error('Data channel error : ', err);
      };
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to the peer connection
      localStream?.getTracks().forEach((track) => {
        console.log(
          `Adding track to peer connection: ${track.id} (${track.kind})`
        );
        peerConnectionRef.current?.addTrack(track, localStream);
      });

      // Event handlers for peer connection events

      // Handle incoming ice candidates
      peerConnectionRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          console.log('Sending ICE Candidate:', e.candidate);
          socket.emit('sendIceCandidateToSignalingServer', {
            iceCandidate: e.candidate,
            iceUserId: userId,
            didIOffer: true,
          });
        } else {
          console.log('ICE Candidate gathering completed.');
        }
        if (e.candidate) {
          socket.emit('sendIceCandidateToSignalingServer', {
            iceCandidate: e.candidate,
            iceUserId: userId,
            didIOffer: true,
          });
        }
      };

      // Handle changes in the connection state
      // Handle connection state changes with more detailed logging
      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log(
          'Connection state changed:',
          peerConnectionRef.current?.connectionState
        );
        // If connection is established, send metadata again to ensure it's received
        if (
          peerConnectionRef.current?.connectionState === 'connected' &&
          dataChannel?.readyState === 'open'
        ) {
          console.log(
            'Connection established, re-sending metadata to ensure receipt'
          );
          // This would need access to the metadata, which could be stored in state or context
        }
      };

      peerConnectionRef.current.oniceconnectionstatechange = () => {
        console.log(
          'ICE connection state:',
          peerConnectionRef.current?.iceConnectionState
        );
      };

      // Log signaling state changes
      peerConnectionRef.current.onsignalingstatechange = () => {
        console.log(
          'Signaling state:',
          peerConnectionRef.current?.signalingState
        );
      };
    } catch (error) {
      toast.error('Error creating peer connection');
    }
  };
  // Create offer and set it as the local description
  const createOffer = async () => {
    const offer = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(offer);
    setDidIOffer(true);
    if (offer)
      // Send the offer to the remote peer
      socket.emit('offer', { userId, newOffer: offer });
  };

  //registering the user on the signaling server

  useEffect(() => {
    if (userId) {
      socket.emit('register', { userId, clientType: 'client' });
    }
  }, [userId]);
  const initiateCall = () => {
    setIsInitiator(true);
    try {
      // Create the RTCPeerConnection and Data Channel when initiating the call
      createPeerConnection();
      createOffer();
    } catch (error) {
      toast.error('Error creating offer.');
    }
  };
  // Add this function to update track enablement when streaming status changes
  const updateTracksStatus = (enabled: boolean) => {
    if (localStream) {
      console.log(`${enabled ? 'Enabling' : 'Disabling'} local tracks`);
      localStream.getTracks().forEach((track) => {
        track.enabled = enabled;
        console.log(
          `Track ${track.id} (${track.kind}) enabled: ${track.enabled}`
        );
      });
    }
  };
  return {
    localStream,
    initiateCall,
    dataChannel,
    setLocalStream,
    peerConnectionRef,
    socket,
    updateTracksStatus,
  };
};
