import Swal from 'sweetalert2';
import { logger } from './logger';

/**
 * Display an error message to the user
 */
export function showErrorMessage(message: string, title: string = '❌ Error'): void {
  logger.error('User-facing error displayed', { message, title });
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#e74c3c'
  });
}

/**
 * Display a success message to the user
 */
export function showSuccessMessage(message: string, title: string = '✅ Éxito'): void {
  logger.info('User-facing success displayed', { message, title });
  Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#27ae60'
  });
}

/**
 * Display a warning message to the user
 */
export function showWarningMessage(message: string, title: string = '⚠️ Advertencia'): void {
  logger.warn('User-facing warning displayed', { message, title });
  Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonColor: '#f39c12'
  });
}

/**
 * Display a confirmation dialog
 */
export async function showConfirmDialog(
  message: string,
  title: string = '¿Estás seguro?',
  confirmText: string = 'Sí, confirmar',
  cancelText: string = 'Cancelar'
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  });
  return result.isConfirmed;
}
