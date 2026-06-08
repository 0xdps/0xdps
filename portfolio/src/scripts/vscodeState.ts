import { portfolioFiles } from '../data/portfolioFiles';

interface Tab {
  id: string;
  name: string;
  active: boolean;
  unsaved: boolean;
}

class VSCodeState {
  private tabs: Tab[] = [];
  private quickOpenVisible = false;
  private activeFileId: string | null = null;
  private mobileSidebarOpen = false;

  init() {
    this.setupFileExplorer();
    this.setupWelcomeScreen();
    this.setupKeyboardShortcuts();
    this.setupFolderToggle();
    this.setupQuickOpen();
    this.setupMobileSidebar();
    this.showWelcomeScreen();
  }

  private setupFileExplorer() {
    document.querySelectorAll<HTMLElement>('[data-file-id]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const fileId = item.getAttribute('data-file-id');
        if (fileId) this.openFile(fileId);
      });

      // Add keyboard support
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const fileId = item.getAttribute('data-file-id');
          if (fileId) this.openFile(fileId);
        }
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

  // ─── Mobile Sidebar ────────────────────────────────────────────────────────
  private setupMobileSidebar() {
    const explorerBtn = document.querySelector<HTMLElement>('.activity-item[data-view="explorer"]');
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!explorerBtn || !sidebar || !backdrop) return;

    const isMobile = () => window.innerWidth <= 560;

    const openSidebar = () => {
      sidebar.classList.add('mobile-open');
      backdrop.classList.add('visible');
      backdrop.style.display = 'block';
      explorerBtn.setAttribute('aria-expanded', 'true');
      this.mobileSidebarOpen = true;
    };

    const closeSidebar = () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('visible');
      backdrop.style.display = 'none';
      explorerBtn.setAttribute('aria-expanded', 'false');
      this.mobileSidebarOpen = false;
    };

    explorerBtn.addEventListener('click', () => {
      if (!isMobile()) return;
      this.mobileSidebarOpen ? closeSidebar() : openSidebar();
    });

    backdrop.addEventListener('click', closeSidebar);

    // Close when screen grows past mobile breakpoint
    window.addEventListener('resize', () => {
      if (!isMobile() && this.mobileSidebarOpen) closeSidebar();
    });
  }

  private closeMobileSidebar() {
    if (!this.mobileSidebarOpen) return;
    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const explorerBtn = document.querySelector<HTMLElement>('.activity-item[data-view="explorer"]');
    sidebar?.classList.remove('mobile-open');
    if (backdrop) { backdrop.classList.remove('visible'); backdrop.style.display = 'none'; }
    explorerBtn?.setAttribute('aria-expanded', 'false');
    this.mobileSidebarOpen = false;
  }

  private setupFolderToggle() {
    const folderHeader = document.querySelector<HTMLElement>('.folder-header');
    if (folderHeader) {
      folderHeader.addEventListener('click', () => {
        const sidebarContent = document.querySelector('.sidebar-content');
        const fileItems = sidebarContent?.querySelectorAll('.file-item');
        fileItems?.forEach(item => {
          (item as HTMLElement).classList.toggle('hidden');
        });
        folderHeader.classList.toggle('collapsed');
      });

      folderHeader.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const sidebarContent = document.querySelector('.sidebar-content');
          const fileItems = sidebarContent?.querySelectorAll('.file-item');
          fileItems?.forEach(item => {
            (item as HTMLElement).classList.toggle('hidden');
          });
          folderHeader.classList.toggle('collapsed');
        }
      });
    }
  }

  private setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        if (this.activeFileId) this.closeTab(this.activeFileId);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        this.toggleQuickOpen();
      }
      if (e.key === 'Escape' && this.quickOpenVisible) {
        this.hideQuickOpen();
      }
    });
  }

  // ─── Cmd+P Quick Open ─────────────────────────────────────────────────────
  private setupQuickOpen() {
    const overlay = document.getElementById('quick-open-overlay');
    const input = document.getElementById('quick-open-input') as HTMLInputElement | null;
    const results = document.getElementById('quick-open-results');
    if (!overlay || !input || !results) return;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.hideQuickOpen();
    });

    input.addEventListener('input', () => this.renderQuickOpenResults(input.value));

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { this.hideQuickOpen(); return; }
      const items = results.querySelectorAll<HTMLElement>('.qo-item');
      const focused = results.querySelector<HTMLElement>('.qo-item.focused');
      if (e.key === 'Enter') {
        const fileId = focused?.getAttribute('data-file-id');
        if (fileId) { this.openFile(fileId); this.hideQuickOpen(); }
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        let idx = focused ? Array.from(items).indexOf(focused) : -1;
        idx = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
        focused?.classList.remove('focused');
        items[idx].classList.add('focused');
        items[idx].scrollIntoView({ block: 'nearest' });
      }
    });
  }

  private toggleQuickOpen() {
    this.quickOpenVisible ? this.hideQuickOpen() : this.showQuickOpen();
  }

  private showQuickOpen() {
    const overlay = document.getElementById('quick-open-overlay');
    const input = document.getElementById('quick-open-input') as HTMLInputElement | null;
    if (!overlay || !input) return;
    overlay.classList.add('visible');
    this.quickOpenVisible = true;
    input.value = '';
    this.renderQuickOpenResults('');
    requestAnimationFrame(() => input.focus());
  }

  private hideQuickOpen() {
    document.getElementById('quick-open-overlay')?.classList.remove('visible');
    this.quickOpenVisible = false;
  }

  private renderQuickOpenResults(query: string) {
    const results = document.getElementById('quick-open-results');
    if (!results) return;
    const q = query.toLowerCase();
    const filtered = q
      ? portfolioFiles.filter(f => f.name.toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q))
      : portfolioFiles;

    results.innerHTML = filtered.map((f, i) => `
      <button class="qo-item${i === 0 ? ' focused' : ''}" data-file-id="${f.id}">
        ${f.icon === 'pdf' ? `
          <svg class="qo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M9 13h6M9 17h3M9 9h1"/>
          </svg>
        ` : `
          <svg class="qo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        `}
        <span class="qo-name">${f.name}</span>
        <span class="qo-desc">${f.description || ''}</span>
      </button>
    `).join('');

    results.querySelectorAll<HTMLElement>('.qo-item').forEach(item => {
      item.addEventListener('click', () => {
        const fileId = item.getAttribute('data-file-id');
        if (fileId) { this.openFile(fileId); this.hideQuickOpen(); }
      });
      item.addEventListener('mouseenter', () => {
        results.querySelector('.qo-item.focused')?.classList.remove('focused');
        item.classList.add('focused');
      });
    });
  }

  // ─── Open / Close ─────────────────────────────────────────────────────────
  openFile(fileId: string) {
    this.closeMobileSidebar();

    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) welcomeScreen.style.display = 'none';

    const editor = document.getElementById('editor');
    if (editor) editor.style.display = 'flex';

    this.tabs.forEach(t => t.active = false);
    const existingTab = this.tabs.find(t => t.id === fileId);

    if (existingTab) {
      existingTab.active = true;
    } else {
      const file = portfolioFiles.find(f => f.id === fileId);
      this.tabs.push({ id: fileId, name: file?.name || fileId, active: true, unsaved: true });
      // Simulate auto-save after 2 s
      setTimeout(() => {
        const tab = this.tabs.find(t => t.id === fileId);
        if (tab) { tab.unsaved = false; this.renderTabs(); }
      }, 2000);
    }

    this.activeFileId = fileId;
    this.renderTabs();
    this.updateActivePane();
    this.updateSidebarActive();
    this.updateTitleBar();
    this.setupScrollTracking();
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
    const titleElement = document.getElementById('titlebar-filename');
    if (titleElement) titleElement.textContent = 'Welcome';
    const statusPos = document.getElementById('status-position');
    if (statusPos) statusPos.textContent = 'Ln 1, Col 1';
  }

  // ─── Tab rendering ─────────────────────────────────────────────────────────
  private renderTabs() {
    const tabList = document.getElementById('tab-list');
    if (!tabList) return;
    tabList.innerHTML = '';

    this.tabs.forEach(tab => {
      const isPdf = tab.id === 'resume';
      const tabEl = document.createElement('div');
      tabEl.className = `tab-item${tab.active ? ' active' : ''}`;
      tabEl.innerHTML = `
        <span class="tab-icon">
          ${isPdf ? `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M9 13h6M9 17h3M9 9h1"/>
            </svg>
          ` : `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          `}
        </span>
        <span class="tab-name">${tab.name}</span>
        ${tab.unsaved ? '<span class="tab-dot" title="Unsaved">●</span>' : ''}
        <button class="tab-close" aria-label="Close ${tab.name}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;

      // Left-click: activate
      tabEl.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.tab-close')) return;
        this.activateTab(tab.id);
      });
      // Middle-click: close
      tabEl.addEventListener('auxclick', (e) => {
        if (e.button === 1) { e.preventDefault(); this.closeTab(tab.id); }
      });
      // Close button
      tabEl.querySelector('.tab-close')?.addEventListener('click', (e) => {
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
      this.setupScrollTracking();
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
        void activePane.offsetWidth; // force reflow so fade re-triggers
        activePane.classList.add('active');
        activePane.scrollTop = 0;
      }
    }
  }

  private updateSidebarActive() {
    document.querySelectorAll<HTMLElement>('.file-item').forEach(item => item.classList.remove('active'));

    if (this.activeFileId) {
      const activeFile = document.querySelector<HTMLElement>(`.file-item[data-file-id="${this.activeFileId}"]`);
      if (activeFile) {
        activeFile.classList.add('active');
        activeFile.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  private updateTitleBar() {
    const titleElement = document.getElementById('titlebar-filename');
    if (titleElement) {
      const activeTab = this.tabs.find(t => t.active);
      titleElement.textContent = activeTab?.name || 'Welcome';
    }
  }

  // ─── Status bar scroll tracking ──────────────────────────────────────────
  private setupScrollTracking() {
    const pane = document.querySelector<HTMLElement>(`.editor-pane[data-pane-id="${this.activeFileId}"]`);
    const statusPos = document.getElementById('status-position');
    if (!pane || !statusPos) return;

    const old = (pane as any)._scrollHandler;
    if (old) pane.removeEventListener('scroll', old);

    const handler = () => {
      const line = Math.floor(pane.scrollTop / 22) + 1;
      statusPos.textContent = `Ln ${line}, Col 1`;
    };
    (pane as any)._scrollHandler = handler;
    pane.addEventListener('scroll', handler, { passive: true });
    handler();
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
