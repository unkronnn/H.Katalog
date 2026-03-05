/**
 * Log error to console
 * @param error unknown
 * @return Promise<void>
 */
const log_error = async (error: unknown): Promise<void> => {
  try {
    const error_message     = error instanceof Error ? error.message : String(error);
    const error_stack       = error instanceof Error ? error.stack : 'No stack trace available';

    console.error('[ - ERROR_LOGGER - ] Error occurred:');
    console.error(`Message: ${error_message}`);
    console.error(`Stack: ${error_stack}`);

    // TODO: Add database logging or external error tracking service here
  } catch (logging_error) {
    console.error('[ - ERROR_LOGGER - ] Failed to log error:', logging_error);
  }
};

// - EXPORTS - \\

export {
  log_error
};
