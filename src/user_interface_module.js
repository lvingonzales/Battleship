// Interface
const contentDiv = document.getElementById("content");
const downArrow = "\u25BE";

const Interface = {
  uiBoard: [...Array(10)].map(() => Array(10).fill("")),

  loadHomePage() {
    let title = document.createElement("div");
    title.id = "title";
    title.textContent = "Battleship";
    contentDiv.append(title);

    let menu = document.createElement("div");
    menu.id = "menu";
    contentDiv.append(menu);

    let startButton = document.createElement("button");
    startButton.textContent = "Start Game";
    menu.append(startButton);

    let playerChoiceDiv = document.createElement("div");
    playerChoiceDiv.id = "player-choice";
    menu.append(playerChoiceDiv);

    let choice = document.createElement("div");
    choice.classList.add("choice");
    playerChoiceDiv.append(choice);

    let button = document.createElement("button");
    button.classList.add("choice-btn");
    button.textContent = `${downArrow}Choose`;
    button.dataset.chosenGameType = null;
    choice.append(button);

    let dropDownWrapper = document.createElement("div");
    dropDownWrapper.id = "dropdown-wrapper";
    choice.append(dropDownWrapper);

    let dropDown = document.createElement("ul");
    dropDown.classList.add("dropdown");
    dropDown.classList.add("hidden");
    dropDownWrapper.append(dropDown);

    let pvpLi = document.createElement("li");
    let pveLi = document.createElement("li");
    let comVsComLi = document.createElement("li");
    let chooseLi = document.createElement("li");

    pvpLi.textContent = "Player vs Player";
    pvpLi.dataset.gameType = "pvp";
    pveLi.textContent = "Player vs Computer";
    pveLi.dataset.gameType = "pve";
    comVsComLi.textContent = "Computer vs Computer";
    comVsComLi.dataset.gameType = "cvc";
    chooseLi.textContent = "Choose";
    chooseLi.dataset.gameType = null;

    dropDown.append(pvpLi, pveLi, comVsComLi, chooseLi);

    let listItems = document.querySelectorAll("li");

    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        button.textContent = `${downArrow}${item.textContent}`;
        button.dataset.chosenGameType = item.dataset.gameType;
      });
    });

    button.addEventListener("mouseover", () => {
      dropDown.classList.remove("hidden");
    });
    button.addEventListener("mouseout", () => {
      dropDown.classList.add("hidden");
    });
    dropDown.addEventListener("mouseover", () => {
      dropDown.classList.remove("hidden");
    });
    dropDown.addEventListener("mouseout", () => {
      dropDown.classList.add("hidden");
    });
    startButton.addEventListener("click", () => {
      if (button.dataset.chosenGameType === "null") {
        return;
      }
      console.log("changing to game screen");
      changeScreen("start", button.dataset.chosenGameType);
    });
  },

  createBoard() {
    let boardDiv = document.getElementById("board");
    for (let x = 0; x < this.uiBoard.length; x++) {
      let row = document.createElement("div");
      for (let y = 0; y < this.uiBoard.length; y++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = x;
        cell.dataset.col = y;
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.dataset.value = 0;
        cell.classList.add("active");

        cell.addEventListener("click", handleClick, true);

        row.append(cell);
      }
      row.classList.add("row");
      boardDiv.append(row);
    }
  },

  loadCellData() {
    let playerName = gameController.getActivePlayer().name;
    let turnDisplay = document.getElementById("turn-display");
    turnDisplay.textContent = `${playerName}'(s) turn`;
    let cells = getCells();
    let activeBoard;

    if (gameController.phase === "play") {
      activeBoard = gameController.getOpposingBoard();
    }

    cells.forEach((cell) => {
      let x = Number(cell.dataset.x);
      let y = Number(cell.dataset.y);
      let boardCell = activeBoard.getCell(x, y);
      cell.dataset.value = boardCell.value;
      updateCell(cell, boardCell);
    });
  },

  addShipIcons() {
    let sidebar = document.getElementById("sidebar");

    let shipIconWrapper = document.createElement("div");
    shipIconWrapper.classList.add("ship-wrapper");
    shipIconWrapper.draggable = true;

    sidebar.append(shipIconWrapper);
    shipIconWrapper.addEventListener("dragstart", () => {
      shipIconWrapper.classList.add("active-ship");
    });
    shipIconWrapper.addEventListener("dragend", () => {
      shipIconWrapper.classList.remove("active-ship");
    });
  },

  loadGamePage() {
    let container = document.createElement("div");
    container.id = "container";
    contentDiv.append(container);

    let boardDiv = document.createElement("div");
    boardDiv.id = "board";
    container.append(boardDiv);

    let sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    container.append(sidebar);

    this.addShipIcons();

    let messageLog = document.createElement("div");
    messageLog.id = "message-log";
    container.append(messageLog);

    let turnDisplay = document.createElement("div");
    turnDisplay.id = "turn-display";
    messageLog.append(turnDisplay);

    let messageBox = document.createElement("div");
    messageBox.id = "message-box";
    messageLog.append(messageBox);
  },

  clearPage() {
    if (contentDiv.lastElementChild === null) {
      return;
    }

    let element = contentDiv.lastElementChild;
    element.remove();
    clearPage();
    return;
  },
};

function getCells() {
  return document.querySelectorAll(".cell");
}

function getCellElement(x, y) {
  return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
}

function updateCell(cell, boardCell) {
  if (boardCell.value <= 1) {
    cell.textContent = "?";
  } else if (boardCell.value === 2) {
    cell.textContent = "X";
  } else if (boardCell.value === 3) {
    cell.textContent = "O";
  }
}

function turnTimer(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleClick(e) {
  let targetCell = e.target;
  let board = gameController.getOpposingBoard();
  let boardCell = board.getCell(
    Number(targetCell.dataset.x),
    Number(targetCell.dataset.y),
  );
  let messageBox = document.getElementById("message-box");
  let newMessage = document.createElement("div");
  newMessage.classList.add("message");

  getCells().forEach((cell) => {
    cell.removeEventListener("click", handleClick, true);
    cell.classList.remove("active");
  });

  if (targetCell.dataset.value > 1) {
    return;
  }

  let message = board.receiveAttack(boardCell);
  updateCell(targetCell, boardCell);
  if (boardCell.value === 2) {
    newMessage.textContent = message;
    messageBox.prepend(newMessage);
    await turnTimer(3000);
    gameController.changeTurns();
    gamePage.loadCellData();
  } else if (boardCell.value === 3) {
    newMessage.textContent = message;
    messageBox.prepend(newMessage);
  }

  getCells().forEach((cell) => {
    if (cell.dataset.value <= 1) {
      cell.classList.add("active");
      cell.addEventListener("click", handleClick, true);
    }
  });
}

function addMessage(message) {

}

export { Interface };
