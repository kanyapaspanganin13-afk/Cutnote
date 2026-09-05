const App = {
  init() {
    Store.init();
    this.applyTheme();
    this.route();
  },

  route() {
    const mode = Store.getMode();
    const app = document.getElementById('app');

    if (!mode) {
      app.innerHTML = ModeSelect.render();
      ModeSelect.bindEvents();
      return;
    }

    if (mode === 'OWNER') {
      app.innerHTML = OwnerDashboard.render();
      OwnerDashboard.bindEvents();
    } else if (mode === 'BARBER') {
      app.innerHTML = BarberDashboard.render();
      BarberDashboard.bindEvents();
    }
  },

  applyTheme() {
    document.documentElement.setAttribute('data-theme', Store.settings.theme || 'light');
  },

  switchMode() {
    Store.setMode(null);
    this.route();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
