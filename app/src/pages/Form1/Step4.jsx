// src/pages/Form1/Step4.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form1Step4 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    socioEconomicImpact: formData.form1?.socioEconomicImpact || {
      helpPeopleWithFewerOpportunities: 'no',
      createProblems: 'no',
      improvements: '',
    }
  });

  // Redirect if form type is not set
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  const handleRadioChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      socioEconomicImpact: {
        ...prev.socioEconomicImpact,
        [field]: value
      }
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      socioEconomicImpact: {
        ...prev.socioEconomicImpact,
        [name]: value
      }
    }));
  };

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      form1: {
        ...formData.form1,
        socioEconomicImpact: formState.socioEconomicImpact
      }
    });

    // Navigate to the next step
    navigate('/form1/step5');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div className="bg-sw-red h-3 rounded-full" style={{ width: '44%' }}></div>
        </div>

        <div className="flex justify-between items-center mt-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              1
            </div>
            <div className="text-xs text-center">Basic Details</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              2
            </div>
            <div className="text-xs text-center">Understanding Impact</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              3
            </div>
            <div className="text-xs text-center">Impact on People</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sw-red flex items-center justify-center text-white text-sm mb-1">
              4
            </div>
            <div className="text-xs text-center">Socio-Economic</div>
          </div>
          {/* Additional steps would be displayed here */}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">
        Step 4: Socio-Economic Impact
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Will this help people who have fewer opportunities?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="helpYes"
                name="helpPeopleWithFewerOpportunities"
                value="yes"
                checked={formState.socioEconomicImpact.helpPeopleWithFewerOpportunities === 'yes'}
                onChange={() => handleRadioChange('helpPeopleWithFewerOpportunities', 'yes')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="helpYes" className="ml-2">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="helpNo"
                name="helpPeopleWithFewerOpportunities"
                value="no"
                checked={formState.socioEconomicImpact.helpPeopleWithFewerOpportunities === 'no'}
                onChange={() => handleRadioChange('helpPeopleWithFewerOpportunities', 'no')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="helpNo" className="ml-2">No</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Could this create problems for them?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="problemsYes"
                name="createProblems"
                value="yes"
                checked={formState.socioEconomicImpact.createProblems === 'yes'}
                onChange={() => handleRadioChange('createProblems', 'yes')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="problemsYes" className="ml-2">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="problemsNo"
                name="createProblems"
                value="no"
                checked={formState.socioEconomicImpact.createProblems === 'no'}
                onChange={() => handleRadioChange('createProblems', 'no')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="problemsNo" className="ml-2">No</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="improvements" className="block text-lg font-semibold mb-2">
            What can we do to improve things?
          </label>
          <textarea
            id="improvements"
            name="improvements"
            value={formState.socioEconomicImpact.improvements}
            onChange={handleTextChange}
            className="input-field w-full"
            rows={4}
            placeholder="Describe how your work could improve socio-economic opportunities or address inequalities"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step3" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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
  );
};

export default Form1Step4;