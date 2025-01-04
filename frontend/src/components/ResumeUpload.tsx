import { FileUpload } from './ui/FileUpload';
import { useState } from 'react';
import MagicButton from './ui/MagicButton';
import { TypewriterEffect } from './ui/TypewriterEffect';
import { words } from '@/data';
import { Upload } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUploadResumeMutation } from '@/features/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setToken } from '@/features/authSlice';
const ResumeUpload = () => {
  const navigate = useNavigate();
  const user_id = useSelector((state: RootState) => state.auth.userId);
  const [resume, setResume] = useState<File | null>();
  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error('File size exceeds 5MB.');
      return;
    }
    setResume(file);
  };
  const [uploadResume, { isLoading }] = useUploadResumeMutation();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!resume) {
      toast.error('Please provide the resume');
      return;
    }
    if (!user_id) {
      toast.error('You are not logged in');
      dispatch(setToken(null));
      return;
    }
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('user_id', user_id);
    try {
      const response = await uploadResume(formData);
      navigate('/add-profile', { state: { userData: response.data.data } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          toast.error('Unable to parse the file');
        }
      } else {
        toast.error('Unexpected error occurred');
      }
    }
  };
  return (
    <div className="text-white md:px-16 bg-black-100 h-screen w-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 md:px-20 h-full flex flex-col justify-center items-center text-xl md:text-base">
        <TypewriterEffect words={words} />
        <p className="mt-3">Join SmartPrep today</p>
      </div>
      <div className="w-full lg:w-1/2 px-10 lg-px-2 xl-px-30 h-full flex flex-col justify-center items-center">
        <FileUpload onChange={handleFileUpload} />
        <button onClick={handleSubmit} className="mt-2">
          <MagicButton
            title="Upload Resume"
            position="left"
            isLoading={isLoading}
            isLoadingText="Uploading...."
            icon={<Upload />}
          />
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
