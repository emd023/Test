import React from 'react';
import { useNavigate } from 'react-router-dom';
import DraftUpload from '../components/DraftUpload';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (draftId: number) => {
    navigate(`/drafts/${draftId}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <DraftUpload onSuccess={handleUploadSuccess} />
    </div>
  );
};

export default UploadPage;