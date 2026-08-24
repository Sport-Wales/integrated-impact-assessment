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
              src="https://raw.githubusercontent.com/Sport-Wales/sport-wales-design-assets/main/logos/Sport_Wales_Logo_Red.png"
              alt="Sport Wales"
              className="h-16 w-auto"
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
			<>
				<button
					onClick={logout}
					className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
				>
					Log out
				</button>
				<ShareButton isOwner={isOwner} />
			</>
			
          )}

          {/* Form pages — show Save and Share */}
          {isInForm && (
            <>
				<button
					onClick={logout}
					className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
				>
					Log out
				</button>
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
