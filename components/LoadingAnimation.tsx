import React, { useEffect, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { createContext, useContext } from 'react';

const { width, height } = Dimensions.get('window');

interface AnimationState {
  isVisible: boolean;
  onComplete?: () => void;
}

let showAnimationFunction: (onComplete?: () => void) => void;
let hideAnimationFunction: () => void;

const LoadingAnimationComponent = () => {
  const [animation, setAnimation] = React.useState<AnimationState>({
    isVisible: false
  });
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    showAnimationFunction = (onComplete?: () => void) => {
      setAnimation({ isVisible: true, onComplete });
    };
    hideAnimationFunction = () => {
      setAnimation({ isVisible: false });
    };
  }, []);

  useEffect(() => {
    if (animation.isVisible && lottieRef.current) {
      lottieRef.current.reset();
      lottieRef.current.play();
    }
  }, [animation.isVisible]);

  if (!animation.isVisible) return null;

  return (
    <View
      className="absolute inset-0 flex items-center justify-center bg-white dark:bg-[#292C33] z-50"
      style={{ width, height }}>
      <LottieView
        ref={lottieRef}
        source={require('../assets/loading.json')}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
        onAnimationFinish={() => {
          hideAnimationFunction();
          animation.onComplete?.();
        }}
      />
    </View>
  );
};

const LoadingAnimationContext = createContext<{
  showAnimation: (onComplete?: () => void) => void;
}>({
  showAnimation: () => {},
});

export const useLoadingAnimation = () => useContext(LoadingAnimationContext);

export const LoadingAnimationProvider = ({ children }: { children: React.ReactNode }) => {
  const showAnimation = (onComplete?: () => void) => {
    if (showAnimationFunction) {
      showAnimationFunction(onComplete);
    }
  };

  return (
    <LoadingAnimationContext.Provider value={{ showAnimation }}>
      {children}
      <LoadingAnimationComponent />
    </LoadingAnimationContext.Provider>
  );
}; 