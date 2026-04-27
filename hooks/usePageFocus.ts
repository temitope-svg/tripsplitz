import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const usePageFocus = (callback: () => void) => {
  // Store the callback in a ref to maintain reference stability
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useFocusEffect(
    useCallback(() => {
      // Call the latest callback from the ref
      callbackRef.current();
    }, []) // Empty dependency array since we're using ref
  );
}; 