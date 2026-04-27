type ErrorType = 'object' | 'string';

interface ErrorConfig {
  defaultMessage?: string;
  messageType?: ErrorType;
}

export const handleApiError = (
  error: any, 
  showError: (message: string, type: 'success' | 'error') => void,
  config: ErrorConfig = {}
) => {
  const { defaultMessage = 'An error occurred' } = config;

  if (typeof error === 'object' && error !== null) {
    // Get first error message from the error object
    const firstKey = Object.keys(error)[0];

    const firstError = error[firstKey];

    let errorMessage = '';

    //check if its a string 
    if (typeof firstError === 'string') {
      errorMessage = firstError;
    } else {
      errorMessage = error[firstKey]?.[0] || defaultMessage;
    }

    showError(errorMessage, 'error');
  } else {
    showError(error || defaultMessage, 'error');
  }
}; 
