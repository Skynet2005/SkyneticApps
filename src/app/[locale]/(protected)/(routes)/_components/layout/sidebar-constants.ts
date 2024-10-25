export type SidePathTypes = {
  label: string;
  route: string;
  href: string;
  color: string;
  bgColor: string;
};

export const SidePaths: { [category: string]: SidePathTypes[] } = {
  "General": [
    { label: 'Dashboard', route: '/dashboard/dashboard.png', href: '/dashboard', color: 'text-neutral-300', bgColor: 'bg-neutral-900/75' },
    { label: 'Settings', route: '/dashboard/settingsSide.png', href: '/profile/settings', color: 'text-neutral-300', bgColor: 'bg-neutral-900/75' },
  ],
  "Simulators": [
    { label: 'Battle Simulator', route: '/dashboard/battle.png', href: '/battle-simulator', color: 'text-sky-700', bgColor: 'bg-neutral-900/75' },
  ],
  "Advanced Tools": [
    // { label: 'Quantum Clones', route: '/dashboard/dna.png', href: '/quantum-clones', color: 'text-green-500', bgColor: 'bg-neutral-900/75' },
    // { label: 'Music Generation', route: '/dashboard/music.png', href: '/music', color: 'text-purple-700', bgColor: 'bg-neutral-900/75' },
    // { label: 'SketchNetic', route: '/dashboard/imagepic.png', href: '/image', color: 'text-pink-700', bgColor: 'bg-neutral-900/75' },
    // { label: 'PDF ChatNetic', route: '/dashboard/fileconverse.png', href: '/pdf-chatnetic', color: 'text-sky-700', bgColor: 'bg-neutral-900/75' },
  ],
  "Storage": [
    // { label: 'CyberRants', route: '/dashboard/cyberrants.png', href: '/cyber-rant', color: 'text-red-500', bgColor: 'bg-neutral-900/75' },
    // { label: 'Bloginator', route: '/dashboard/blog.png', href: '/bloginator', color: 'text-indigo-700', bgColor: 'bg-neutral-900/75' },
    // { label: 'Tasknetic-Minder', route: '/dashboard/todolist.png', href: '/taskneticminder', color: 'text-yellow-200', bgColor: 'bg-neutral-900/75' },
    // { label: 'Tensor Trunk', route: '/dashboard/tensortrunk.png', href: '/tensor-trunk', color: 'text-cyan-500', bgColor: 'bg-neutral-900/75' },
  ],
  "Utilities": [
    // { label: 'CyberRants', route: '/dashboard/cyberrants.png', href: '/cyber-rant', color: 'text-red-500', bgColor: 'bg-neutral-900/75' },
  ],
};
