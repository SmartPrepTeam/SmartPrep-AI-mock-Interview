import { FileUpload } from './ui/FileUpload';

const ResumeUpload = () => {
  const handleFileUpload = (files: File[]) => {
    if (files.length > 1) console.log('You can upload only one resume');
    if (files[0].type !== 'application/pdf') {
      console.log('give resume in pdf format');
    }
  };
  //   check its format

  // if proper make call to backedn
  // if correct response , go to form with data
  return (
    <div>
      <div>Upload in pdf format</div>
      <div>
        <FileUpload onChange={handleFileUpload} />
      </div>
    </div>
  );
};

export default ResumeUpload;
