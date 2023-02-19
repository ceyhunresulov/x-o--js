const cellsBox = document.querySelector(".cells");
const cells = document.querySelectorAll(".cell-item");
const xBtn = document.querySelector(".btn-x");
const oBtn = document.querySelector(".btn-o");
const worning = document.querySelector(".worning");
const roolsToWin = ["012", "345", "678", "036", "147", "258", "048", "246"];
let allCell = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
const winnerProbability = [];

roolsToWin.forEach((item) => {
  winnerProbability.push(item[0] + item[1]);
  winnerProbability.push(item[0] + item[2]);
  winnerProbability.push(item[1] + item[2]);
  winnerProbability.push(item[2] + item[1]);
  winnerProbability.push(item[2] + item[0]);
  winnerProbability.push(item[1] + item[0]);
});

let currPlayer = "X";
let activePlayer = "X";
let xCells = "";
let oCells = "";

//  CLICK X BUTTON
xBtn.addEventListener("click", () => {
  currPlayer = "X";
  activePlayer = "X";
  oBtn.classList.remove("active");
  xBtn.classList.add("active");
});

//  CLICK O BUTTON
oBtn.addEventListener("click", () => {
  currPlayer = "O";
  activePlayer = "O";
  xBtn.classList.remove("active");
  oBtn.classList.add("active");
});

//  CLICK X CELLS
cells.forEach((item) => {
  item.addEventListener("click", startPlay);
});

//COMMON PLAY
function startPlay(e) {
  let i =
    currPlayer === activePlayer ? e.target.dataset.index : e.dataset.index;
  let event = currPlayer === activePlayer ? e.target : e;
  allCell.splice(allCell.indexOf(i), 1);

  if (activePlayer === "X") {
    event.style.color='white'
    xCells += i;
    sellectCell(event);
    activePlayer = "O";
    checkWinner(xCells);
  } else if (activePlayer === "O") {
    oCells += i;
    sellectCell(event);
    activePlayer = "X";
    checkWinner(oCells);
  }

  // PLAY OPPONENT
  setTimeout(() => {
    if (currPlayer !== activePlayer && allCell.length > 0) {
      playOpponent();
    }
  }, 1000);
}

// OPPONENT WHEN CLICK
function playOpponent() {
  let steps = currPlayer === "X" ? xCells : oCells;

  loop: for (prob of winnerProbability) {
    if (steps.includes(prob[0]) && steps.includes(prob[1])) {
      for (winStep of roolsToWin) {
        if (winStep.includes(prob[0]) && winStep.includes(prob[1])) {
          let nextStep = winStep
            .split("")
            .filter((item) => item !== prob[0] && item !== prob[1])[0];
          if (allCell.includes(nextStep)) {
            startPlay(cells[+nextStep]);
            break loop;
          }
        }
      }
    } else if (winnerProbability.indexOf(prob) < winnerProbability.length - 1) {
      continue;
    } else {
      const index = +allCell[0];
      startPlay(cells[index]);
    }
  }
}

// ADD X OR O
function sellectCell(currentEl) {
  currentEl.innerHTML = activePlayer;
  currentEl.style.pointerEvents = "none";
}

// FIND WINNER
function checkWinner(player) {
  for (rool of roolsToWin) {
    if (
      player.includes(rool[0]) &&
      player.includes(rool[1]) &&
      player.includes(rool[2])
    ) {
      cells[+rool[0]].style.background = "cadetblue";
      cells[+rool[1]].style.background = "cadetblue";
      cells[+rool[2]].style.background = "cadetblue";
      cellsBox.style.pointerEvents = "none";
      if (activePlayer === "O") {
        worning.innerHTML = "X is Winner";
      } else {
        worning.innerHTML = "O is Winner";
      }
      activePlayer = activePlayer !== currPlayer ? currPlayer : activePlayer;
      break;
    } else if (allCell.length < 1) {
      worning.innerHTML = "There is no winner";
    }
  }
}
