// src/pages/AssessmentDocument.jsx
// Formatted one-page view of a completed assessment.
// Full implementation in Task F5.
import { useParams, useNavigate } from 'react-router-dom';

const AssessmentDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to My Assessments
      </button>
      <p className="text-gray-500">Assessment document view coming soon. (ID: {id})</p>
    </div>
  );
};

export default AssessmentDocument;
