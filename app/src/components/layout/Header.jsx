// src/components/layout/Header.jsx
import { Link } from 'react-router-dom';
import SaveButton from '../ui/SaveButton';
import ShareButton from '../ui/ShareButton';

const Header = () => {
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
          <h1 className="ml-4 text-xl font-bold text-sw-blue">
            Integrated Impact Assessment
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <SaveButton/>
		  <ShareButton/>
        </div>
      </div>
    </header>
  );
};

export default Header;