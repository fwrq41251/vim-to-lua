# Vimscript to Lua Keymap Converter

This is a simple web-based tool to convert your Vimscript keymaps to Lua, specifically for use with Neovim.

## Features

*   **Live Conversion:** Your Vimscript is converted to Lua in real-time as you type or paste.
*   **Syntax Highlighting:** Both the Vimscript input and Lua output are syntax-highlighted for readability.
*   **Copy to Clipboard:** A convenient button to copy the converted Lua code to your clipboard.
*   **Handles different map modes:** Converts `nmap`, `vmap`, `imap`, etc.
*   **Handles `noremap` and `<silent>` options.**
*   **Converts `mapleader` definition.**

## How to Use

1.  Open `index.html` in your web browser.
2.  Paste your Vimscript keymap definitions into the "Vimscript Input" text area.
3.  The converted Lua code will appear in the "Lua Output" text area.
4.  Click the "Copy Lua to Clipboard" button to copy the Lua code.

## Project Structure

*   `index.html`: The main HTML file for the web page.
*   `style.css`: The CSS file for styling the page.
*   `app.js`: The JavaScript file containing the conversion logic and DOM manipulation.


