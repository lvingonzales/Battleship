// Home page
const contentDiv = document.getElementById("content");

const clearPage = () => {
  if (!contentDiv.lastElementChild()) {
    return;
  }

  contentDiv.remove(contentDiv.lastElementChild());
  clearPage();
  return;
};

const homePage = {
  loadHomePage() {
    let title = document.createElement("div");
    title.id = "title";
    title.textContent = "Battleship";
    contentDiv.append(title);

    let menu = document.createElement("div");
    menu.id = "menu";
    contentDiv.append(menu);

    let startButton = document.createElement("button");
    startButton.textContent = 'Start Game';
    menu.append(startButton);
    
    let playerChoiceDiv = document.createElement('div');
    playerChoiceDiv.id = 'player-choice';
    
  },
};
