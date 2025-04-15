// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import FormSelection from './pages/FormSelection';
import FormIntroduction from './pages/FormIntroduction';

// Form 1 Components
import Form1Step1 from './pages/Form1/Step1';

// Form 2 Components
import Form2Step1 from './pages/Form2/Step1';

// Form 3 Components
import Form3Step1 from './pages/Form3/Step1';

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
              
              {/* Form 2 Routes */}
              <Route path="/form2/step1" element={<Form2Step1 />} />
              
              {/* Form 3 Routes */}
              <Route path="/form3/step1" element={<Form3Step1 />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FormProvider>
  );
}

export default App;