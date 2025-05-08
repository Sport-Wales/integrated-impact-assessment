import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form3Step2 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();


const [formState, setFormState] = useState({
  assessment: formData.form3?.assessment || '',
});

useEffect(() => {
  if(!formData.formType) {
    navigate('/form-selection');
  }
}, [formData.formType, navigate]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormState(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleNext = () => {
  updateFormData({
    form3: {
      ...formData.form3,
      assessment: formState.assessment,
    }
  });

  navigate('/form3/step3');
};

return (
  <div className="max-w-4xl mx-auto px-4 py-12">

    <h2 className="text-3xl font-bold mb-8">
      Step 2: Your Assessment
    </h2>

    <div className="space-y-6">
      <div>
        <label htmlFor="assessment" className="block text-lg font-semibold mb-2">
          In this section you should explain any positive or negative impact you believe your work will achieve, and any actions you will take.
        </label>
        <textarea
          id="assessment"
          name="assessment"
          value={formState.assessment}
          onChange={handleChange}
          className="input-field w-full my-4"
          rows={3}
        />
      </div>

      
      <div className="mt-12 flex justify-between">
        <Link to="/form3/step1" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
          Prev
        </Link>
        <button
          className="inline-flex items-center px-6 py-1 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  </div>
);
};

export default Form3Step2;