export interface PortfolioFile {
  id: string;
  name: string;
  icon: string;
  color?: string;
  description: string;
}

export const portfolioFiles: PortfolioFile[] = [
  {
    id: 'readme',
    name: 'README.md',
    icon: 'readme',
    color: '#3b82f6',
    description: 'Quick overview and getting started',
  },
  {
    id: 'intro',
    name: 'intro.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'About me and background',
  },
  {
    id: 'experience',
    name: 'experience.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Career journey and roles',
  },
  {
    id: 'projects',
    name: 'projects.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Featured engineering work',
  },
  {
    id: 'skills',
    name: 'skills.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Technical expertise',
  },
  {
    id: 'side-projects',
    name: 'side-projects.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Personal work and open source',
  },
  {
    id: 'services',
    name: 'services.md',
    icon: 'markdown',
    color: '#42a5f5',
    description: 'Mentorship and coaching',
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

