export interface PortfolioFile {
  id: string;
  name: string;
  icon: string;
  color?: string;
  description: string;
  folder?: string;
}

export const portfolioFiles: PortfolioFile[] = [
  {
    id: 'readme',
    name: 'README.md',
    icon: 'readme',
    color: '#3b82f6',
    description: 'Quick overview and getting started',
    folder: '0xdps',
  },
  {
    id: 'intro',
    name: 'intro.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'About me and background',
    folder: '0xdps',
  },
  {
    id: 'experience',
    name: 'experience.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Career journey and roles',
    folder: '0xdps',
  },
  {
    id: 'projects',
    name: 'projects.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Featured engineering work',
    folder: '0xdps',
  },
  {
    id: 'skills',
    name: 'skills.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Technical expertise',
    folder: '0xdps',
  },
  {
    id: 'side-projects',
    name: 'side-projects.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Personal work and open source',
    folder: '0xdps',
  },
  {
    id: 'services',
    name: 'services.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Mentorship and coaching',
    folder: '0xdps',
  },
];

export const activityBarItems = [
  { id: 'explorer', icon: 'files', label: 'Explorer', active: true },
  { id: 'search', icon: 'search', label: 'Search', active: false },
  { id: 'git', icon: 'git', label: 'Source Control', active: false },
  { id: 'extensions', icon: 'extensions', label: 'Extensions', active: false },
];

export const bottomBarItems = [
  { id: 'problems', label: 'Problems' },
  { id: 'output', label: 'Output' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'ports', label: 'Ports' },
];

