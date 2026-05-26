// src/components/layout/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormContext } from '../../context/FormContext';
import SaveButton from '../ui/SaveButton';
import ShareButton from '../ui/ShareButton';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { formData } = useFormContext();

  // Determine which page we're on
  const isOnLandingPage = location.pathname === '/';
  const isInForm = location.pathname.startsWith('/form1') || 
                   location.pathname.startsWith('/form2');

  // These are pre-form pages — form type selected but no data entered yet, so Save is hidden.
  const isPreForm = location.pathname === '/form-selection' ||
                    location.pathname === '/form-introduction';

  // userRole is set in FormContext: 'owner' for new/own assessments,
  // 'edit' or 'view' for shared ones (set by loadAssessment from DB response).
  const isOwner = formData.userRole === 'owner';

  // Save button is only shown when the user can actually make changes:
  // hidden for view-only users and for signed-off assessments (locked forever).
  const canSave = formData.userRole !== 'view' && formData.status !== 'signed_off';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/images/sport-wales-logo.svg" 
              alt="Sport Wales" 
              className="h-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjx0ZXh0IHg9IjEwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRTMyNDM0Ij5TcG9ydCBXYWxlczwvdGV4dD48L3N2Zz4=';
              }}
            />
          </Link>
          <Link to="/" className="ml-4 text-xl font-bold text-sw-blue hover:opacity-80 transition-opacity duration-200">
            Integrated Impact Assessment
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {/* Landing page — show login/logout */}
          {isOnLandingPage && isAuthenticated && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user?.userDetails || 'User'}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Log out
              </button>
            </div>
          )}

          {isOnLandingPage && !isAuthenticated && (
            <button
              onClick={login}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-[--color-sw-blue] text-white font-medium hover:bg-cyan-700 transition-colors duration-200"
            >
              Log in
            </button>
          )}

          {/* Pre-form pages (selection/introduction) — show Share only, no Save */}
          {isPreForm && (
            <ShareButton isOwner={isOwner} />
          )}

          {/* Form pages — show Save and Share */}
          {isInForm && (
            <>
              {canSave && <SaveButton />}
              <ShareButton isOwner={isOwner} />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
