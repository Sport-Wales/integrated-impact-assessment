// src/context/FormContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

// =============================================
// LOCALSTORAGE KEYS
// All localStorage access goes through these constants — never raw strings.
// =============================================
const LS_ASSESSMENTS_KEY = 'iia_assessments'; // object: { [localId]: formDataSnapshot }
const LS_ACTIVE_KEY      = 'iia_active';      // string: the localId currently being edited

// =============================================
// LOCALSTORAGE HELPERS
// Read/write the multi-assessment store.
// All callers get a full parsed object or safe defaults — never raw strings.
// =============================================

// Returns the full assessments store: { [localId]: formDataSnapshot }
const readAssessmentsStore = () => {
  try {
    const raw = localStorage.getItem(LS_ASSESSMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Writes one assessment snapshot into the store by its localId.
// Stamps lastSavedAt on every write so the workspace table can show a real "Last Edited" date.
const writeAssessmentToStore = (localId, snapshot) => {
  const store = readAssessmentsStore();
  store[localId] = { ...snapshot, lastSavedAt: new Date().toISOString() };
  localStorage.setItem(LS_ASSESSMENTS_KEY, JSON.stringify(store));
};

// Removes one entry from the store (used when a local-only entry is replaced by a DB-backed one).
const removeAssessmentFromStore = (localId) => {
  const store = readAssessmentsStore();
  delete store[localId];
  localStorage.setItem(LS_ASSESSMENTS_KEY, JSON.stringify(store));
};

// Returns the localId of the assessment currently being edited, or null.
const readActiveId = () => localStorage.getItem(LS_ACTIVE_KEY) || null;

// Sets which assessment is currently being edited.
const writeActiveId = (localId) => {
  if (localId) {
    localStorage.setItem(LS_ACTIVE_KEY, localId);
  } else {
    localStorage.removeItem(LS_ACTIVE_KEY);
  }
};

// Generates a unique local ID for a new unsaved assessment.
// Format: local_{timestamp}_{random} — guaranteed unique per session.
const generateLocalId = () =>
  `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;


// =============================================
// DEEP MERGE
// Recursively merges source into target.
// Arrays and primitives from source replace target (not merged element-by-element).
// This ensures new fields added to getInitialState() always survive when loading
// older localStorage data that predate those fields.
// =============================================
const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return source ?? target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};


export const FormProvider = ({ children }) => {

  // =============================================
  // INITIAL STATE TEMPLATE
  // Clean blank slate for a new assessment.
  // Separated from localStorage loading so it can always be called safely.
  // =============================================
  const getInitialState = () => ({

    // ===== METADATA — syncs with database columns =====
    assessmentId: null,   // UUID from DB. null = never been saved to DB yet.
    localId:      null,   // Our own key in the localStorage store (always set for active forms).
    status:       'draft',// 'draft' | 'complete' | 'signed_off'
    formType:     null,   // 'form1' | 'form2'
    userRole:     'owner',// 'owner' | 'edit' | 'view'
    createdAt:    null,   // ISO string — set once when assessment is first created locally.
    lastSavedAt:  null,   // ISO string — updated every time the snapshot is written to localStorage.

    completedSteps: { form1: [], form2: [] },

    // ===== COMMON FIELDS =====
    title:       '',
    leadName:    '',
    leadRole:    '',
    otherPeople: '',
    workDetails: '',

    // ===== FORM 1 SPECIFIC FIELDS =====
    form1: {
      affectedGroups:    '',
      existingKnowledge: '',
      missingInfo:       'no',
      missingInfoDetails:'',
      impactOnProtectedCharacteristics: {
        age:                     { impact: ['neutral'], reason: '', improvement: '' },
        disability:              { impact: ['neutral'], reason: '', improvement: '' },
        genderReassignment:      { impact: ['neutral'], reason: '', improvement: '' },
        marriageCivilPartnership:{ impact: ['neutral'], reason: '', improvement: '' },
        pregnancyMaternity:      { impact: ['neutral'], reason: '', improvement: '' },
        race:                    { impact: ['neutral'], reason: '', improvement: '' },
        religionBelief:          { impact: ['neutral'], reason: '', improvement: '' },
        sex:                     { impact: ['neutral'], reason: '', improvement: '' },
        sexualOrientation:       { impact: ['neutral'], reason: '', improvement: '' },
      },
      wellBeingResponse: '',
      welshLanguage: {
        supportWelshLanguage:   'no',
        hardForWelshSpeakers:   'no',
        improvements:           '',
        positiveImpact:         '',
        negativeImpact:         '',
        neutralImpact:          '',
        increasePositiveEffects:'',
        decreaseAdverseEffects: '',
      },
      socioEconomicImpact: {
        helpPeopleWithFewerOpportunities: 'yes',
        howItHelps:       '',
        makeThingsHarder: 'no',
        improvements:     '',
      },
      environmentalImpact: {
        helpNatureAndEnvironment: 'yes',
        howItHelps:   '',
        harmNature:   'no',
        improvements: '',
      },
      actionsAndNextSteps: '',
      reviewDate:          '',
      responsiblePerson:   '',
      finalReview:         '',
      unexpectedHappened:  '',
      needToChangeAnything:'',
    },

    // ===== FORM 2 SPECIFIC FIELDS =====
    form2: {
      assessment: '',
      review:     '',
    },
  });


  // =============================================
  // INITIAL LOAD
  // On app start: restore the last active assessment from the multi-assessment store.
  // If there was no active session, start blank.
  // =============================================
  const getStoredOrInitialState = () => {
    const activeId = readActiveId();
    if (activeId) {
      const store = readAssessmentsStore();
      const saved = store[activeId];
      if (saved) {
        // Deep-merge over fresh defaults so new fields always exist
        return deepMerge(getInitialState(), saved);
      }
    }
    return getInitialState();
  };

  const [formData, setFormData] = useState(getStoredOrInitialState);

  // =============================================
  // AUTO-PERSIST
  // Every time formData changes, write it into the multi-assessment store
  // under its localId. This keeps localStorage always in sync.
  // Only persists if a form is actually active (localId is set).
  // =============================================
  useEffect(() => {
    if (formData.localId) {
      writeAssessmentToStore(formData.localId, formData);
    }
  }, [formData]);

  // =============================================
  // CONTEXT METHODS
  // =============================================

  // Shallow-merge updates into top-level formData.
  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  // Update a specific nested section within a form type (e.g. form1.welshLanguage).
  const updateFormSection = (formType, section, data) => {
    setFormData(prevData => ({
      ...prevData,
      [formType]: { ...prevData[formType], [section]: data }
    }));
  };

  // Commit a step: merge this step's data AND mark it complete in ONE reducer
  // pass, then return the fully merged formData snapshot.
  //
  // WHY THIS EXISTS: step files previously did updateFormData() + completeStep()
  // then rebuilt the DB save payload from `formData` — but `formData` is a stale
  // render-time snapshot, so completedSteps was always one step behind in the DB.
  // commitStep returns the EXACT object that was stored so the caller can pass it
  // directly to apiService.saveAssessment() with no staleness.
  //
  // Capturing `snapshot` from inside the updater is safe here because commitStep
  // is only ever called from event handlers (handleNext / handleComplete), where
  // React runs the updater synchronously before setFormData returns.
  //
  // @param stepIndex   - step being completed (0-based)
  // @param updatedData - top-level fields to merge (e.g. { form1: {...} })
  // @returns the fully merged formData snapshot
  const commitStep = (stepIndex, updatedData) => {
    let snapshot;
    setFormData(prevData => {
      const ft = prevData.formType;
      const current = prevData.completedSteps?.[ft] || [];
      const newCompleted = current.includes(stepIndex)
        ? current
        : [...current, stepIndex].sort((a, b) => a - b);

      snapshot = {
        ...prevData,
        ...updatedData,
        completedSteps: ft
          ? { ...prevData.completedSteps, [ft]: newCompleted }
          : prevData.completedSteps,
      };
      return snapshot;
    });
    return snapshot;
  };


  // Called when the DB save succeeds and returns an assessmentId.
  // Updates FormContext with the real UUID and re-keys the localStorage entry:
  // - The old localId entry is removed
  // - A new entry is written under the assessmentId (the real DB key)
  // This prevents duplicates: subsequent saves will UPDATE (not INSERT) because
  // assessmentId is now set, and the localStorage entry uses the real ID as its key.
  //
  // Side effects are outside the setFormData updater — mirrors the pattern in
  // deleteLocalAssessment and startAssessment to avoid double-execution under
  // React Strict Mode. Safe because confirmDbSave is only ever called from async
  // DB callbacks (never during render), so formData is the current stable value.
  const confirmDbSave = (assessmentId) => {
    const oldLocalId = formData.localId;
    const updated = { ...formData, assessmentId, localId: assessmentId };

    // Side effects outside the updater ✓
    if (oldLocalId && oldLocalId !== assessmentId) {
      removeAssessmentFromStore(oldLocalId);
    }
    writeAssessmentToStore(assessmentId, updated);
    writeActiveId(assessmentId);

    setFormData(updated);
  };

  // Load an existing assessment from a database response OR a local-only snapshot.
  // Used by LandingPage when a user opens any assessment row.
  // For DB-backed rows: dbResponse.id is the real UUID.
  // For local-only rows: dbResponse.id is the localId (e.g. 'local_abc123'), assessmentId is null.
  // Spread order is critical: DB column values always override stale form_data values.
  const loadAssessment = (dbResponse) => {
    // For DB-backed rows: dbResponse.id is the real UUID — use it directly as assessmentId.
    // For local-only rows: dbResponse.id is the local_ prefixed key — assessmentId stays null.
    // We can't rely on form_data.assessmentId because saveAssessment strips it before storage.
    const isDbBacked = dbResponse.id && !String(dbResponse.id).startsWith('local_');
    const realAssessmentId = isDbBacked ? dbResponse.id : null;
    const activeLocalId = dbResponse.id;
    const loaded = {
      ...getInitialState(),
      ...dbResponse.form_data,
      assessmentId: realAssessmentId,
      localId:      activeLocalId,
      status:       dbResponse.status,
      formType:     dbResponse.form_type,
      userRole:     dbResponse.user_role || 'owner',
      completedSteps: dbResponse.form_data?.completedSteps || { form1: [], form2: [] },
    };
    writeAssessmentToStore(activeLocalId, loaded);
    writeActiveId(activeLocalId);
    setFormData(loaded);
  };

  // Start a brand-new blank assessment.
  // Assigns a fresh localId so it gets its own slot in the store.
  // Stamps createdAt once — this is the canonical creation time for local-only assessments.
  // Does NOT touch any other assessment in the store — they are preserved.
  const resetFormData = () => {
    const newLocalId = generateLocalId();
    const now = new Date().toISOString();
    const fresh = { ...getInitialState(), localId: newLocalId, createdAt: now, lastSavedAt: now };
    writeAssessmentToStore(newLocalId, fresh);
    writeActiveId(newLocalId);
    setFormData(fresh);
  };

  // Start (or resume) an assessment by setting its form type.
  // Called by FormSelection — the only place a form becomes "active" outside
  // of resetFormData() and loadAssessment().
  //
  // GUARANTEES the localStorage invariant: by the time formType is set, a
  // localId exists AND iia_active points to it. Closes the gap where a user
  // reaching /form-selection without "Start New" had no localId, so nothing
  // persisted and a page refresh could not resume their work.
  //
  // Side effects (writeActiveId) are outside the setFormData updater so the
  // reducer stays pure — safe under React Strict Mode double-invoke.
  // Mirrors the correct pattern used in deleteLocalAssessment.
  const startAssessment = (formType) => {
    const existingLocalId = formData.localId;

    if (existingLocalId) {
      // Active assessment already exists — keep it, just set the form type.
      writeActiveId(existingLocalId);              // side effect outside reducer ✓
      setFormData(prev => ({ ...prev, formType }));
      return;
    }

    // No active form — create a fresh local slot.
    const newLocalId = generateLocalId();
    const now = new Date().toISOString();
    writeActiveId(newLocalId);                     // side effect outside reducer ✓
    setFormData(() => ({
      ...getInitialState(),
      localId:     newLocalId,
      createdAt:   now,
      lastSavedAt: now,
      formType,
    }));
  };

  // Remove an assessment from localStorage entirely.
  // Side effects (localStorage writes) are intentionally outside the setFormData updater
  // to avoid calling them twice in React Strict Mode.
  // If the deleted localId is the one currently active in FormContext,
  // clear the active pointer and reset state to blank.
  const deleteLocalAssessment = (localId) => {
    // 1. Remove from the store immediately
    removeAssessmentFromStore(localId);

    // 2. If it was the active form, clear active pointer and reset to blank
    if (formData.localId === localId) {
      writeActiveId(null);
      setFormData(getInitialState());
    }
  };

  return (
    <FormContext.Provider value={{
      formData,
      updateFormData,
      updateFormSection,
      commitStep,
      startAssessment,
      confirmDbSave,
      loadAssessment,
      resetFormData,
      deleteLocalAssessment,
    }}>
      {children}
    </FormContext.Provider>
  );
};
