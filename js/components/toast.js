const Toast = {
  show(message, type = 'info') {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#2563eb'
    };

    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      padding: 12px 20px; border-radius: 10px; background: ${colors[type]};
      color: white; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.25s ease;
    `;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.25s'; setTimeout(() => el.remove(), 250); }, 2500);
  }
};
