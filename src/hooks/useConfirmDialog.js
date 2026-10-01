import { useCallback } from 'react';
import Swal from 'sweetalert2';

const iconMap = {
  warning: 'warning',
  danger: 'error',
  info: 'info',
};

const colorMap = {
  warning: '#f0ad4e',
  danger: '#d33',
  info: '#3085d6',
};

export const useConfirmDialog = () => {
  const confirm = useCallback(async ({
    title = 'Bạn có chắc chắn?',
    text = 'Hành động này không thể hoàn tác',
    confirmText = 'Đồng ý',
    cancelText = 'Hủy',
    type = 'warning',
  } = {}) => {
    const result = await Swal.fire({
      title,
      text,
      icon: iconMap[type],
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: colorMap[type],
      reverseButtons: true,
      focusCancel: true,
    });

    return result.isConfirmed;
  }, []);

  return { confirm };
};