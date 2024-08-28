//   ______       _       _
//  / _____)     (_)     (_)  _
// ( (____  ____  _  ____ _ _| |_
//  \____ \|  _ \| |/ ___) (_   _)
//  _____) ) |_| | | |   | | | |_
// (______/|  __/|_|_|   |_| \___)
//        |_|
// 
const HLP = "℗℗______℗℗℗℗℗℗℗_℗℗℗℗℗℗℗_℻℗/℗_____)℗℗℗℗℗(_)℗℗℗℗℗(_)℗℗_℻(℗(____℗℗____℗℗_℗℗____℗_℗_|℗|_℻℗\\____℗\\|℗℗_℗\\|℗|/℗___)℗(_℗℗℗_)℻℗_____)℗)℗|_|℗|℗|℗|℗℗℗|℗|℗|℗|_℻(______/|℗℗__/|_|_|℗℗℗|_|℗\\___)℻℗℗℗℗℗℗℗℗|_|℻℗℻commands: (click to run)".replace(/℗/g, " ").replace(/℻/g, "\n")

// [[title, brief, description, output: [title, brief, link] | string], ...]
const cmds = [
  [
    "tech-stack",
    "list few technologies I use",
    "Not all but most of what i use in a daily basis",
    [
      ["void-linux", "Minimalist Linux distribution", "https://voidlinux.org"],
      ["Node.js", "JavaScript runtime for servers", "https://nodejs.org"],
      ["GitHub", "Platform for hosting git repos", "https://github.com"],
      ["yt-dlp", "Feature rich YouTube downloader", "https://github.com/yt-dlp/yt-dlp"],
      ["OpenCL", "Cross-platform parallel computing", "https://opencv.org/opencl"],
      ["OpenGL", "Cross-platform 2D/3D graphics API", "https://www.opengl.org"],
      ["Godot", "Free open source light game engine", "https://godotengine.org"],
      ["Julia", "Highly optimized dynamic language", "https://julialang.org"],
      ["nginx", "Light reverse proxy and web-server", "https://nginx.org"],
      ["Bash", "Shell to interact with GNU/Linux", "https://www.gnu.org/software/bash"],
      ["Rust", "Performant memory-safe language", "https://www.rust-lang.org"],
      ["Git", "Version control to track changes", "https://git-scm.com"],
      ["Vim", "Highly configurable text editor", "https://www.vim.org"],
      ["EC2", "Cloud computing service by AWS", "https://aws.amazon.com/ec2"],
      ["SSH", "Protocol for remote computers", "https://openssh.com"],
      ["C", "Simple general-purpose language", "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3220.pdf"],
    ]
  ], [
    "projects",
    "show my recent projects",
    "there are many projects that i couldn't adreess here\nbut here are my recent projects which i'm happy to share :)\nI hope you enjoy them",
    [
      ["lilspirit.info (open GitHub)", "Portfolio with a terminal style", "https://github.com/spirit-x64/lilspirit.info"],
      ["EventEmitter.jl", "More than a EventEmitter.js clone", "https://github.com/spirit-x64/EventEmitter.jl"],
      ["N-Shapes.jl", "Advanced multi-dimensional shapes", "https://github.com/spirit-x64/NShapes.jl"],
      ["OutLandish", "Survival game, still in early stages"]
    ]
  ], [
    "contact",
    "find how to reach me",
    "I'm mostly active on github, 𝕏 and instagram\nbut you might find different content on other platforms.",
    [
      ["spirit@programmer.net", "For formal discussions and offers", "mailto:spirit@programmer.net"],
      ["Discord server", "Games and game development chat", "https://discord.lilspirit.info"],
      ["𝕏 (Twitter)", "Life updates, nothing to expect", "https://x.com/spirit_x64"],
      ["Instagram", "I share random shots to my story", "https://instagram.com/spirit_x64"],
      ["YouTube", "The typical place for dev logs", "https://youtube.com/@spirit-dev"],
      ["GitHub", "Where open sourced projects live", "https://github.com/spirit-x64"]
    ]
  ]
]

sleep = ms => new Promise((r) => setTimeout(r, ms))
// target, tag, txt, classList
newElement = (t, tag, txt, cl) => {
  const e = document.createElement(tag)
  e.textContent = txt
  cl && e.classList.add(cl)
  t.appendChild(e)
  return e
}

get = e => document.querySelector(e)

hide = e => e.classList.add("hidden")

isStr = x => typeof x == "string"

class Animator {
  constructor(t) {
    this.target = t;
    this.reset()
  }
  reset() {
    this.i = 0;
    this.id = "";
  }
  clear() {
    this.reset()
    this.target.replaceChildren();
    this.target.textContent = "";
  }
  // ln: [title, brief, link]
  listItem(i, list) {
    const line = newElement(list, "tr")

    const [t, s, b] = [[i[0], "list-title"], [" ⎯ "], [i[1] ?? " "]].map(([t, c]) => newElement(line, "td", t, c))

    if (i[2]) {
      t.onclick = isStr(i[2]) ? () => window.open(i[2], '_blank') : i[2]
      t.classList.add("pressable")
      t.tabIndex = 0
    }

    !i[1] && (hide(s) || hide(b))
  }
  // x: [[title, brief, link], ...] | String
  async print(x, id) {
    this.id = id ?? x
    const l = isStr(x) ? x.split("\n") : newElement(this.target, "div", "", "list")
    while (this.id == (id ?? x) && this.i < (isStr(x) ? l.length : x.length)) {
      isStr(x) ? newElement(this.target, "div", l[this.i]) : this.listItem(x[this.i], l)
      this.i++
      await sleep(100)
    }
  }
  async printChar(s) {
    this.id = s
    while (this.id == s && this.i < s.length) {
      this.target.textContent += s.charAt(this.i)
      this.i++
      await sleep(50)
    }
  }
}

const ca = new Animator(get(".run .cmd")) // Command Line Animator
const ra = new Animator(get(".run .output")) // Output Animator
const q = []

document.addEventListener("keydown", e => (["Space", "Enter"].includes(e.code)) && document.activeElement.click())

async function run(cmd) {
  ca.clear()
  ra.clear()

  q.some(c => c == cmd) || q.push(cmd)
  await ca.printChar(cmd)
  if (q.shift() != cmd) return

  ra.clear()
  if (!cmds.some(c => c[0] == cmd)) return ra.print(`bash: ${cmd}: command not found`)

  const c = cmds.find(c => c[0] == cmd)
  c[2] && (await ra.print(c[2]) || ra.reset())
  ra.print(c[3], cmd)
}

// print help command
(async () => {
  const a = new Animator(get(".help .output"))

  await (new Animator(get(".help .cmd"))).printChar("lilspirit.info --help")
  await a.print(HLP)
  a.reset()

  await a.print(cmds.map(c => [c[0], c[1], () => run(c[0])]))

  hide(get(".help .cursor"));

  [".run .user", ".run .pwd", ".run .cursor"].map(e => get(e).classList.remove("hidden"))
})()
