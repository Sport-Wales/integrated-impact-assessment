// src/pages/AssessmentDocument.jsx
// Full assessment report — renders all form answers in a clean read-only layout.
// Used in two modes:
//   1. Embedded in Form1/Step9 and Form2/Step3 (embedded={true}) — ProgressBar added by wrapper
//   2. Standalone via /assessment/:id/document route (embedded={false}) — includes own Share button
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { apiService } from '../services/api';
import { downloadAssessmentDocx } from '../utils/generateDocx';
import ShareButton from '../components/ui/ShareButton';

// =============================================
// HELPERS
// =============================================

// Display value or "Not provided" in grey
const Val = ({ v }) => {
  const text = (v && typeof v === 'string' && v.trim()) ? v.trim() : null;
  return text
    ? <p className="text-gray-800 whitespace-pre-wrap">{text}</p>
    : <p className="text-gray-400 italic">Not provided</p>;
};

const yesNo = (v) => v === 'yes' ? 'Yes' : 'No';

const impactLabel = (arr) => {
  if (!arr || arr.length === 0) return 'Neutral';
  return arr.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ');
};

// =============================================
// SUB-COMPONENTS
// =============================================

// Section wrapper with numbered heading
const Section = ({ number, title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold text-[--color-sw-blue] mb-4 border-b border-gray-200 pb-2">
      {number}. {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

// Label + Value row
const Field = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
    <Val v={value} />
  </div>
);

// Protected Characteristics table (Form 1 only)
const CharacteristicsTable = ({ data }) => {
  const chars = [
    ['age', 'Age'], ['disability', 'Disability'], ['genderReassignment', 'Gender reassignment'],
    ['marriageCivilPartnership', 'Marriage/civil partnership'], ['pregnancyMaternity', 'Pregnancy/maternity'],
    ['race', 'Race'], ['religionBelief', 'Religion/belief'], ['sex', 'Sex'],
    ['sexualOrientation', 'Sexual orientation'],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[--color-sw-blue] text-white">
            <th className="text-left px-3 py-2 border border-gray-300">Characteristic</th>
            <th className="text-left px-3 py-2 border border-gray-300">Impact</th>
            <th className="text-left px-3 py-2 border border-gray-300">Reason</th>
            <th className="text-left px-3 py-2 border border-gray-300">Improvement</th>
          </tr>
        </thead>
        <tbody>
          {chars.map(([key, label]) => {
            const c = data?.[key] || { impact: ['neutral'], reason: '', improvement: '' };
            return (
              <tr key={key} className="border-b border-gray-200">
                <td className="px-3 py-2 font-medium border border-gray-200">{label}</td>
                <td className="px-3 py-2 border border-gray-200">{impactLabel(c.impact)}</td>
                <td className="px-3 py-2 border border-gray-200">{c.reason?.trim() || <span className="text-gray-400 italic">Not provided</span>}</td>
                <td className="px-3 py-2 border border-gray-200">{c.improvement?.trim() || <span className="text-gray-400 italic">Not provided</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// =============================================
// FORM 1 REPORT — all 8 sections, all fields unconditional
// =============================================
const Form1Report = ({ formData }) => {
  const f = formData.form1 || {};
  const wl = f.welshLanguage || {};
  const se = f.socioEconomicImpact || {};
  const env = f.environmentalImpact || {};

  return (
    <>
      <Section number={1} title="Details">
        <Field label="Assessment title" value={formData.title} />
        <Field label="Lead name" value={formData.leadName} />
        <Field label="Lead role" value={formData.leadRole} />
        <Field label="Others involved" value={formData.otherPeople} />
        <Field label="What is this work about?" value={formData.workDetails} />
        <Field label="Who will be affected?" value={f.affectedGroups} />
      </Section>

      <Section number={2} title="Known Impacts and Strategies">
        <Field label="What do you already know?" value={f.existingKnowledge} />
        <Field label="Missing information?" value={yesNo(f.missingInfo)} />
        <Field label="How to find missing information" value={f.missingInfoDetails} />
      </Section>

      <Section number={3} title="People — Protected Characteristics">
        <CharacteristicsTable data={f.impactOnProtectedCharacteristics} />
      </Section>

      <Section number={4} title="Well-being for Future Generations">
        <Field label="Response" value={f.wellBeingResponse} />
      </Section>

      <Section number={5} title="Welsh Language">
        <Field label="Supports Welsh language?" value={yesNo(wl.supportWelshLanguage)} />
        <Field label="Harder for Welsh speakers?" value={yesNo(wl.hardForWelshSpeakers)} />
        <Field label="Improvements" value={wl.improvements} />
        <p className="text-sm font-semibold text-gray-500 mt-4">Policy-level impacts</p>
        <Field label="Positive impacts" value={wl.positiveImpact} />
        <Field label="Negative impacts" value={wl.negativeImpact} />
        <Field label="Neutral impacts" value={wl.neutralImpact} />
        <Field label="Increase positive effects" value={wl.increasePositiveEffects} />
        <Field label="Decrease adverse effects" value={wl.decreaseAdverseEffects} />
      </Section>

      <Section number={6} title="Socio-Economic Impact">
        <Field label="Helps people with fewer opportunities?" value={yesNo(se.helpPeopleWithFewerOpportunities)} />
        <Field label="How it helps" value={se.howItHelps} />
        <Field label="Makes things harder?" value={yesNo(se.makeThingsHarder)} />
        <Field label="Improvements" value={se.improvements} />
      </Section>

      <Section number={7} title="Environment and Biodiversity">
        <Field label="Helps nature/environment?" value={yesNo(env.helpNatureAndEnvironment)} />
        <Field label="How it helps" value={env.howItHelps} />
        <Field label="Could harm nature?" value={yesNo(env.harmNature)} />
        <Field label="Improvements" value={env.improvements} />
      </Section>

      <Section number={8} title="Actions and Next Steps">
        <Field label="Actions and next steps" value={f.actionsAndNextSteps} />
        <Field label="Review date" value={f.reviewDate || null} />
        <Field label="Responsible person" value={f.responsiblePerson} />
      </Section>
    </>
  );
};

// =============================================
// FORM 2 REPORT — 2 sections (simpler)
// =============================================
const Form2Report = ({ formData }) => {
  const f = formData.form2 || {};
  return (
    <>
      <Section number={1} title="About Your Project">
        <Field label="Assessment title" value={formData.title} />
        <Field label="Lead name" value={formData.leadName} />
        <Field label="Lead role" value={formData.leadRole} />
        <Field label="Others involved" value={formData.otherPeople} />
        <Field label="Work details" value={formData.workDetails} />
      </Section>

      <Section number={2} title="Your Assessment">
        <Field label="Impacts and actions" value={f.assessment} />
      </Section>
    </>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================
const AssessmentDocument = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  const [signingOff, setSigningOff]     = useState(false);
  const [signOffError, setSignOffError] = useState(null);
  const [downloading, setDownloading]   = useState(false);

  const isForm1     = formData.formType === 'form1';
  const isDraft     = formData.status === 'draft';
  const isSignedOff = formData.status === 'signed_off';
  const canSignOff  = !isSignedOff && !isDraft;
  const isOwner     = formData.userRole === 'owner';
  const typeLabel   = isForm1 ? 'Full Integrated Impact Assessment' : 'Short Integrated Impact Assessment';

  const handleSignOff = async () => {
    setSigningOff(true);
    setSignOffError(null);
    try {
      // 1. Write signed_off status directly to localStorage before navigating.
      // updateFormData triggers auto-persist via useEffect, but navigate() fires
      // in the same tick and unmounts the component before the effect can run.
      // Direct write guarantees the workspace sees the correct status immediately.
      const localId = formData.localId;
      if (localId) {
        try {
          const raw = localStorage.getItem('iia_assessments');
          const store = raw ? JSON.parse(raw) : {};
          if (store[localId]) {
            store[localId] = {
              ...store[localId],
              status: 'signed_off',
              lastSavedAt: new Date().toISOString(),
            };
            localStorage.setItem('iia_assessments', JSON.stringify(store));
          }
        } catch { /* safe to ignore — data is already persisted */ }
      }

      // 2. Also update FormContext in memory so any remaining renders are correct
      updateFormData({ status: 'signed_off' });

      // 3. Sync to DB if we have a real assessment ID — silent fail if unavailable
      if (formData.assessmentId) {
        try {
          await apiService.signOffAssessment(formData.assessmentId);
        } catch (err) {
          console.warn('[SignOff] DB sign-off failed. Status saved locally.', err.message);
        }
      }
    } catch {
      setSignOffError('Could not sign off. Please try again.');
    } finally {
      setSigningOff(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadAssessmentDocx(formData);
    } catch (err) {
      console.error('[Download] Word export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // ---- DRAFT: form not complete yet ----
  if (isDraft) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Assessment not complete</h2>
        <p className="text-gray-500 mb-6">
          Please complete all steps of the form before viewing the assessment document.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700 transition-colors duration-200"
        >
          ← Go back
        </button>
      </div>
    );
  }

  // ---- COMPLETE or SIGNED OFF: render full report ----
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Document header: title + action buttons */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[--color-sw-blue]">
            {formData.title || 'Untitled Assessment'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{typeLabel}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
              bg-white text-gray-700 border border-gray-300 hover:bg-gray-50
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {downloading ? 'Exporting...' : 'Download Report'}
          </button>
          {/* Share Report — always visible */}
          <ShareButton isOwner={isOwner} />
        </div>
      </div>

      {/* Signed-off banner */}
      {isSignedOff && (
        <div className="mb-6 p-4 bg-green-50  rounded">
          <p className="text-black-800 font-medium">
            This assessment has been signed off and is locked.
          </p>
        </div>
      )}

      {/* Report body — white card, document-like */}
      <div className="bg-white rounded-lg shadow p-8">
        {isForm1 ? <Form1Report formData={formData} /> : <Form2Report formData={formData} />}
      </div>

      {/* Sign off footer */}
      <div className="mt-8 flex justify-between items-center">
        {/* Back link — only on standalone route */}
        {!embedded ? (
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to My Assessments
          </button>
        ) : <div />}

        <div className="flex items-center gap-3">
          {signOffError && (
            <p className="text-sm text-red-600">{signOffError}</p>
          )}

          {isSignedOff ? (
            <span className="inline-flex items-center px-12 py-3 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-gray-400">
               Signed Off ✓
            </span>
          ) : canSignOff ? (
            <button
              onClick={handleSignOff}
              disabled={signingOff}
              className="inline-flex items-center px-12 py-3 rounded-md text-sm font-medium
                bg-green-600 text-white hover:bg-green-700
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {signingOff ? 'Signing off...' : 'Sign Off'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AssessmentDocument;
