const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Find all React components (capitalized tags) with text-primary and add strokeWidth={1} + text-gray-500
  // e.g. <Users className="size-5 text-primary" /> -> <Users className="size-5 text-gray-500" strokeWidth={1} />
  content = content.replace(/<([A-Z][a-zA-Z0-9]+)\s+([^>]*?)className=(["'])([^"']*?)\btext-(?:primary|#1e996d)\b([^"']*?)\3([^>]*?)\/?>/g, (match, tag, beforeClass, quote, classBefore, classAfter, afterClass) => {
    // If it already has strokeWidth, remove it so we can append ours
    let newAfterClass = afterClass.replace(/\s*strokeWidth=\{[^}]+\}/g, '');
    let newTag = `<${tag} ${beforeClass}className=${quote}${classBefore}text-gray-500${classAfter}${quote} strokeWidth={1}${newAfterClass}`;
    if (match.endsWith('/>')) newTag += '/>';
    else newTag += '>';
    return newTag;
  });
  
  // 2. We also want to remove background circles. If a wrapper has bg-primary/10 or similar, just replace it with bg-transparent.
  // Actually, wait, some wrappers are `bg-primary/10 text-primary`.
  content = content.replace(/bg-(?:primary|#1e996d)\/(?:10|15|20|25)/g, 'bg-transparent');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
}
console.log(`Finished. Updated ${changedFiles} files.`);
