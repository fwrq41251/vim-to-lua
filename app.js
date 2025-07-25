// --- Start of the conversion function ---
function convertVimKeymapsToLua(vimscript) {
  const lines = vimscript.split('\n');
  let luaOutput = '';

  // Original regex for keymaps
  const keymapRegex = /^(n|v|i|x|s|o|t|c)?(noremap|map)\s+(\S+)\s+(.+)$/;
  
  // NEW: Regex specifically for the mapleader
  const leaderRegex = /^let\s+mapleader\s*=\s*(.+)$/;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Rule 1: Handle comments and empty lines (no change)
    if (trimmedLine.startsWith('"') || trimmedLine === '') {
      if (trimmedLine.startsWith('"')) {
        luaOutput += `--${trimmedLine.substring(1)}\n`;
      } else {
        luaOutput += '\n';
      }
      continue; // Move to the next line
    }

    // NEW Rule 2: Check for the mapleader setting
    const leaderMatch = trimmedLine.match(leaderRegex);
    if (leaderMatch) {
      const leaderKey = leaderMatch[1].trim(); // This captures the " " part
      luaOutput += `vim.g.mapleader = ${leaderKey}\n`;
      continue; // Conversion successful, move to the next line
    }
    
    // Rule 3: Check for keymap commands (the original logic)
    const keymapMatch = trimmedLine.match(keymapRegex);
    if (keymapMatch) {
      let mode = keymapMatch[1] || '';
      const mapType = keymapMatch[2];
      const keys = keymapMatch[3];
      let command = keymapMatch[4].trim();

      command = command.replace(/'/g, "\\'"); // Escape single quotes

      const isNoremap = mapType.includes('noremap');
      
      // A small improvement: check for <silent> in the command
      const isSilent = command.toLowerCase().includes('<silent>');
      if(isSilent) command = command.replace(/<silent>/i, '').trim();

      const options = `{ noremap = ${isNoremap}, silent = ${isSilent} }`;
      
      luaOutput += `vim.keymap.set('${mode}', '${keys}', '${command}', ${options})\n`;
      continue; // Conversion successful, move to the next line
    }
    
    // Rule 4: If no other rule matched, mark as unconverted
    luaOutput += `-- UNCONVERTED: ${trimmedLine}\n`;
  }
  return luaOutput;
}
// --- End of the conversion function ---

// Get DOM elements
const vimscriptInput = document.getElementById('vimscript-input');
const luaOutput = document.getElementById('lua-output');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');

// Event listener for the convert button
convertBtn.addEventListener('click', () => {
    const vimscriptText = vimscriptInput.value;
    const luaCode = convertVimKeymapsToLua(vimscriptText);
    luaOutput.value = luaCode;
});

// Event listener for the copy button
copyBtn.addEventListener('click', () => {
    luaOutput.select();
    navigator.clipboard.writeText(luaOutput.value).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 1500);
    });
});
