# Sport Wales Integrated Impact Assessment Portal

A comprehensive web-based application for conducting Integrated Impact Assessments (IIA) at Sport Wales. This tool helps assess the impact of projects, policies, and initiatives across multiple dimensions including equality, well-being, socio-economic factors, environmental impact, and Welsh language support.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Design System](#design-system)
- [Form Types](#form-types)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Documentation](#documentation)

## Overview

The Integrated Impact Assessment Portal provides a structured, user-friendly interface for Sport Wales staff to evaluate the potential impacts of their work across seven key areas:

1. **People** - Protected characteristics and equality (Equality Act 2010)
2. **Long-term** - Well-being of Future Generations (Wales) Act
3. **Welsh Language** - Welsh Language Standards
4. **Socio-Economic** - Socio-economic Duty
5. **Environment & Biodiversity** - Environmental impact assessment
6. **Actions** - Implementation planning and review
7. **Review** - Post-implementation evaluation

## Features

### Core Functionality
- **Multi-form system**: Three different assessment types (Full IIA, Medium IIA, Short IIA)
- **Progressive form completion**: Step-by-step guided process with progress tracking
- **Persistent state**: Form data saved to localStorage with auto-save
- **Conditional logic**: Dynamic form fields based on user responses
- **Responsive design**: Mobile-first approach with tablet and desktop optimization
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support

### Form Features
- Collapsible information sections for experienced users
- Contextual help and guidance throughout
- Links to supporting resources and past assessments
- Review date setting for future follow-up
- Protected characteristics impact assessment
- Welsh language policy compliance questions

## Technology Stack

### Frontend Framework
- **React 18.3+** - Component-based UI framework
- **Vite 7.2+** - Build tool and dev server (HMR enabled)
- **React Router 6.x** - Client-side routing

### Styling
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Custom CSS Variables** - Sport Wales brand colors and design tokens
- **PostCSS** - CSS processing and optimization

### State Management
- **React Context API** - Global form state management
- **localStorage** - Client-side persistence
- **Custom hooks** - Reusable state logic

### Development Tools
- **ESLint** - Code linting
- **Vite Plugin React** - Fast refresh and JSX support

## Project Structure

```
integrated-impact-assessment/
├── public/
│   ├── fonts/                    # Objektiv MK1 font files
│   │   ├── ObjektivMk1-Regular.woff2
│   │   ├── ObjektivMk1-Bold.woff2
│   │   └── ObjektivMk1-XBold.woff2
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   └── Header.jsx
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── NextButton.jsx
│   │   │   ├── PrevButton.jsx
│   │   │   └── ProgressBar.jsx
│   │   └── ProgressBar.jsx      # Main progress indicator
│   │
│   ├── context/
│   │   └── FormContext.jsx      # Global state management
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx      # Home/intro page
│   │   ├── FormSelection.jsx    # Form type selection
│   │   ├── FormIntroduction.jsx # Pre-form guidance
│   │   ├── Form1/               # Full IIA (9 steps)
│   │   │   ├── Step1.jsx        # Basic details
│   │   │   ├── Step2.jsx        # Known impacts
│   │   │   ├── Step3.jsx        # Protected characteristics
│   │   │   ├── Step4.jsx        # Well-being goals
│   │   │   ├── Step5.jsx        # Welsh language
│   │   │   ├── Step6.jsx        # Socio-economic
│   │   │   ├── Step7.jsx        # Environment
│   │   │   ├── Step8.jsx        # Actions & next steps
│   │   │   ├── Step9.jsx        # Review
│   │   │   └── constants.jsx    # Form1 configuration
│   │   ├── Form2/               # Medium IIA (7 steps)
│   │   │   ├── Step1.jsx
│   │   │   ├── Step2.jsx
│   │   │   └── ...
│   │   └── Form3/               # Short IIA (3 steps)
│   │       ├── Step1.jsx
│   │       ├── Step2.jsx
│   │       └── Step3.jsx
│   │
│   ├── styles/
│   │   └── index.css            # Global styles & CSS variables
│   │
│   ├── App.jsx                  # Main app component & routing
│   └── main.jsx                 # Entry point
│
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies
├── netlify.toml                # Netlify deployment config
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/integrated-impact-assessment.git
   cd integrated-impact-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Development

### Environment Setup

The application uses Vite's environment variable system. Create a `.env` file in the root directory:

```env
# Development
VITE_APP_TITLE=Sport Wales IIA
VITE_API_URL=http://localhost:3000/api
```

### Adding New Form Steps

1. **Create step component** in appropriate form folder (e.g., `src/pages/Form1/Step10.jsx`)

2. **Update form constants** in `constants.jsx`:
   ```javascript
   export const form1Steps = [
     // ... existing steps
     { id: 'newstep', title: 'New Step', description: 'Description' }
   ];
   ```

3. **Add route** in `App.jsx`:
   ```javascript
   <Route path="/form1/step10" element={<Form1Step10 />} />
   ```

4. **Update FormContext** if new data fields are needed:
   ```javascript
   form1: {
     // ... existing fields
     newStepData: {
       field1: '',
       field2: ''
     }
   }
   ```

### Creating Custom Components

Follow the Sport Wales design system when creating new components:

```jsx
// Example: Custom button component
import React from 'react';

const CustomButton = ({ label, onClick, variant = 'primary' }) => {
  const baseClasses = 'sw-button';
  const variantClasses = variant === 'primary' 
    ? 'sw-button-primary' 
    : 'sw-button-secondary';

  return (
    <button 
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CustomButton;
```

## Design System

### Brand Colors

The application uses Sport Wales brand colors defined in CSS custom properties:

```css
:root {
  /* Primary Brand Colors */
  --color-sw-red: #E32434;
  --color-sw-yellow: #F6B207;
  --color-sw-blue: #164B64;
  --color-sw-green: #299D91;

  /* Neutral Colors */
  --color-black: #000000;
  --color-grey: #BFBEC5;
  --color-light-grey: #F4F5F7;
  --color-white: #FFFFFF;
}
```

### Typography

- **Primary Font**: Objektiv MK1 (Regular, Bold, XBold)
- **Fallback Font**: Montserrat
- **System Fallback**: Arial

### Component Classes

Use predefined component classes for consistency:

```css
.sw-button          /* Base button */
.sw-button-primary  /* Primary action button (red) */
.sw-button-secondary /* Secondary action button (blue) */
.sw-input           /* Form input fields */
.sw-label           /* Form labels */
.sw-checkbox        /* Checkbox inputs */
.sw-card            /* Card container */
.sw-notice          /* Notice/alert box */
.sw-highlight       /* Highlighted content */
```

### Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px   // Small devices
md: 768px   // Medium devices (not commonly used)
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

## Form Types

### Form 1: Full Integrated Impact Assessment
**Use case**: Required for Sport Wales Board papers and significant projects

**Steps**:
1. Basic details (title, lead, description)
2. Known impacts and existing knowledge
3. Protected characteristics assessment (9 characteristics)
4. Well-being goals and ways of working
5. Welsh language impact (with policy questions)
6. Socio-economic impact
7. Environment and biodiversity
8. Actions and next steps
9. Final review

**Data structure**:
```javascript
form1: {
  affectedGroups: string,
  existingKnowledge: string,
  impactOnProtectedCharacteristics: {
    age: { impact: array, reason: string, improvement: string },
    // ... 8 more characteristics
  },
  welshLanguage: {
    supportWelshLanguage: string,
    positiveImpact: string,
    // ... 5 more fields
  },
  // ... other sections
}
```

### Form 2: Medium Integrated Impact Assessment
**Use case**: Significant work affecting public duties (not for Board)

**Steps**:
1. Project details
2. Impact assessment
3. Final review

### Form 3: Short Integrated Impact Assessment
**Use case**: Community impact without affecting public duties

**Steps**:
1. Project overview
2. Community impact
3. Summary

## State Management

### FormContext

The application uses React Context API for global state management:

```javascript
// Accessing form data
const { formData, updateFormData, completeStep, resetFormData } = useFormContext();

// Updating form data
updateFormData({
  form1: {
    ...formData.form1,
    newField: 'value'
  }
});

// Marking step complete
completeStep(stepIndex);

// Resetting all form data
resetFormData();
```

### localStorage Persistence

Form data is automatically saved to localStorage on every change:

```javascript
// Saved key
localStorage.getItem('formData')

// Data structure
{
  formType: 'form1' | 'form2' | 'form3',
  completedSteps: {
    form1: [0, 1, 2],
    form2: [],
    form3: []
  },
  title: string,
  // ... all form fields
}
```

## Deployment

### Netlify Deployment

The project is configured for Netlify deployment:

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deployment Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Test production build locally**:
   ```bash
   npm run preview
   ```

3. **Deploy to Netlify**:
   - Connect GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy!

### Continuous Deployment

Netlify automatically deploys when changes are pushed to the main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Environment Variables (Netlify)

Set production environment variables in Netlify dashboard:
- Go to Site settings → Environment variables
- Add your production variables

## Contributing

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use descriptive variable names
- Add comments for complex logic
- Keep components focused and single-purpose

### Naming Conventions

- **Components**: PascalCase (e.g., `FormIntroduction.jsx`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **CSS Classes**: kebab-case with `sw-` prefix (e.g., `sw-button-primary`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_STEPS`)

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create pull request
5. After review, merge to main

### Common Issues

**Issue**: Vite plugin peer dependency conflict
```bash
# Solution
npm install -D @vitejs/plugin-react@latest
npm uninstall @vitejs/plugin-react-swc
```

**Issue**: Page not loading after navigation
```bash
# Check for:
1. Missing component imports (PrevButton, NextButton)
2. Typos in route paths
3. Console errors in browser DevTools
```

**Issue**: Styles not applying
```bash
# Ensure:
1. CSS custom properties are defined in index.css
2. Tailwind directives are included
3. Component classes use correct syntax
```

## Documentation

### External Resources
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Netlify Deployment](https://docs.netlify.com/)

### Legal & Compliance
- [Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents)
- [Well-being of Future Generations (Wales) Act 2015](https://www.futuregenerations.wales/)
- [Welsh Language Standards](https://www.welshlanguagecommissioner.wales/)


## License

This project is proprietary and confidential. All rights reserved by Sport Wales.

© 2025 Sport Wales. All rights reserved.