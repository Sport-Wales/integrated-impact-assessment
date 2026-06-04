// src/utils/generateDocx.js
// Generates a Word document (.docx) from assessment formData.
// Uses the `docx` npm package — runs entirely in the browser.
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
} from 'docx';

// =============================================
// HELPERS
// =============================================

// Show value or fallback
const val = (v) => (v && typeof v === 'string' && v.trim()) ? v.trim() : 'Not provided';

// Yes/No radio display
const yesNo = (v) => v === 'yes' ? 'Yes' : 'No';

// Impact array display (e.g. ['positive', 'negative'] → 'Positive, Negative')
const impactLabel = (arr) => {
  if (!arr || arr.length === 0) return 'Neutral';
  return arr.map(i => i.charAt(0).toUpperCase() + i.slice(1)).join(', ');
};

// Shared table styles
const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// =============================================
// SECTION BUILDER — heading + label/value pairs
// =============================================
const buildSection = (title, fields) => {
  const children = [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(title)],
    }),
  ];
  for (const [label, value] of fields) {
    children.push(
      new Paragraph({
        spacing: { before: 120 },
        children: [new TextRun({ text: label, bold: true })],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun(val(value))],
      }),
    );
  }
  return children;
};

// =============================================
// FORM 1 — All 8 sections
// =============================================
const buildForm1Sections = (formData) => {
  const f = formData.form1 || {};
  const chars = f.impactOnProtectedCharacteristics || {};
  const wl = f.welshLanguage || {};
  const se = f.socioEconomicImpact || {};
  const env = f.environmentalImpact || {};

  const charLabels = {
    age: 'Age', disability: 'Disability', genderReassignment: 'Gender reassignment',
    marriageCivilPartnership: 'Marriage/civil partnership', pregnancyMaternity: 'Pregnancy/maternity',
    race: 'Race', religionBelief: 'Religion/belief', sex: 'Sex', sexualOrientation: 'Sexual orientation',
  };

  // Protected characteristics — table header row
  const headerRow = new TableRow({
    children: [
      ['Characteristic', 1800], ['Impact', 1500], ['Reason', 3000], ['Improvement', 3000],
    ].map(([text, w]) => new TableCell({
      borders, width: { size: w, type: WidthType.DXA }, margins: cellMargins,
      shading: { fill: '164B64', type: ShadingType.CLEAR },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20 })] })],
    })),
  });

  // Protected characteristics — data rows
  const charRows = Object.entries(charLabels).map(([key, label]) => {
    const c = chars[key] || { impact: ['neutral'], reason: '', improvement: '' };
    return new TableRow({
      children: [
        new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })] }),
        new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: impactLabel(c.impact), size: 20 })] })] }),
        new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: val(c.reason), size: 20 })] })] }),
        new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: val(c.improvement), size: 20 })] })] }),
      ],
    });
  });

  return [
    // Section 1 — Details
    ...buildSection('1. Details', [
      ['Assessment title', formData.title],
      ['Lead name', formData.leadName],
      ['Lead role', formData.leadRole],
      ['Others involved', formData.otherPeople],
      ['What is this work about?', formData.workDetails],
      ['Who will be affected?', f.affectedGroups],
    ]),
    // Section 2 — Understanding
    ...buildSection('2. Known Impacts and Strategies', [
      ['What do you already know?', f.existingKnowledge],
      ['Missing information?', yesNo(f.missingInfo)],
      ['How to find missing information', f.missingInfoDetails],
    ]),
    // Section 3 — People (table)
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3. People — Protected Characteristics')] }),
    new Table({
      width: { size: 9300, type: WidthType.DXA },
      columnWidths: [1800, 1500, 3000, 3000],
      rows: [headerRow, ...charRows],
    }),
    // Section 4 — Well-being
    ...buildSection('4. Well-being for Future Generations', [
      ['Response', f.wellBeingResponse],
    ]),
    // Section 5 — Welsh Language
    ...buildSection('5. Welsh Language', [
      ['Supports Welsh language?', yesNo(wl.supportWelshLanguage)],
      ['Harder for Welsh speakers?', yesNo(wl.hardForWelshSpeakers)],
      ['Improvements', wl.improvements],
      ['Positive impacts (policy)', wl.positiveImpact],
      ['Negative impacts (policy)', wl.negativeImpact],
      ['Neutral impacts (policy)', wl.neutralImpact],
      ['Increase positive effects', wl.increasePositiveEffects],
      ['Decrease adverse effects', wl.decreaseAdverseEffects],
    ]),
    // Section 6 — Socio-Economic
    ...buildSection('6. Socio-Economic Impact', [
      ['Helps people with fewer opportunities?', yesNo(se.helpPeopleWithFewerOpportunities)],
      ['How it helps', se.howItHelps],
      ['Makes things harder?', yesNo(se.makeThingsHarder)],
      ['Improvements', se.improvements],
    ]),
    // Section 7 — Environment
    ...buildSection('7. Environment and Biodiversity', [
      ['Helps nature/environment?', yesNo(env.helpNatureAndEnvironment)],
      ['How it helps', env.howItHelps],
      ['Could harm nature?', yesNo(env.harmNature)],
      ['Improvements', env.improvements],
    ]),
    // Section 8 — Actions
    ...buildSection('8. Actions and Next Steps', [
      ['Actions and next steps', f.actionsAndNextSteps],
      ['Review date', f.reviewDate || null],
      ['Responsible person', f.responsiblePerson],
    ]),
  ];
};

// =============================================
// FORM 2 — 2 sections (much simpler)
// =============================================
const buildForm2Sections = (formData) => {
  const f = formData.form2 || {};
  return [
    ...buildSection('1. About Your Project', [
      ['Assessment title', formData.title],
      ['Lead name', formData.leadName],
      ['Lead role', formData.leadRole],
      ['Others involved', formData.otherPeople],
      ['Work details', formData.workDetails],
    ]),
    ...buildSection('2. Your Assessment', [
      ['Impacts and actions', f.assessment],
    ]),
  ];
};

// =============================================
// MAIN EXPORT — build document and trigger download
// =============================================
export const downloadAssessmentDocx = async (formData) => {
  const isForm1 = formData.formType === 'form1';
  const typeLabel = isForm1 ? 'Full IIA' : 'Short IIA';

  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 36, bold: true, font: 'Arial', color: '164B64' },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 28, bold: true, font: 'Arial', color: '164B64' },
          paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
        },
      },
      children: [
        // Title
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun(formData.title || 'Untitled Assessment')],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: typeLabel, italics: true, color: '666666' })],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: `Status: ${formData.status || 'draft'}`, italics: true, color: '666666' })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString('en-GB')}`, italics: true, color: '666666' })],
        }),
        // Sections
        ...(isForm1 ? buildForm1Sections(formData) : buildForm2Sections(formData)),
      ],
    }],
  });

  // Generate blob and trigger download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(formData.title || 'assessment').replace(/[^a-zA-Z0-9 ]/g, '').trim()}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
