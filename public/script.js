const ASCII_ART = `  ______       _       _
 / _____)     (_)     (_)  _
( (____  ____  _  ____ _ _| |_
 \\____ \\|  _ \\| |/ ___) (_   _)
 _____) ) |_| | | |   | | | |_
(______/|  __/|_|_|   |_| \\___)
        |_|\n `
const HELP_MESSAGE = "commands: (click to run)"
const LINE_OUTPUT_DELAY = 100 // in ms
const CHAR_OUTPUT_DELAY = 50 // in ms
const SEPERATOR = " ⎯ "

const commands = [
  {
    title: "tech-stack",
    brief: "print a brief overview of the technologies I use"
  },
  {
    title: "projects",
    brief: "show my recent projects"
  },
  {
    title: "scripts",
    brief: "list some helpfull scripts and dotfiles I use"
  },
  {
    title: "contact",
    brief: "find how to reach me",
    description: "I'm mostly active on github, 𝕏 and instagram\nbut you might find different content on other platforms.",
    output: [
      {
        title: "spirit@programmer.net",
        link: "mailto:spirit@programmer.net",
        brief: "For formal discussions and offers"
      },
      {
        title: "Discord server",
        link: "https://discord.lilspirit.info",
        brief: "Games and game development chat"
      },
      {
        title: "𝕏 (Twitter)",
        link: "https://x.com/spirit_x64",
        brief: "Life updates, nothing to expect"
      },
      {
        title: "Instagram",
        link: "https://instagram.com/spirit_x64",
        brief: "I share random shots to my story"
      },
      {
        title: "YouTube",
        link: "https://youtube.com/@spirit-dev",
        brief: "The typical place for dev logs"
      },
      {
        title: "GitHub",
        link: "https://github.com/spirit-x64",
        brief: "Where open sourced projects live"
      }
    ]
  }
]

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function same(x, y) {
  if (Array.isArray(x)) {
    if (Array.isArray(y)) return x.every((v, i) => same(v, y[i]));
    else return false
  }
  return x == y
}

class Animator {
  constructor(targetElement, defaultDelay = 50) {
    this.targetElement = targetElement;
    this.defaultDelay = defaultDelay;
    this.pointer = 0;
    this.content = ""
  }
  async clear() {
    this.pointer = 0;
    this.content = "";
    this.targetElement.replaceChildren();
    this.targetElement.textContent = "";
  }
  resetPointer() {
    this.pointer = 0;
    this.content = "";
  }
}

class VersatileAnimator extends Animator {
  constructor(targetElement, defaultDelay) {
    super(targetElement, defaultDelay);
  }
  async defaultPrintListLine({ title, link, seperator, brief }, listElement) {
    const lineElement = document.createElement("tr")
    listElement.appendChild(lineElement)

    const titleElement = document.createElement("td")
    titleElement.classList.add("list-element-title")
    titleElement.textContent = title
    lineElement.appendChild(titleElement)
    if (link) {
      titleElement.onclick = typeof link == "string" ? () => window.open(link, '_blank') : link
      titleElement.classList.add("pressable")
    }

    const seperatorElement = document.createElement("td")
    seperatorElement.textContent = seperator ?? SEPERATOR
    lineElement.appendChild(seperatorElement)

    const briefElement = document.createElement("td")
    briefElement.textContent = brief ?? " "
    lineElement.appendChild(briefElement)

    if (!brief) {
      seperatorElement.classList.add("hidden")
      briefElement.classList.add("hidden")
    }
  }
  async printList(list, options = {}) {
    this.content = list
    const listElement = document.createElement("div")
    listElement.classList.add("list-container")
    this.targetElement.appendChild(listElement)
    while (same(this.content, list) && this.pointer < list.length) {
      (options.printLine ?? this.defaultPrintListLine)(list[this.pointer], listElement, this)
      this.pointer++
      await sleep(options.delay ?? this.defaultDelay)
    }
  }
  async defaultPrintLine(line) {
    const lineElement = document.createElement("div")
    lineElement.textContent = line
    this.targetElement.appendChild(lineElement)
  }
  async print(content, options = {}) {
    this.content = content
    const outputLines = typeof content == "string" ? content.split("\n") : content
    while (same(this.content, content) && this.pointer < outputLines.length) {
      options.printLine ? options.printLine(outputLines[this.pointer], this) : this.defaultPrintLine(outputLines[this.pointer])
      this.pointer++
      await sleep(options.delay ?? this.defaultDelay)
    }
  }
}

class CharAnimator extends Animator {
  constructor(targetElement, defaultDelay) {
    super(targetElement, defaultDelay);
  }
  async print(content, options = {}) {
    this.content = content
    while (this.content == content && this.pointer < content.length) {
      const char = this.content.charAt(this.pointer)
      this.targetElement.textContent += char
      this.pointer++
      await sleep(options.delay ?? this.defaultDelay)
    }
  }
}

const commandAnimator = new CharAnimator(document.querySelector(".run .command"), CHAR_OUTPUT_DELAY)
const outputAnimator = new VersatileAnimator(document.querySelector(".run .output"), LINE_OUTPUT_DELAY)
const printStack = []

async function handleCommand(cmd) {
  commandAnimator.clear()
  outputAnimator.clear()

  if (!printStack.some((c) => c == cmd)) printStack.push(cmd)
  await commandAnimator.print(cmd)
  if (printStack.shift() != cmd) return

  if (!commands.some(({ title }) => title == cmd))
    return outputAnimator.print(`bash: ${cmd}: command not found`)

  outputAnimator.clear()
  const command = commands.find(({ title }) => title == cmd)
  const output = command.output
  if (command.description) {
    await outputAnimator.print(command.description)
    outputAnimator.resetPointer()
  }
  if (typeof output === 'string') outputAnimator.print(output)
  else if (Array.isArray(output)) outputAnimator.printList(output)
  else outputAnimator.print(output.content, output.options)
}

// print help command
(async () => {
  const helpCommandAnimator = new CharAnimator(document.querySelector(".help .command"), CHAR_OUTPUT_DELAY)
  const helpOutputAnimator = new VersatileAnimator(document.querySelector(".help .output"), LINE_OUTPUT_DELAY)

  await helpCommandAnimator.print("lilspirit.info --help")
  await helpOutputAnimator.print(ASCII_ART + "\n" + HELP_MESSAGE)
  helpOutputAnimator.resetPointer()

  commands.forEach((cmd) => cmd.link = () => handleCommand(cmd.title))
  await helpOutputAnimator.printList(commands)

  document.querySelector(".help .cursor").classList.add("hidden")
  document.querySelector(".run .prompt-user").classList.remove("hidden");
  document.querySelector(".run .working-dir").classList.remove("hidden");
  document.querySelector(".run .prompt-sign").classList.remove("hidden");
  document.querySelector(".run .cursor").classList.remove("hidden")
})()
