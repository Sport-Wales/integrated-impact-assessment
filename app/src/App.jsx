// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import ScrollToTop from './components/ui/ScrollToTop';
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
import { FormProvider, useFormContext } from './context/FormContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// URL Assessment Loader — handles shared URLs with ?id= query parameter.
// When someone receives a link like /form1/step4?id=abc123, this component
// fetches the assessment from the DB and loads it into FormContext before
// the step component mounts. Without this, the step would see no active
// assessment and redirect to form-selection.
// Renders a loading screen while fetching. Redirects to workspace on error.
const UrlAssessmentLoader = ({ children }) => {
  const [searchParams] = useSearchParams();
  const { formData, loadAssessment } = useFormContext();
  const navigate = useNavigate();

  const urlId = searchParams.get('id');
  const needsLoad = urlId && formData.assessmentId !== urlId;
  const [loading, setLoading] = useState(!!needsLoad);

  useEffect(() => {
    if (!urlId || formData.assessmentId === urlId) return;

    const loadFromUrl = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getAssessment?id=${urlId}`);

        // 403 = assessment exists but user has no access — redirect with title for popup
        if (response.status === 403) {
          const data = await response.json().catch(() => ({}));
          navigate('/', {
            state: { accessDenied: true, assessmentTitle: data.title || 'this assessment' }
          });
          return;
        }

        // Any other error — silent redirect to workspace
        if (!response.ok) {
          navigate('/');
          return;
        }

        const data = await response.json();
        loadAssessment(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading assessment...</p>
      </div>
    );
  }

  return children;
};

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
          <ScrollToTop />
          <UrlAssessmentLoader>
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
          </UrlAssessmentLoader>
          </Router>
        </FormProvider>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
