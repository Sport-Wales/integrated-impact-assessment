import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useFormContext } from '../context/FormContext';

/**
 * Hook that ensures assessment ID (?id=) is always present in form step URLs.
 *
 * Three scenarios handled:
 * 1. URL has ?id= already (shared link) → does nothing
 * 2. URL missing ?id= but FormContext has assessmentId → silently corrects URL
 * 3. URL missing ?id= and no active assessment → redirects to landing page
 *
 * Also provides navigateWithId() which preserves the ID when moving between steps.
 * Reads ID from URL first, falls back to FormContext.assessmentId.
 */
export const usePreserveId = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = useFormContext();
  const urlId = searchParams.get('id');

  // Ensure ?id= is always present on form step URLs
  useEffect(() => {
    const isFormPath = /^\/form\d\/step\d+$/.test(location.pathname);
    if (!isFormPath || urlId) return;

    // No ?id= in URL — check FormContext for an active assessment
    if (formData.assessmentId) {
      // DB-backed assessment loaded: silently correct the URL
      navigate(`${location.pathname}?id=${formData.assessmentId}`, { replace: true });
      return;
    }

    // New unsaved assessment (formType set but no assessmentId yet): allow through.
    // The URL will be corrected once the assessment gets its first DB save.
    if (formData.formType) return;

    // No assessment context at all — bare URL typed directly: redirect to landing
    navigate('/');
  }, [urlId, location.pathname, navigate, formData.assessmentId, formData.formType]);

  // Navigate to a new path while preserving the assessment ID.
  // Reads from URL first, falls back to FormContext.
  const navigateWithId = (path) => {
    const id = urlId || formData.assessmentId;
    if (id) {
      navigate(`${path}?id=${id}`);
    } else {
      navigate(path);
    }
  };

  return { urlId, navigateWithId };
};
