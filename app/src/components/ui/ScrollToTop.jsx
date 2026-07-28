// src/components/ui/ScrollToTop.jsx
// React Router keeps scroll position across client-side navigations by default.
// Without this, clicking "Next" on a long form step leaves the next page
// scrolled to wherever the previous page was — usually the bottom.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
