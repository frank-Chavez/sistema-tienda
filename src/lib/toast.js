export function showToast(message, type = 'info', duration = 3200) {
  if (typeof window === 'undefined') return;

  let container = document.getElementById('global-toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = 9999;
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '0.5rem';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.minWidth = '240px';
  toast.style.padding = '12px 14px';
  toast.style.borderRadius = '10px';
  toast.style.color = '#ffffff';
  toast.style.boxShadow = '0 8px 22px rgba(0, 0, 0, 0.16)';
  toast.style.fontSize = '0.9rem';
  toast.style.fontWeight = '600';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(20px)';
  toast.style.transition = 'opacity 220ms ease, transform 220ms ease';

  let backgroundColor = '#06b6d4'; // info
  if (type === 'success') backgroundColor = '#10b981';
  if (type === 'warning') backgroundColor = '#f59e0b';
  if (type === 'error') backgroundColor = '#ef4444';

  toast.style.backgroundColor = backgroundColor;
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  const hide = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
      if (container && container.childElementCount === 0) {
        container.parentElement?.removeChild(container);
      }
    }, 220);
  };

  const timeout = setTimeout(hide, duration);

  toast.addEventListener('mouseenter', () => clearTimeout(timeout));
  toast.addEventListener('mouseleave', () => setTimeout(hide, 1200));

  return { close: hide };
}
