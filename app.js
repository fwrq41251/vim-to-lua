// --- The conversion function remains the same ---
function convertVimKeymapsToLua(vimscript) {
  const lines = vimscript.split('\n');
  let luaOutput = '';
  const keymapRegex = /^(n|v|i|x|s|o|t|c)?(noremap|map)\s+(\S+)\s+(.+)$/;
  const leaderRegex = /^let\s+mapleader\s*=\s*(.+)$/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('"') || trimmedLine === '') {
      luaOutput += trimmedLine.startsWith('"') ? `--${trimmedLine.substring(1)}\n` : '\n';
      continue;
    }
    const leaderMatch = trimmedLine.match(leaderRegex);
    if (leaderMatch) {
      const leaderKey = leaderMatch[1].trim();
      luaOutput += `vim.g.mapleader = ${leaderKey}\n`;
      continue;
    }
    const keymapMatch = trimmedLine.match(keymapRegex);
    if (keymapMatch) {
      let mode = keymapMatch[1] || '';
      const mapType = keymapMatch[2];
      const keys = keymapMatch[3];
      let command = keymapMatch[4].trim();
      command = command.replace(/'/g, "\\'");
      const isNoremap = mapType.includes('noremap');
      const isSilent = command.toLowerCase().includes('<silent>');
      if (isSilent) command = command.replace(/<silent>/i, '').trim();
      const options = `{ noremap = ${isNoremap}, silent = ${isSilent} }`;
      luaOutput += `vim.keymap.set('${mode}', '${keys}', '${command}', ${options})\n`;
      continue;
    }
    luaOutput += `-- UNCONVERTED: ${trimmedLine}\n`;
  }
  return luaOutput;
}
// --------------------------------------------------------

// Get DOM elements
const vimscriptInput = document.getElementById('vimscript-input');
const vimscriptHighlight = document.getElementById('vimscript-highlight');

const luaOutputTextarea = document.getElementById('lua-output-textarea');
const luaHighlight = document.getElementById('lua-highlight');

const copyBtn = document.getElementById('copy-btn');

// --- Main function to handle updates ---
function handleLiveConversion() {
    const vimscriptText = vimscriptInput.value;
    const luaCode = convertVimKeymapsToLua(vimscriptText);
    luaOutputTextarea.value = luaCode;
    vimscriptHighlight.textContent = vimscriptText;
    luaHighlight.textContent = luaCode;
    Prism.highlightElement(vimscriptHighlight);
    Prism.highlightElement(luaHighlight);
}

// --- Event Listeners ---
vimscriptInput.addEventListener('input', handleLiveConversion);
vimscriptInput.addEventListener('scroll', () => {
    vimscriptHighlight.parentElement.scrollTop = vimscriptInput.scrollTop;
    vimscriptHighlight.parentElement.scrollLeft = vimscriptInput.scrollLeft;
});

// Event listener for the copy button
copyBtn.addEventListener('click', () => {
    // REMOVED THE LINE: luaOutputTextarea.select();
    
    // The API copies the text directly from the variable, no selection needed!
    navigator.clipboard.writeText(luaOutputTextarea.value).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Lua to Clipboard';
        }, 1500);
    });
});

// Initial conversion on page load
handleLiveConversion();
