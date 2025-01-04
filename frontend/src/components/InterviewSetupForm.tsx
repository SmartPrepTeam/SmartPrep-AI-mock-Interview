import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { Jobs } from '@/data';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { activePage } from '../features/activePageSlice';
import { setTextInterviewData } from '@/features/textInterviewSlice';
import { difficultyLevels, interviewLengths } from '@/data';
import InterviewLengthButton from './ui/InterviewLengthButton';
import axios from 'axios';
import MagicButton from './ui/MagicButton';
import { Signal, SignalHigh, SignalMedium } from 'lucide-react';
import { useGenerateQuestionsMutation } from '@/features/apiSlice';
export default function InterviewSetupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const { from, to } = useContext<NavigationBundle>(NavigationContext);
  //   console.log(from);
  //   console.log(to);
  // }, []);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const [generateQuestions, { isLoading, isError, error }] =
    useGenerateQuestionsMutation();
  const formik = useFormik({
    initialValues: {
      jobPosition: '',
      jobDescription: '',
      difficultyLevel: '',
      interviewLength: '',
    },
    validationSchema: Yup.object({
      jobPosition: Yup.string().required('Job position is required'),
      jobDescription: Yup.string().required('Job description is required'),
      difficultyLevel: Yup.string().required('Select a difficulty level'),
      interviewLength: Yup.string().required('Select interview length'),
    }),
    onSubmit: async (values) => {
      const interviewLength = parseInt(values.interviewLength.split(' ')[0]);

      console.log('Form submitted:', values.difficultyLevel);
      console.log('Form submitted:', values.jobPosition);
      console.log('Form submitted:', values.jobDescription);
      console.log('Form submitted:', interviewLength);

      const postData = {
        userID: userId,
        difficulty_level: values.difficultyLevel,
        job_title: values.jobPosition,
        job_description: values.jobDescription,
        no_of_questions: interviewLength,
        question_type: 'text',
      };

      try {
        const response = await generateQuestions(postData).unwrap();
        console.log(response);
        dispatch(
          setTextInterviewData({
            questions: response.data.data.data,
            interviewId: response.data.data.id,
          })
        );
        dispatch(activePage('quiz'));
        navigate('/textual-interview');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 500) {
            toast.error('Unable to parse the file');
          }
        } else {
          toast.error('Unexpected error occurred');
        }
      }
    },
  });

  type Job = {
    JobRole: string;
    JobDescription: string;
  };

  const handlePositionClick = (position: Job | undefined) => {
    formik.setFieldValue('jobPosition', position?.JobRole || '');
    formik.setFieldTouched('jobPosition', false);
    formik.setFieldValue('jobDescription', position?.JobDescription || '');
  };

  const handleDifficultyClick = (level: string) => {
    formik.setFieldValue('difficultyLevel', level);
    formik.setFieldTouched('difficultyLevel', false);
  };

  const handleInterviewLength = (length: string) => {
    formik.setFieldValue('interviewLength', length);
    formik.setFieldTouched('interviewLength', false);
  };
  if (isError)
    return toast.error(error.data?.message || 'Unknown Error occured');
  return (
    <div className="flex min-h-[70vh]">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col lg:flex-row w-full h-full items-stretch"
      >
        {/* Left Side (Displays Job position and Description) */}

        <div className="w-full lg:w-3/5 mb-4 lg:mb-0 lg:mr-4 h-full bg-[#10132E] flex flex-col flex-grow">
          <div className="shadow-custom rounded border border-gray-400 p-6 lg:p-10 flex-grow">
            <div className="mb-6">
              <p className="my-4">
                What's your job title?<span className="text-red-600">*</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-4 ">
                {Jobs.map((position, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`text-md bg-slate-950 text-white border border-white/[0.1] rounded-full py-2 px-4 transition duration-200 ease-in-out hover:bg-[#a9c6f5] hover:text-slate-950 ${
                      formik.values.jobPosition === position.JobRole &&
                      'bg-[#a9c6f5] text-slate-950 border-2 border-white-100' //bg color is not showing up
                    }`}
                    onClick={() => handlePositionClick(position)}
                  >
                    {position.JobRole}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="my-4">Enter custom role</p>
              <input
                type="text"
                name="jobPosition"
                placeholder="Enter custom job position"
                value={formik.values.jobPosition}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldTouched('jobPosition', false);
                }}
                onBlur={formik.handleBlur}
                className="w-full bg-slate-950 border border-white/[0.1] rounded-full py-2 px-4"
              />
              {formik.touched.jobPosition && formik.errors.jobPosition && (
                <p className="text-red-600 font-bold text-sm mt-2">
                  {formik.errors.jobPosition}
                </p>
              )}
            </div>
            <div className="mb-4">
              <p className="my-4">
                Tell us a little about your role.
                <span className="text-red-600">*</span>
              </p>
              <textarea
                name="jobDescription"
                placeholder="Paste your target job description here - our AI will generate practice questions for you."
                value={formik.values.jobDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-4 rounded-sm shadow-custom focus:outline-none focus:border-transparent text-sm md:text-lg font-light resize-none  bg-slate-950 border border-white/[0.1]"
                rows={5}
                maxLength={5000}
              />
              {formik.touched.jobDescription &&
                formik.errors.jobDescription && (
                  <p className="text-red-600 font-bold mt-2 text-sm">
                    {formik.errors.jobDescription}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Right Side (Display difficulty level and interview Length) */}

        <div className="w-full mb-4 lg:w-2/5 h-full bg-[#10132E] flex flex-col flex-grow">
          <div className="shadow-custom rounded border border-gray-400 flex-grow p-6 lg:p-10">
            <h3 className="text-xl md:text-2xl mb-6 mt-8 text-center">
              Choose Interview Length
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {interviewLengths.map((option) => (
                <InterviewLengthButton
                  key={option.label}
                  label={option.label}
                  description={option.description}
                  isActive={
                    formik.values.interviewLength === option.description
                  }
                  onClick={() => handleInterviewLength(option.description)}
                />
              ))}
            </div>

            {formik.touched.interviewLength &&
              formik.errors.interviewLength && (
                <p className="text-red-600 font-bold text-sm mt-2">
                  {formik.errors.interviewLength}
                </p>
              )}

            <h3 className="text-xl md:text-2xl mt-6 mb-4 text-center">
              Select Difficulty Level
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {difficultyLevels.map((level) => (
                <button
                  key={level.title}
                  type="button"
                  className={`flex-1 p-4 rounded-lg text-md text-left py-2 px-4 text-gray-800 transition duration-200 ease-in-out mt-2 hover:bg-[#a9c6f5] hover:text-slate-950 ${
                    formik.values.difficultyLevel === level.title
                      ? 'bg-[#a9c6f5] text-slate-950 border-2 border-white-100'
                      : 'bg-slate-950 text-white border border-white/[0.1]'
                  }`}
                  onClick={() => handleDifficultyClick(level.title)}
                >
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-1">
                      {level.title}
                    </h2>
                    <div className="flex justify-center items-center my-2 ">
                      {level.title === 'easy' && <SignalMedium />}
                      {level.title === 'medium' && <SignalHigh />}
                      {level.title === 'hard' && <Signal />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {formik.touched.difficultyLevel &&
              formik.errors.difficultyLevel && (
                <p className="text-red-500 font-bold text-sm mt-2">
                  {formik.errors.difficultyLevel}
                </p>
              )}

            <div className="flex justify-center mt-6">
              <button type="submit">
                <MagicButton
                  title="Continue"
                  position="right"
                  isLoading={isLoading}
                  isLoadingText="Generating Questions....."
                />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
