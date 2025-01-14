// Interface
import gameController from "./game_controller.module";
import gameBoard from "./board.module";
import { json } from "express";
const contentDiv = document.getElementById("content");
const downArrow = "\u25BE";

let direction = 1; // row = 0 column = 1;

const Interface = {
  uiBoard: [...Array(10)].map(() => Array(10).fill("")),

  changeScreen(state, gameType) {
    clearPage();
    switch (state) {
      case "start":
        gameController.initializeGame(gameType);
        this.loadGamePage();
        break;
      case "home":
        this.loadHomePage();
        break;
    }
  },

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
      this.changeScreen("start", button.dataset.chosenGameType);
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
    } else {
      activeBoard = gameController.getActivePlayer().board;
    }

    cells.forEach((cell) => {
      let x = Number(cell.dataset.x);
      let y = Number(cell.dataset.y);
      let boardCell = activeBoard.getCell(x, y);
      cell.dataset.value = boardCell.value;
      cell.dataset.cell = JSON.stringify(boardCell);
      updateCell(cell, boardCell);
    });
  },

  addShipIcons() {
    let player = gameController.getActivePlayer();

    for (let i = 0; i < player.ships.length; i++) {
      let sidebar = document.getElementById("sidebar");

      let shipIconWrapper = document.createElement("div");
      shipIconWrapper.classList.add("ship-wrapper");
      if (i > 2) {
        shipIconWrapper.style.gridRow = `6 / span ${player.ships[i].length}`;
      } else {
        shipIconWrapper.style.gridRow = `span ${player.ships[i].length}`;
      }
      shipIconWrapper.dataset.length = player.ships[i].length;

      sidebar.append(shipIconWrapper);

      shipIconWrapper.addEventListener('click', startPlacement);

      let shipIcon = document.createElement('div');
      shipIcon.classList.add('ship-icon');
      shipIconWrapper.append(shipIcon);
    }
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

    // let shipGrid = document.createElement('div');
    // shipGrid.id = 'ship-grid';
    // boardDiv.append(shipGrid);

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

    this.createBoard();
    this.loadCellData();
  },
};

function clearPage() {
  if (contentDiv.lastElementChild === null) {
    return;
  }

  let element = contentDiv.lastElementChild;
  element.remove();
  clearPage();
  return;
}

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

async function shootCell(e) {
  let targetCell = e.target;
  let board = gameController.getOpposingBoard();
  let boardCell = board.getCell(
    Number(targetCell.dataset.x),
    Number(targetCell.dataset.y),
  );

  getCells().forEach((cell) => {
    cell.removeEventListener("click", shootCell, true);
    cell.classList.remove("active");
  });

  if (targetCell.dataset.value > 1) {
    return;
  }

  addMessage(board.receiveAttack(gameController.getActivePlayer(), boardCell));
  updateCell(targetCell, boardCell);
  if (boardCell.value === 2) {
    // Swap to other board
    await turnTimer(3000);
    gameController.changeTurns();
    Interface.loadCellData();
  }

  getCells().forEach((cell) => {
    if (cell.dataset.value <= 1) {
      cell.classList.add("active");
      cell.addEventListener("click", shootCell, true);
    }
  });
}

function addMessage(message) {
  let messageBox = document.getElementById("message-box");
  let newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.textContent = message;
  messageBox.prepend(newMessage);
}

function startPlacement(event) {
  getCells().forEach(cell => {
    cell.classList.add('active');
    cell.addEventListener('click', placeShip);
  })
}

function placeShip(event) {
  let activeBoard = gameController.getActivePlayer().board;

  let startingCell = JSON.parse(event.target.dataset.cell);

  if (activeBoard.addShip(startingCell,direction));

  console.log(event.target.dataset.cell);
}

export default Interface;
