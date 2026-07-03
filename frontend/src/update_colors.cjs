const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'pages'),
  path.join(__dirname, 'layouts'),
  path.join(__dirname, 'components')
];

const replaceMap = {
  // Backgrounds
  'bg-[#090d16]': 'bg-[#0a0a0a]',
  'bg-[#0c1122]': 'bg-[#111111]',
  'bg-[#151c33]': 'bg-[#1a1a1a]',
  'bg-[#1e293b]': 'bg-[#222222]', 
  'bg-zinc-900/40': 'bg-[#1a1a1a]',
  'bg-zinc-900/50': 'bg-[#1a1a1a]',
  'bg-zinc-900': 'bg-[#111111]',
  'bg-zinc-800': 'bg-white/5',
  'hover:bg-zinc-800': 'hover:bg-white/10',
  'bg-zinc-800/50': 'bg-[#1a1a1a]',
  
  // Borders
  'border-indigo-950/40': 'border-white/10',
  'border-indigo-950/20': 'border-white/5',
  'border-indigo-900/50': 'border-white/10',
  'border-violet-500/20': 'border-[#c1ff00]/20',
  'border-violet-500/30': 'border-[#c1ff00]/30',
  'border-violet-500/50': 'border-[#c1ff00]/50',
  'border-zinc-800/50': 'border-white/10',
  'border-zinc-800': 'border-white/10',
  'border-t-orange-500': 'border-t-[#c1ff00]',
  
  // Text Colors
  'text-violet-500': 'text-[#c1ff00]',
  'text-violet-400': 'text-[#c1ff00]',
  'text-indigo-400': 'text-[#c1ff00]',
  'text-indigo-500': 'text-[#c1ff00]',
  'text-orange-500': 'text-[#c1ff00]',
  'text-orange-400': 'text-[#c1ff00]',
  'text-amber-400': 'text-[#c1ff00]',
  'text-zinc-100': 'text-white',
  'text-zinc-200': 'text-white',
  'text-zinc-400': 'text-gray-400',
  'text-zinc-500': 'text-gray-500',
  
  // Backgrounds/Buttons
  'bg-violet-600': 'bg-[#c1ff00] text-black',
  'hover:bg-violet-700': 'hover:bg-[#a4d500]',
  'bg-violet-500/10': 'bg-[#c1ff00]/10',
  'bg-violet-500/20': 'bg-[#c1ff00]/20',
  'hover:bg-violet-500/10': 'hover:bg-[#c1ff00]/10',
  'hover:bg-violet-500/20': 'hover:bg-[#c1ff00]/20',
  'bg-orange-500/5': 'bg-[#c1ff00]/5',
  'bg-amber-500/5': 'bg-[#c1ff00]/5',
  
  // Gradients (Simplifying to solid neon green for buttons/active states)
  'bg-gradient-to-r from-violet-600 to-indigo-600': 'bg-[#c1ff00] text-black',
  'bg-gradient-to-r from-violet-650 to-indigo-650': 'bg-[#c1ff00] text-black',
  'bg-gradient-to-tr from-violet-500 to-indigo-500': 'bg-[#c1ff00] text-black',
  'bg-gradient-to-r from-emerald-500 to-emerald-600': 'bg-[#c1ff00] text-black',
  'from-violet-500': 'from-[#c1ff00]',
  'to-indigo-500': 'to-[#a4d500]',
  'from-violet-650': 'from-[#c1ff00]',
  'to-indigo-650': 'to-[#a4d500]',
  'from-orange-500 to-rose-500': 'bg-[#c1ff00] text-black',
  
  // Shadows
  'shadow-violet-950/20': 'shadow-[#c1ff00]/20',
  'shadow-lg shadow-violet-900/20': 'shadow-lg shadow-[#c1ff00]/20',
};

function processFile(filePath) {
  // Skip Home.jsx as it is already the exact UI from the reference site
  if (filePath.endsWith('Home.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [search, replace] of Object.entries(replaceMap)) {
    // using split join to replace all occurrences
    content = content.split(search).join(replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(__dirname, filePath)}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.jsx')) {
      processFile(filePath);
    }
  }
}

dirs.forEach(walkDir);
console.log('Done!');
