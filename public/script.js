const PROMPT = '\nspirit@game-developer:~$ '
const CURSOR = '|'
const LINE_OUTPUT_DELAY = 100 //ms
const CHAR_OUTPUT_DELAY = 50
const SEPERATOR = ", "
const commands = ["help", "contact", "projects", "scripts", "tech-stack"]

const help = document.querySelector('.help');
const run = document.querySelector('.run');

function handleCommand(cmd, container, callback) {
  container = container ?? run
  container.querySelector(".output").replaceChildren() // clear output
  container.querySelector(".command").textContent = "" // clear command

  switch (cmd) {
    case "help":
      typeWriter(container.querySelector(".command"), "lilspirit.info --help", CHAR_OUTPUT_DELAY, () => {
        displayOutput(container.querySelector(".output"), `  ______       _       _
 / _____)     (_)     (_)  _
( (____  ____  _  ____ _ _| |_
 \\____ \\|  _ \\| |/ ___) (_   _)
 _____) ) |_| | | |   | | | |_
(______/|  __/|_|_|   |_| \\___)
        |_|
 \n
  commands: (click to run) `, () => {
          commands.forEach((c, i) => {
            const pressableCommand = document.createElement('span')
            pressableCommand.textContent = c
            pressableCommand.onclick = () => handleCommand(c)
            container.querySelector(".output").appendChild(pressableCommand)
            if (i + 1 < commands.length) {
              const seperator = document.createElement('span')
              seperator.textContent = SEPERATOR
              container.querySelector(".output").appendChild(seperator)
            } else {
              const newLine = document.createElement('span')
              newLine.textContent = " \n "
              container.querySelector(".output").appendChild(newLine)
            }
          });
          setTimeout(() => callback(), LINE_OUTPUT_DELAY);
        })
      })
      break;

    default:
      typeWriter(container.querySelector(".command"), cmd, CHAR_OUTPUT_DELAY, () => {
        typeWriter(container.querySelector(".output"), "Command not fount", 5)
      })
      break;
  }
}

function prepareRun() {
  help.querySelector(".cursor").textContent = ""
  run.querySelector(".prompt").textContent = PROMPT
  run.querySelector(".cursor").textContent = CURSOR
}

function typeWriter(element, text, speed) {
  return new Promise((resolve, reject) => {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else resolve()
    }
    type();
  })
}

// display output with delay
function displayOutput(element, output, callback) {
  const outputLines = output.split('\n');
  setTimeout(callback, LINE_OUTPUT_DELAY * (outputLines.length + 1))
  outputLines.forEach((line, index) => {
    setTimeout(() => {
      const lineElement = document.createElement('span');
      lineElement.textContent = "\n" + line;
      element.appendChild(lineElement);
    }, LINE_OUTPUT_DELAY * (index + 1));
  });
}

help.querySelector(".prompt").textContent = PROMPT;
help.querySelector(".cursor").textContent = CURSOR;

handleCommand("help", help, prepareRun)

