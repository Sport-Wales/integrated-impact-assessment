// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import FormSelection from './pages/FormSelection';
import FormIntroduction from './pages/FormIntroduction';

// Form 1 Components
import Form1Step1 from './pages/Form1/Step1';
import Form1Step2 from './pages/Form1/Step2';
import Form1Step3 from './pages/Form1/Step3';
import Form1Step4 from './pages/Form1/Step4';
import Form1Step5 from './pages/Form1/Step5';
import Form1Step6 from './pages/Form1/Step6';
import Form1Step7 from './pages/Form1/Step7';
import Form1Step8 from './pages/Form1/Step8';
import Form1Step9 from './pages/Form1/Step9';

// Form 2 Components
import Form2Step1 from './pages/Form2/Step1';

// Form 3 Components
import Form3Step1 from './pages/Form3/Step1';
import Form3Step2 from './pages/Form3/Step2';
import Form3Step3 from './pages/Form3/Step3';

// Context Provider
import { FormProvider } from './context/FormContext';

function App() {
  return (
    <FormProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/form-selection" element={<FormSelection />} />
              <Route path="/form-introduction" element={<FormIntroduction />} />
              
              {/* Form 1 Routes */}
              <Route path="/form1/step1" element={<Form1Step1 />} />
			  <Route path="/form1/step2" element={<Form1Step2 />} />
			  <Route path="/form1/step3" element={<Form1Step3 />} />
			  <Route path="/form1/step4" element={<Form1Step4 />} />
			  <Route path="/form1/step5" element={<Form1Step5 />} />
			  <Route path="/form1/step6" element={<Form1Step6 />} />
			  <Route path="/form1/step7" element={<Form1Step7 />} />
			  <Route path="/form1/step8" element={<Form1Step8 />} />
			  <Route path="/form1/step9" element={<Form1Step9 />} />
			  
              {/* Form 2 Routes */}
              <Route path="/form2/step1" element={<Form2Step1 />} />
              
              {/* Form 3 Routes */}
              <Route path="/form3/step1" element={<Form3Step1 />} />
              <Route path="/form3/step2" element={<Form3Step2 />} />
              <Route path="/form3/step3" element={<Form3Step3 />} />

            </Routes>
          </main>
        </div>
      </Router>
    </FormProvider>
  );
}

export default App;