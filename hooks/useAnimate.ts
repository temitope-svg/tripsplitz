import { useLoadingAnimation } from '../components/LoadingAnimation';

export default function useAnimate() {
    const { showAnimation } = useLoadingAnimation();

    function showLoading(onComplete?: () => void) {
        showAnimation(onComplete);
    }

    return {
        showLoading
    };
} 