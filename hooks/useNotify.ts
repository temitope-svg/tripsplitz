import { useNotification } from '../components/Notification';

export default function useNotify() {
    const { showNotification } = useNotification();

    function showSnackBar(message: string, type: 'success' | 'error' = 'error') {
        showNotification(message, type);
    }

    return {
        showSnackBar
    };
} 