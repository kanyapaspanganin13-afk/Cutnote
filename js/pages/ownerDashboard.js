const OwnerDashboard = {
  currentTab: 'records',

  render() {
    return `
      <div class="dashboard-container">
        ${Navbar.render('OWNER', this.currentTab)}
        <main class="content-area" id="owner-content">
          ${this.renderTabContent()}
        </main>
      </div>
    `;
  },

  renderTabContent() {
    switch (this.currentTab) {
      case 'records': return OwnerRecords.render();
      case 'reports': return OwnerReports.render();
      case 'settings': return SettingsPage.render('OWNER');
      default: return OwnerRecords.render();
    }
  },

  bindEvents() {
    Navbar.bindEvents();
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentTab = e.target.dataset.tab;
        document.getElementById('owner-content').innerHTML = this.renderTabContent();
        this.bindTabEvents();
      });
    });
    this.bindTabEvents();
  },

  bindTabEvents() {
    if (this.currentTab === 'records') OwnerRecords.bindEvents();
    if (this.currentTab === 'reports') OwnerReports.bindEvents();
    if (this.currentTab === 'settings') SettingsPage.bindEvents();
  }
};
