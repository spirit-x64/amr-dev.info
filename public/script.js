const ASCII_ART = `  ______       _       _
 / _____)     (_)     (_)  _
( (____  ____  _  ____ _ _| |_
 \\____ \\|  _ \\| |/ ___) (_   _)
 _____) ) |_| | | |   | | | |_
(______/|  __/|_|_|   |_| \\___)
        |_|\n `
const HELP_MESSAGE = "commands: (click to run)"
const PROMPT_USER = "spirit@game-developer:"
const WORKING_DIR = "~"
const PROMPT_SIGN = "$"
const CURSOR = "|" // dosent matter in the current style
const LINE_OUTPUT_DELAY = 100 //ms
const CHAR_OUTPUT_DELAY = 50
const SEPERATOR = " | "

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

class VersatileAnimator extends Animator {
  constructor(targetElement, defaultDelay) {
    super(targetElement, defaultDelay);
  }
  async defaultPrintLine(line) {
    const lineElement = document.createElement("div")
    lineElement.textContent = line
    this.targetElement.appendChild(lineElement)
  }
  async print(text, delay, printLineFunction) {
    this.text = text
    const outputLines = text.split("\n")
    while (this.text == text && this.pointer < outputLines.length) {
      printLineFunction ? printLineFunction() : this.defaultPrintLine(outputLines[this.pointer])
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

const commandAnimator = new CharAnimator(document.querySelector(".run .command"), CHAR_OUTPUT_DELAY)
const outputAnimator = new VersatileAnimator(document.querySelector(".run .output"), LINE_OUTPUT_DELAY)

async function handleCommand(cmd) {
  commandAnimator.clear()
  outputAnimator.clear()

  await commandAnimator.print(cmd)

  const output = commands.get(cmd)
  if (typeof output == "string") {
    outputAnimator.print(output)
  } else {
    output()
  }
}

// print help command
(async () => {
  document.querySelector(".help .prompt-user").textContent = PROMPT_USER;
  document.querySelector(".help .working-dir").textContent = WORKING_DIR;
  document.querySelector(".help .prompt-sign").textContent = PROMPT_SIGN;
  document.querySelector(".help .cursor").textContent = CURSOR;

  const helpCommandAnimator = new CharAnimator(document.querySelector(".help .command"), CHAR_OUTPUT_DELAY)
  const helpOutputAnimator = new VersatileAnimator(document.querySelector(".help .output"), LINE_OUTPUT_DELAY)

  await helpCommandAnimator.print("lilspirit.info --help")
  await helpOutputAnimator.print(ASCII_ART + "\n\n" + HELP_MESSAGE)

  const commandsElement = document.createElement("div")
  commandsElement.style.padding = "10px"
  for (const [index, [key]] of Array.from(commands.entries()).entries()) {
    const cmd = document.createElement("span")
    cmd.classList.add("pressable")
    cmd.textContent = key
    cmd.onclick = () => handleCommand(key)
    commandsElement.appendChild(cmd)

    const seperator = document.createElement("span")
    seperator.textContent = index + 1 >= commands.size ? " \n " : SEPERATOR
    commandsElement.appendChild(seperator)
  }
  document.querySelector(".help .output").appendChild(commandsElement)

  document.querySelector(".help .cursor").remove()
  document.querySelector(".run .prompt-user").textContent = PROMPT_USER;
  document.querySelector(".run .working-dir").textContent = WORKING_DIR;
  document.querySelector(".run .prompt-sign").textContent = PROMPT_SIGN;
  document.querySelector(".run .cursor").textContent = CURSOR
})()
