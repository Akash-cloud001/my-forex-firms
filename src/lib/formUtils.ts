// Utility functions for form handling

/**
 * Prevents form submission on Enter key press
 * @param e - Keyboard event
 */
export const preventEnterSubmit = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};
