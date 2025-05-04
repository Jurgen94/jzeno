
let currentMode = null;
let currentPath = "~";
const terminalCmd = document.getElementById('terminal-cmd');
const terminalOutput = document.getElementById('terminal-output');
const terminalPath = document.getElementById('terminal-path');

const fileSystem = {
  '/': {},
  '/profilo': {
    'README.md': `Zen0 is an offensive security analyst specialized in red teaming, adversary simulation, and high-impact testing.\nDriven by curiosity and discipline, I thrive on breaking systems to make them stronger.`
  },
  '/projects': {
    'osint_exposure.md': 'Study of public exposure via metadata, DNS, public code & social profiling.',
    'zennotes.md': 'Private collection of red teaming techniques, evasion methods & automation hacks.',
    'cms_analysis.md': 'Manual testing of custom CMS systems. Focus: auth, access control, validation.'
  },
  '/tools': {
    'binary1337.txt': 'Try: nc localhost 1337'
  },
  '/contact': {
    'contact.txt': 'You may reach me securely using ProtonMail or encrypted messaging on Signal. Public key exchange available on request.'
  }
};

function setMode(mode) {
  document.getElementById('mode-prompt').classList.add('hidden');
  document.getElementById('mode-toggle').classList.remove('hidden');
  currentMode = mode;
  if (mode === 'beginner') {
    document.getElementById('beginner-mode').classList.remove('hidden');
    document.getElementById('expert-mode').classList.add('hidden');
  } else {
    document.getElementById('expert-mode').classList.remove('hidden');
    document.getElementById('beginner-mode').classList.add('hidden');
    terminalCmd.focus();
  }
}

function toggleMode() {
  setMode(currentMode === 'beginner' ? 'expert' : 'beginner');
}

document.getElementById('expert-mode').addEventListener('click', () => {
  terminalCmd.focus();
});

terminalCmd?.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const input = terminalCmd.value.trim();
    terminalCmd.disabled = true;
    writeCommand(input);
    interpretCommand(input, (response) => {
      typeOutput(response, () => {
        terminalCmd.value = '';
        terminalCmd.disabled = false;
        terminalCmd.focus();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      });
    });
  }
});

function writeCommand(input) {
  const div = document.createElement('div');
  div.innerHTML = `<span class='prompt'>zen0@root:${currentPath}$</span> ${input}`;
  terminalOutput.appendChild(div);
}

function typeOutput(text, callback) {
  const lines = text.split("\n");
  let i = 0;
  function typeLine() {
    if (i >= lines.length) return callback();
    const line = document.createElement('div');
    line.className = 'term-line';
    terminalOutput.appendChild(line);
    let j = 0;
    function typeChar() {
      if (j < lines[i].length) {
        line.textContent += lines[i][j++];
        setTimeout(typeChar, 10);
      } else {
        i++;
        setTimeout(typeLine, 100);
      }
    }
    typeChar();
  }
  typeLine();
}

function interpretCommand(cmd, cb) {
  const lc = cmd.toLowerCase();
  const currentFiles = fileSystem[currentPath] || {};



  if (lc === 'su jurgen') {
    cb('Intrusion detected...\nRestoring system integrity...\nReturning to Jurgen...');
    setTimeout(() => {
      window.location.href = '../jurgen/index.html';
    }, 3000);
    return;
  }

  // Fake service shell on port 1337
  if (currentPath === '/1337') {
    const fake1337 = {
      'ls': 'note.txt',
      'cat note.txt': 'The key lies in the process itself...',
      'whoami': 'zen0-user',
      'ps aux | grep 1337': 'zen0-user  4413  ...  ./binary1337 -k FLAG{terminal_unlocked}'
    };
    if (lc === 'exit') {
      currentPath = '~';
      terminalPath.textContent = 'zen0@root:~$';
      return cb('Disconnected from 1337');
    }
    return cb(fake1337[lc] || `1337> command not found: ${cmd}`);
  }

  // Help command
  if (lc === 'help') return cb(`Available Commands:
  help        - Show this help message
  cd [dir]    - Navigate to a section
  cat [file]  - Display section content
  ls          - List files in current section
  clear       - Clear the terminal
  exit        - Switch to beginner mode

Directories:
  profilo     - Zen0 bio, mission, approach
  servizi     - Offensive services
  projects    - Research & activities
  tools       - Hidden utilities
  contact     - Secure message form`);

  if (lc === 'ls') {
    const files = Object.keys(currentFiles);
    return cb(files.length ? files.join('\n') : 'No files in this section.');
  }

  if (lc.startsWith('cd ')) {
    const dir = lc.split(' ')[1];
    const targetPath = `/${dir}`;
    if (fileSystem[targetPath]) {
      currentPath = targetPath;
      terminalPath.textContent = `zen0@root:${currentPath}$`;
      return cb(`Entered ${currentPath} - Accessing data...`);
    }
    return cb(`Directory not found: ${dir}`);
  }

  if (lc.startsWith('cat ')) {
    const file = cmd.split(' ')[1];
    if (currentFiles[file]) return cb(currentFiles[file]);
    return cb(`File not found: ${file}`);
  }

  if (lc === 'clear') {
    terminalOutput.innerHTML = '';
    return cb('');
  }

  if (lc === 'exit') {
    setMode('beginner');
    return cb('');
  }

  if (lc.startsWith('exploit ')) {
    const target = cmd.split(' ')[1] || 'target';
    const fakeOutput = [
      `[+] Target ${target} reachable`,
      `[+] Deploying payload...`,
      `[+] Buffer overflow triggered`,
      `[+] Shell obtained on 10.0.3.42`,
      `[+] Extracting credentials: admin:zen0_pw!`,
      `[+] Session closed`
    ];
    return cb(fakeOutput.join('\n'));
  }

  if (lc === 'ascii') {
    return cb(`  _____          _     
 |__  /___  ___| |__  
   / // _ \\/ __| '_ \\ 
  / /|  __/ (__| | | |
 /____\\___|\\___|_| |_|

Welcome to Zen0 Terminal`);
  }

  if (lc.startsWith('lang ')) {
    const lang = cmd.split(' ')[1];
    if (['en', 'it'].includes(lang)) {
      localStorage.setItem('zen0_lang', lang);
      return cb(`Language switched to ${lang.toUpperCase()}`);
    } else {
      return cb(`Unsupported language: ${lang}`);
    }
  }

  if (lc === 'nc localhost 1337') {
    currentPath = '/1337';
    terminalPath.textContent = 'zen0@service:1337$';
    return cb(`[+] Connected to service on port 1337\nType 'exit' to return.\n>`);
  }

  return cb(`Command not found: ${cmd}`);
}
