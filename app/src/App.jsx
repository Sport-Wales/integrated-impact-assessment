// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import IntroPage from './pages/IntroPage';
import FormSelection from './pages/FormSelection';
import AssessmentDocument from './pages/AssessmentDocument';
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
import Form1Step9  from './pages/Form1/Step9';
import Form1Step10 from './pages/Form1/Step10';

// Form 2 Components
import Form2Step1 from './pages/Form2/Step1';
import Form2Step2 from './pages/Form2/Step2';
import Form2Step3 from './pages/Form2/Step3';
import Form2Step4 from './pages/Form2/Step4';

// Context Providers
import { FormProvider } from './context/FormContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth gate — sits inside AuthProvider so it can read auth state.
// Local mock auth: shows spinner while resolving, then LoginPage card if not authenticated.
// Azure real auth: shows background image while checking auth, redirects to Microsoft if not logged in.
// IMPORTANT: During loading on Azure, we render the background image directly — NOT LoginPage.
// Mounting LoginPage during loading would fire its useEffect redirect and cause a redirect loop.
const AuthGate = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

  if (loading) {
    if (useMockAuth) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[--color-sw-blue]">
          <p className="text-white text-lg">Loading...</p>
        </div>
      );
    }
    // Azure — show ONLY the background image while /.auth/me resolves.
    // Do NOT mount LoginPage here — its useEffect would trigger a redirect loop.
    return (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/login_image.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
    );
  }

  // Only reaches here when loading = false — we KNOW the auth state.
  if (!isAuthenticated) {
    return <LoginPage />;  // Safe — useEffect redirect fires only when confirmed not logged in
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <FormProvider>
          <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/intro" element={<IntroPage />} />
                <Route path="/form-selection" element={<FormSelection />} />
                <Route path="/form-introduction" element={<FormIntroduction />} />
                <Route path="/assessment/:id/document" element={<AssessmentDocument />} />
                
                {/* Form 1 Routes */}
                <Route path="/form1/step1" element={<Form1Step1 />} />
                <Route path="/form1/step2" element={<Form1Step2 />} />
                <Route path="/form1/step3" element={<Form1Step3 />} />
                <Route path="/form1/step4" element={<Form1Step4 />} />
                <Route path="/form1/step5" element={<Form1Step5 />} />
                <Route path="/form1/step6" element={<Form1Step6 />} />
                <Route path="/form1/step7" element={<Form1Step7 />} />
                <Route path="/form1/step8" element={<Form1Step8 />} />
                <Route path="/form1/step9"  element={<Form1Step9 />} />
                <Route path="/form1/step10" element={<Form1Step10 />} />
                
                {/* Form 2 Routes */}
                <Route path="/form2/step1" element={<Form2Step1 />} />
                <Route path="/form2/step2" element={<Form2Step2 />} />
                <Route path="/form2/step3" element={<Form2Step3 />} />
                <Route path="/form2/step4" element={<Form2Step4 />} />
              </Routes>
            </main>
          </div>
          </Router>
        </FormProvider>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
