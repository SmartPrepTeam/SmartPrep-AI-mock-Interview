import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDeleteIncompleteInterviewMutation } from '@/features/apiSlice';
import { useWebRTC } from '@/hooks/use-webrtc';

const useBackButtonHandler = (question_id: string, user_id: string | null) => {
  const { cleanUpConnection, dataChannel } = useWebRTC();
  const [deleteIncompleteInterviewMutation] =
    useDeleteIncompleteInterviewMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const performCleanup = async () => {
      try {
        if (dataChannel?.readyState === 'open') {
          dataChannel.send(
            JSON.stringify({
              type: 'termination',
              user_id,
              interview_id: question_id,
            })
          );
        }
        await deleteIncompleteInterviewMutation({
          question_id,
          user_id,
        }).unwrap();

        const disconnected = cleanUpConnection();
        if (!disconnected) {
          toast.error('Connection may still be alive');
        }

        toast.error('Interview Terminated');
        navigate('/home');
      } catch (err) {
        toast.error(err?.data?.message || 'Error terminating interview');
      }
    };

    // Handle back button via popstate
    const handlePopState = (e: PopStateEvent) => {
      // Push state again to stay on the page
      window.history.pushState(null, '', window.location.href);

      // Show confirmation dialog
      const confirmLeave = window.confirm(
        'Are you sure you want to leave? This will terminate the interview.'
      );

      if (confirmLeave) {
        performCleanup();
      }
    };

    // Handle tab close/refresh via beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.returnValue = 'Changes you made may not be saved.';
      return 'Are you sure you want to leave?';
    };

    // Create history entry to trap back button
    window.history.pushState(null, '', window.location.href);

    // Add both event listeners
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    deleteIncompleteInterviewMutation,
    question_id,
    user_id,
    navigate,
    cleanUpConnection,
  ]);
};

export default useBackButtonHandler;
