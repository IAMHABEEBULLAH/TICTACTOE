const cells = document.querySelectorAll(".cell");
const currentPlayerEl = document.getElementById("currentPlayer");
const messageEl = document.getElementById("message");
const modeLabel = document.getElementById("modeLabel");
const twoBtn = document.getElementById("twoBtn");
const cpuBtn = document.getElementById("cpuBtn");
const newRoundBtn = document.getElementById("newRound");
const resetAllBtn = document.getElementById("resetAll");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const tiesEl = document.getElementById("ties");
const roundEl = document.getElementById("round");

let board = Array(9).fill(null);
let current = "X";
let isActive = true;
let mode = "2P";
let scores = { X: 0, O: 0, T: 0 };
let round = 1;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderBoard() {
  cells.forEach((c, i) => {
    c.textContent = board[i] || "";
    c.classList.remove("winner");
  });
  currentPlayerEl.textContent = isActive ? `${current}'s Turn` : "Game Over";
  roundEl.textContent = round;
}

function checkWinner(b) {
  for (const [a, b1, c] of wins) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], combo: [a, b1, c] };
  }
  if (b.every(v => v)) return { winner: "T" };
  return null;
}

function endRound(res) {
  isActive = false;
  if (res.winner === "T") {
    messageEl.textContent = "It's a tie.";
    scores.T++;
    tiesEl.textContent = scores.T;
  } else {
    res.combo.forEach(i => cells[i].classList.add("winner"));
    messageEl.textContent = `${res.winner} wins!`;
    scores[res.winner]++;
    if (res.winner === "X") xScoreEl.textContent = scores.X;
    else oScoreEl.textContent = scores.O;
  }
}

function handleMove(i) {
  if (!isActive || board[i]) return;
  board[i] = current;
  const res = checkWinner(board);
  if (res) return endRound(res);
  current = current === "X" ? "O" : "X";
  messageEl.textContent = `${current}'s move.`;
  renderBoard();

  if (mode === "CPU" && current === "O") setTimeout(cpuMove, 300);
}

function cpuMove() {
  const avail = board.map((v, i) => v ? null : i).filter(v => v !== null);
  const move = avail[Math.floor(Math.random() * avail.length)];
  board[move] = "O";
  const res = checkWinner(board);
  if (res) return endRound(res);
  current = "X";
  messageEl.textContent = `${current}'s move.`;
  renderBoard();
}

cells.forEach((c, i) => c.addEventListener("click", () => handleMove(i)));

function resetBoard() {
  board.fill(null);
  isActive = true;
  current = "X";
  messageEl.textContent = "Place your mark.";
  renderBoard();
}

twoBtn.onclick = () => {
  mode = "2P";
  modeLabel.textContent = "Mode: 2-Player";
  twoBtn.classList.add("active");
  cpuBtn.classList.remove("active");
  resetBoard();
};

cpuBtn.onclick = () => {
  mode = "CPU";
  modeLabel.textContent = "Mode: vs CPU";
  cpuBtn.classList.add("active");
  twoBtn.classList.remove("active");
  resetBoard();
};

newRoundBtn.onclick = () => {
  round++;
  resetBoard();
};

resetAllBtn.onclick = () => {
  scores = { X: 0, O: 0, T: 0 };
  xScoreEl.textContent = 0;
  oScoreEl.textContent = 0;
  tiesEl.textContent = 0;
  round = 1;
  resetBoard();
};

renderBoard();
