const ASCII_ART = `  ______       _       _
 / _____)     (_)     (_)  _
( (____  ____  _  ____ _ _| |_
 \\____ \\|  _ \\| |/ ___) (_   _)
 _____) ) |_| | | |   | | | |_
(______/|  __/|_|_|   |_| \\___)
        |_|\n `
const HELP_MESSAGE = "commands: (click to run)"
const PROMPT = "\nspirit@game-developer:~$ "
const CURSOR = "|"
const LINE_OUTPUT_DELAY = 100 //ms
const CHAR_OUTPUT_DELAY = 50
const SEPERATOR = ", "

const command = document.querySelector(".run .command");
const output = document.querySelector(".run .output");

const commands = new Map();
commands.set("contact", () => { });
commands.set("projects", () => { });
commands.set("scripts", () => { });
commands.set("tech-stack", () => { });

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

class Animator {
  constructor(targetElement, defaultDelay = 50) {
    this.targetElement = targetElement;
    this.defaultDelay = defaultDelay;
    this.pointer = 0;
    this.text = ""
  }
  async clear() {
    this.pointer = 0;
    this.text = "";
    this.targetElement.replaceChildren();
    this.targetElement.textContent = "";
  }
}

class LineAnimator extends Animator {
  constructor(targetElement, defaultDelay) {
    super(targetElement, defaultDelay);
  }
  async print(text, delay) {
    this.text = text
    const outputLines = text.split("\n")
    while (this.text == text && this.pointer < outputLines.length) {
      const line = outputLines[this.pointer]
      const lineElement = document.createElement("div")
      lineElement.textContent = line
      this.targetElement.appendChild(lineElement)
      this.pointer++
      await sleep(delay ?? this.defaultDelay)
    }
  }
}

class CharAnimator extends Animator {
  constructor(targetElement, defaultDelay) {
    super(targetElement, defaultDelay);
  }
  async print(text, delay) {
    this.text = text
    while (this.text == text && this.pointer < text.length) {
      const char = this.text.charAt(this.pointer)
      this.targetElement.textContent += char
      this.pointer++
      await sleep(delay ?? this.defaultDelay)
    }
  }
}

const commandAnimator = new CharAnimator(command, CHAR_OUTPUT_DELAY)
const outputAnimator = new LineAnimator(output, LINE_OUTPUT_DELAY)

async function handleCommand(cmd) {
  commandAnimator.clear()
  outputAnimator.clear()

  await commandAnimator.print(cmd)

  const text = commands.get(cmd)()
  if (text && typeof text == "string") outputAnimator.print(text)
  else outputAnimator.print(`Couldn"t find the command ${cmd}`)
}

// print help command
(async () => {
  document.querySelector(".help .prompt").textContent = PROMPT;
  document.querySelector(".help .cursor").textContent = CURSOR;

  const helpCommandAnimator = new CharAnimator(document.querySelector(".help .command"), CHAR_OUTPUT_DELAY)
  const helpOutputAnimator = new LineAnimator(document.querySelector(".help .output"), LINE_OUTPUT_DELAY)

  await helpCommandAnimator.print("lilspirit.info --help")
  await helpOutputAnimator.print(ASCII_ART + "\n\n" + HELP_MESSAGE)

  const commandsElement = document.createElement("div")
  commandsElement.style.padding = "10px"
  for (const [index, [key]] of Array.from(commands.entries()).entries()) {
    const cmd = document.createElement("span")
    cmd.textContent = key
    cmd.onclick = () => handleCommand(key)
    commandsElement.appendChild(cmd)

    const seperator = document.createElement("span")
    seperator.textContent = index + 1 >= commands.size ? " \n " : SEPERATOR
    commandsElement.appendChild(seperator)
  }
  document.querySelector(".help .output").appendChild(commandsElement)

  document.querySelector(".help .cursor").remove()
  document.querySelector(".run .prompt").textContent = PROMPT
  document.querySelector(".run .cursor").textContent = CURSOR
})()
