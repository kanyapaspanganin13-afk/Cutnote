const BarberDashboard = {
  currentTab: 'records',

  render() {
    return `
      <div class="dashboard-container">
        ${Navbar.render('BARBER', this.currentTab)}
        <main class="content-area" id="barber-content">
          ${this.renderTabContent()}
        </main>
      </div>
    `;
  },

  renderTabContent() {
    switch (this.currentTab) {
      case 'records': return BarberRecords.render();
      case 'reports': return BarberReports.render();
      case 'account': return BarberAccount.render();
      case 'holidays': return BarberHolidays.render();
      case 'settings': return SettingsPage.render('BARBER');
      default: return BarberRecords.render();
    }
  },

  bindEvents() {
    Navbar.bindEvents();
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentTab = e.target.dataset.tab;
        document.getElementById('barber-content').innerHTML = this.renderTabContent();
        this.bindTabEvents();
      });
    });
    this.bindTabEvents();
  },

  bindTabEvents() {
    switch (this.currentTab) {
      case 'records': BarberRecords.bindEvents(); break;
      case 'reports': BarberReports.bindEvents(); break;
      case 'account': BarberAccount.bindEvents(); break;
      case 'holidays': BarberHolidays.bindEvents(); break;
      case 'settings': SettingsPage.bindEvents(); break;
    }
  }
};
