/**
 * Tic Tac Toe
 *
 * A game played on a 3x3 grid, where players take turns playing x and o. One
 * player is assigned "x", and another assigned "o". Player "x" always plays
 * first. The game resolves when a player gets 3 in a row either horizontally,
 * vertically, or diagonally.
 *
 * The board itself is 2-dimensional, and looks like this:
 *
 *    |   |
 * ---|---|---
 *    |   |
 * ---|---|---
 *    |   |
 *
 * For the purpose of the game logic, we'll assign an index to each square going
 *
 * In code, we will represent our board as a 2-d array:
 *
 *  00 | 01 | 02
 * ----|----|----
 *  10 | 11 | 12
 * ----|----|----
 *  20 | 21 | 22
 *
 * We will use this to assign cells when a player plays, and to determine the
 * outcome of the game with each passing move.
 */

/**
 * Starting epresentation of the board, 2d array with 3 entrys
 */
let board = [
  new Array(3).fill(undefined),
  new Array(3).fill(undefined),
  new Array(3).fill(undefined),
]

/**
 * Game state. Can be one of:
 *
 *   playing - game is in a playing state
 *   win - someone won the game
 *   draw - game is a draw
 *
 * Defaults to playing.
 */
let state = 'playing'

/**
 * Keep track of the current player, either "x" or "o"
 */
let currentPlayer = 'x'

/**
 * Gets the outcome of the board. First checks if there's any win states by
 * checking rows, cols, and diagonals. Then check if there's a draw.
 */
function getOutcome() {
  // check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === currentPlayer &&
      board[i][1] === currentPlayer &&
      board[i][2] === currentPlayer
    ) {
      return 'win'
    }
  }

  // check columns
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === currentPlayer &&
      board[1][j] === currentPlayer &&
      board[2][j] === currentPlayer
    ) {
      return 'win'
    }
  }

  // check first diagonal
  if (
    board[0][0] === currentPlayer &&
    board[1][1] === currentPlayer &&
    board[2][2] === currentPlayer
  ) {
    return 'win'
  }

  // check second diagonal
  if (
    board[0][2] === currentPlayer &&
    board[1][1] === currentPlayer &&
    board[2][0] === currentPlayer
  ) {
    return 'win'
  }

  // check if the board is full
  // flatten it, then filter out empty entries, then check the length
  if (board.flat().filter(Boolean).length === 9) {
    return 'draw'
  }

  return 'playing'
}

/**
 * Starts the game by transitioning to "playing" state
 */
export function start() {
  state = 'playing'
}

/**
 * Executes a play at coordinates x,y, where x is the row indeex, and y is the
 * column index
 */
export function play(x, y) {
  // don't allow playing if not in a playing state
  if (state !== 'playing') return

  // don't allow playing if the cell is filled
  if (board[x][y] !== undefined) throw new Error('cell already filled!')

  // reject out of bounds coordinates
  if (x < 0 || x > 2) throw new Error('illegal play!')
  if (y < 0 || y > 2) throw new Error('illegal play!')

  // fill the cell with the current player
  board[x][y] = currentPlayer

  // update state by getting outcome after the play
  state = getOutcome()

  // if game is still "playing", then swap the turn
  if (state === 'playing') {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x'
  }
}

/**
 * Resets the entire game to default state
 */
export function reset() {
  board = [
    new Array(3).fill(undefined),
    new Array(3).fill(undefined),
    new Array(3).fill(undefined),
  ]
  state = 'playing'
  currentPlayer = 'x'
}

/**
 * Getter for getting the board
 */
export function getBoard() {
  return board
}

/**
 * Getter for getting the state
 */
export function getState() {
  return state
}

/**
 * Getter for getting the current player
 */
export function getCurrentPlayer() {
  return currentPlayer
}

/**
 * A helper function to draw a visual reference of the board, e.g.:
 *
 *  x |   | x
 * ---|---|---
 *    | o | x
 * ---|---|---
 *    |   | o
 */
export function drawBoard() {
  const s00 = ` ${board[0][0] ? board[0][0] : ' '} `
  const s01 = ` ${board[0][1] ? board[0][1] : ' '} `
  const s02 = ` ${board[0][2] ? board[0][2] : ' '} `
  const s10 = ` ${board[1][0] ? board[1][0] : ' '} `
  const s11 = ` ${board[1][1] ? board[1][1] : ' '} `
  const s12 = ` ${board[1][2] ? board[1][2] : ' '} `
  const s20 = ` ${board[2][0] ? board[2][0] : ' '} `
  const s21 = ` ${board[2][1] ? board[2][1] : ' '} `
  const s22 = ` ${board[2][2] ? board[2][2] : ' '} `

  return [
    `${s00}|${s01}|${s02}`,
    '---|---|---',
    `${s10}|${s11}|${s12}`,
    '---|---|---',
    `${s20}|${s21}|${s22}`,
  ].join('\n')
}
