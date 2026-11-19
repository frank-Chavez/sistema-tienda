// Avisos cortos (toasts). Un solo archivo para toda la app:
// antes cada página tenía su propia copia de esta función.

const COLORS = {
  info: '#4c1d95',
  success: '#2f7a4f',
  warning: '#b7791f',
  error: '#b42318',
};

export function showToast(message, type = 'info', duration = 3200) {
  if (typeof window === 'undefined') return;

  let container = document.getElementById('global-toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    container.className = 'toast-stack';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.backgroundColor = COLORS[type] || COLORS.info;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-in'));

  let timeout;
  const hide = () => {
    clearTimeout(timeout);
    toast.classList.remove('toast-in');
    setTimeout(() => {
      toast.remove();
      if (container && container.childElementCount === 0) container.remove();
    }, 220);
  };

  timeout = setTimeout(hide, duration);
  toast.addEventListener('mouseenter', () => clearTimeout(timeout));
  toast.addEventListener('mouseleave', () => {
    timeout = setTimeout(hide, 1200);
  });
  toast.addEventListener('click', hide);

  return { close: hide };
}
