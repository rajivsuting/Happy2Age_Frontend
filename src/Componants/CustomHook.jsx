import { useEffect } from 'react';

const usePreventScrollOnNumberInput = () => {
  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement.type === 'number' && document.activeElement.classList.contains('noscroll')) {
        document.activeElement.blur();
      }
    };

    document.addEventListener('wheel', handleWheel);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);
};

export default usePreventScrollOnNumberInput;
