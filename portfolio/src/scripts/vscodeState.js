class VSCodeState {
  private tabs: Array<{id: string, name: string, active: boolean}> = [];
  private activeFileId: string | null = null;

  init() {
    this.setupFileExplorer();
    this.setupWelcomeScreen();
    this.setupKeyboardShortcuts();
    this.setupFolderToggle();
    
    // Show welcome screen by default
    this.showWelcomeScreen();
  }

  private setupFileExplorer() {
    document.querySelectorAll<HTMLElement>('[data-file-id]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const fileId = item.getAttribute('data-file-id');
        if (fileId) this.openFile(fileId);
      });
    });
  }

  private setupWelcomeScreen() {
    document.querySelectorAll<HTMLElement>('#welcome-screen [data-file-id]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const fileId = link.getAttribute('data-file-id');
        if (fileId) this.openFile(fileId);
      });
    });
  }

  private setupFolderToggle() {
    const folderHeader = document.querySelector<HTMLElement>('#folder-0xdps .folder-header');
    if (folderHeader) {
      folderHeader.addEventListener('click', () => {
        const folder = document.getElementById('folder-0xdps');
        folder?.classList.toggle('open');
      });
    }
  }

  private setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        if (this.activeFileId) {
          this.closeTab(this.activeFileId);
        }
      }
    });
  }

  openFile(fileId: string) {
    // Hide welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) welcomeScreen.style.display = 'none';

    // Show editor
    const editor = document.getElementById('editor');
    if (editor) editor.style.display = 'flex';

    // Update tabs
    this.tabs.forEach(t => t.active = false);
    const existingTab = this.tabs.find(t => t.id === fileId);
    
    if (existingTab) {
      existingTab.active = true;
    } else {
      const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
      const fileName = fileElement?.textContent?.trim() || fileId;
      this.tabs.push({ id: fileId, name: fileName, active: true });
    }

    this.activeFileId = fileId;
    this.renderTabs();
    this.updateActivePane();
    this.updateSidebarActive();
    this.updateTitleBar();
  }

  closeTab(fileId: string) {
    const tabIndex = this.tabs.findIndex(t => t.id === fileId);
    if (tabIndex === -1) return;

    const wasActive = this.tabs[tabIndex].active;
    this.tabs.splice(tabIndex, 1);

    if (wasActive && this.tabs.length > 0) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      this.tabs[newActiveIndex].active = true;
      this.activeFileId = this.tabs[newActiveIndex].id;
    } else if (this.tabs.length === 0) {
      this.activeFileId = null;
      this.showWelcomeScreen();
    }

    this.renderTabs();
    this.updateActivePane();
    this.updateSidebarActive();
    this.updateTitleBar();
  }

  private showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const editor = document.getElementById('editor');
    
    if (welcomeScreen) welcomeScreen.style.display = 'flex';
    if (editor) editor.style.display = 'none';
  }

  private renderTabs() {
    const tabList = document.getElementById('tab-list');
    if (!tabList) return;

    tabList.innerHTML = '';

    this.tabs.forEach(tab => {
      const tabEl = document.createElement('div');
      tabEl.className = `tab-item ${tab.active ? 'active' : ''}`;
      tabEl.innerHTML = `
        <span class="tab-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </span>
        <span class="tab-name">${tab.name}</span>
        <button class="tab-close" aria-label="Close ${tab.name}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;

      // Tab click
      tabEl.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.tab-close')) return;
        this.activateTab(tab.id);
      });

      // Close button
      const closeBtn = tabEl.querySelector('.tab-close');
      closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeTab(tab.id);
      });

      tabList.appendChild(tabEl);
    });
  }

  private activateTab(fileId: string) {
    this.tabs.forEach(t => t.active = false);
    const tab = this.tabs.find(t => t.id === fileId);
    if (tab) {
      tab.active = true;
      this.activeFileId = fileId;
      this.renderTabs();
      this.updateActivePane();
      this.updateSidebarActive();
      this.updateTitleBar();
    }
  }

  private updateActivePane() {
    document.querySelectorAll<HTMLElement>('.editor-pane').forEach(pane => {
      pane.style.display = 'none';
      pane.classList.remove('active');
    });

    if (this.activeFileId) {
      const activePane = document.querySelector<HTMLElement>(`.editor-pane[data-pane-id="${this.activeFileId}"]`);
      if (activePane) {
        activePane.style.display = 'flex';
        activePane.classList.add('active');
      }
    }
  }

  private updateSidebarActive() {
    document.querySelectorAll<HTMLElement>('.file-item').forEach(item => {
      item.classList.remove('active');
    });

    if (this.activeFileId) {
      const activeFile = document.querySelector<HTMLElement>(`.file-item[data-file-id="${this.activeFileId}"]`);
      activeFile?.classList.add('active');
    }
  }

  private updateTitleBar() {
    const titleElement = document.getElementById('titlebar-filename');
    if (titleElement) {
      if (this.activeFileId) {
        const activeTab = this.tabs.find(t => t.active);
        titleElement.textContent = activeTab?.name || 'Untitled';
      } else {
        titleElement.textContent = 'Welcome';
      }
    }
  }
}

// Initialize VS Code when DOM is ready
const vscode = new VSCodeState();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => vscode.init());
} else {
  vscode.init();
}

export { vscode };