import { portfolioFiles, getFileById } from '../data/portfolioFiles';

interface TabState {
  id: string;
  name: string;
  active: boolean;
}

let tabs: TabState[] = [];
let activeTabId: string | null = null;

export function initVSCode() {
  setupFileExplorer();
  setupWelcomeScreen();
  setupKeyboardShortcuts();
  setupFolderToggle();

  // Open README by default
  openFile('readme');
}

function setupFileExplorer() {
  const fileItems = document.querySelectorAll<HTMLElement>('[data-file-id]');
  fileItems.forEach(item => {
    item.addEventListener('click', () => {
      const fileId = item.getAttribute('data-file-id');
      if (fileId) openFile(fileId);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const fileId = item.getAttribute('data-file-id');
        if (fileId) openFile(fileId);
      }
    });
  });
}

function setupWelcomeScreen() {
  const welcomeLinks = document.querySelectorAll<HTMLElement>('#welcome-screen [data-file-id]');
  welcomeLinks.forEach(link => {
    link.addEventListener('click', () => {
      const fileId = link.getAttribute('data-file-id');
      if (fileId) openFile(fileId);
    });
  });
}

function setupFolderToggle() {
  const folderHeader = document.querySelector<HTMLElement>('#folder-0xdps .folder-header');
  if (folderHeader) {
    folderHeader.addEventListener('click', () => {
      const folder = document.getElementById('folder-0xdps');
      folder?.classList.toggle('open');
    });
  }
}

export function openFile(fileId: string) {
  const file = getFileById(fileId);
  if (!file) return;

  // Hide welcome screen
  const welcomeScreen = document.getElementById('welcome-screen');
  if (welcomeScreen) {
    welcomeScreen.style.display = 'none';
  }

  // Show editor
  const editor = document.getElementById('editor');
  if (editor) {
    editor.style.display = 'flex';
  }

  // Update active tab
  tabs.forEach(t => t.active = false);

  const existingTab = tabs.find(t => t.id === fileId);
  if (existingTab) {
    existingTab.active = true;
  } else {
    tabs.push({ id: fileId, name: file.name, active: true });
  }

  activeTabId = fileId;

  // Update UI
  renderTabs();
  updateActivePane();
  updateSidebarActive();
  updateTitleBar();
}

export function closeTab(fileId: string) {
  const tabIndex = tabs.findIndex(t => t.id === fileId);
  if (tabIndex === -1) return;

  const wasActive = tabs[tabIndex].active;
  tabs.splice(tabIndex, 1);

  if (wasActive && tabs.length > 0) {
    // Activate the tab to the left, or the first one
    const newActiveIndex = Math.max(0, tabIndex - 1);
    tabs[newActiveIndex].active = true;
    activeTabId = tabs[newActiveIndex].id;
  } else if (tabs.length === 0) {
    activeTabId = null;
    showWelcomeScreen();
  }

  renderTabs();
  updateActivePane();
  updateSidebarActive();
  updateTitleBar();
}

function showWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const editor = document.getElementById('editor');

  if (welcomeScreen) welcomeScreen.style.display = 'flex';
  if (editor) editor.style.display = 'none';
}

function renderTabs() {
  const tabList = document.getElementById('tab-list');
  if (!tabList) return;

  tabList.innerHTML = '';

  tabs.forEach(tab => {
    const tabEl = document.createElement('div');
    tabEl.className = `tab-item ${tab.active ? 'active' : ''}`;
    tabEl.setAttribute('data-tab-id', tab.id);
    tabEl.innerHTML = `
      <span class="tab-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </span>
      <span class="tab-name">${tab.name}</span>
      <button class="tab-close" data-close-id="${tab.id}" aria-label="Close ${tab.name}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    // Click tab to activate
    tabEl.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.tab-close')) return;
      activateTab(tab.id);
    });

    // Close button
    const closeBtn = tabEl.querySelector('.tab-close');
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });

    tabList.appendChild(tabEl);
  });
}

function activateTab(fileId: string) {
  tabs.forEach(t => t.active = false);
  const tab = tabs.find(t => t.id === fileId);
  if (tab) {
    tab.active = true;
    activeTabId = fileId;
    renderTabs();
    updateActivePane();
    updateSidebarActive();
    updateTitleBar();
  }
}

function updateActivePane() {
  // Hide all panes
  document.querySelectorAll<HTMLElement>('.editor-pane').forEach(pane => {
    pane.style.display = 'none';
    pane.classList.remove('active');
  });

  if (activeTabId) {
    const activePane = document.querySelector<HTMLElement>(`.editor-pane[data-pane-id="${activeTabId}"]`);
    if (activePane) {
      activePane.style.display = 'flex';
      activePane.classList.add('active');
    }
  }
}

function updateSidebarActive() {
  document.querySelectorAll<HTMLElement>('.file-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-file-id') === activeTabId) {
      item.classList.add('active');
    }
  });
}

function updateTitleBar() {
  const titleBarFilename = document.getElementById('titlebar-filename');
  if (titleBarFilename) {
    if (activeTabId) {
      const file = getFileById(activeTabId);
      titleBarFilename.textContent = file ? `${file.folder || ''}/${file.name}` : 'Welcome';
    } else {
      titleBarFilename.textContent = 'Welcome';
    }
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Cmd+W or Ctrl+W to close active tab
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
      e.preventDefault();
      if (activeTabId) {
        closeTab(activeTabId);
      }
    }

    // Cmd+P or Ctrl+P for quick file open (prevent print dialog)
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault();
      showQuickOpen();
    }

    // Cmd+1-9 to switch tabs
    if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const index = parseInt(e.key, 10) - 1;
      if (tabs[index]) {
        activateTab(tabs[index].id);
      }
    }
  });
}

function showQuickOpen() {
  // Simple alert for now - could be a command palette overlay
  const fileNames = portfolioFiles.map(f => f.name).join('\n');
  const input = prompt(`Quick Open (Cmd+P)\n\nAvailable files:\n${fileNames}\n\nEnter filename:`);
  if (input) {
    const file = portfolioFiles.find(f =>
      f.name.toLowerCase().includes(input.toLowerCase())
    );
    if (file) {
      openFile(file.id);
    }
  }
}
