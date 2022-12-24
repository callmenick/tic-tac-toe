/**
 * Tic Tac Toe
 *
 * A game played on a 3x3 grid, where players take turns playing x and o. One
 * player is assigned "x", and another assigned "o". Player "x" always playes
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
 * left to right, top to bottom:
 *
 *  0 | 1 | 2
 * ---|---|---
 *  3 | 4 | 5
 * ---|---|---
 *  6 | 7 | 8
 *
 * In code, we will represent our board as a 1-d array:
 *
 * [0, 1, 2, 3, 4, 5, 6, 7, 8]
 *
 * We will use this to assign spots when a player playes, and to determine the
 * outcome of the game with each passing move.
 */

/**
 * Finite states
 * A collection of states in which the game can be in
 */
export const FS = {
  player_x_turn: 'player_x_turn',
  player_o_turn: 'player_o_turn',
  player_x_wins: 'player_x_wins',
  player_o_wins: 'player_o_wins',
  draw: 'draw',
}

/**
 * Possible winning combinations on a 9 spot board
 */
export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function TicTacToe() {
  /**
   * Game state, defaults to player_x_turn as player "x" always begins
   */
  let state = FS.player_x_turn

  /**
   * Starting epresentation of the board, an array length 9 filled with
   * undefined as all entries
   */
  let board = new Array(9).fill(undefined)

  /**
   * Getter for game state
   */
  function getState() {
    return state
  }

  /**
   * Getter for game board
   */
  function getBoard() {
    return board
  }

  /**
   * Resets the state and board to an initial state
   */
  function reset() {
    state = FS.player_x_turn
    board = new Array(9).fill(undefined)
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
  function drawBoard() {
    const spot0 = ` ${board[0] ? board[0] : ' '} `
    const spot1 = ` ${board[1] ? board[1] : ' '} `
    const spot2 = ` ${board[2] ? board[2] : ' '} `
    const spot3 = ` ${board[3] ? board[3] : ' '} `
    const spot4 = ` ${board[4] ? board[4] : ' '} `
    const spot5 = ` ${board[5] ? board[5] : ' '} `
    const spot6 = ` ${board[6] ? board[6] : ' '} `
    const spot7 = ` ${board[7] ? board[7] : ' '} `
    const spot8 = ` ${board[8] ? board[8] : ' '} `

    return [
      `${spot0}|${spot1}|${spot2}`,
      '---|---|---',
      `${spot3}|${spot4}|${spot5}`,
      '---|---|---',
      `${spot6}|${spot7}|${spot8}`,
    ].join('\n')
  }

  /**
   * Plays a move at a specific index, and checks for possible outcomes
   */
  function play(index, onPlay = () => {}, onRetry = () => {}) {
    // if the game is in an ended state, don't allow play to continue
    if ([FS.player_x_wins, FS.player_o_wins, FS.draw].includes(state)) return

    let prevState = state
    let nextState

    // if the spot is filled, exit early
    if (board[index] !== undefined) {
      nextState = state
      onRetry(prevState, nextState)
      return
    }

    // if it's player x turn, fill the spot with "x"
    if (prevState === FS.player_x_turn) board[index] = 'x'

    // if it's player o turn, fill the spot with "o"
    if (prevState === FS.player_o_turn) board[index] = 'o'

    // now let's compare board spots to winning combination spots to find a
    // possible winner
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const winningCombination = WINNING_COMBINATIONS[i]
      const filledSpots = [
        board[winningCombination[0]],
        board[winningCombination[1]],
        board[winningCombination[2]],
      ].filter(Boolean)

      // if there's less than 3 filled spots for the winning combo, continue to
      // next iteration of the loop
      if (filledSpots.length < 3) continue

      // if all values in the filled spots are "x", update state to x wins and
      // exit function
      if (filledSpots.every((value) => value === 'x')) {
        nextState = state = FS.player_x_wins
        onPlay(prevState, nextState)
        return
      }

      // if all values in the filled spots are "o", update state to o wins and
      // break out of loop
      if (filledSpots.every((value) => value === 'o')) {
        nextState = state = FS.player_o_wins
        onPlay(prevState, nextState)
        return
      }
    }

    // if no winner found, check for a draw by seeing if the board is full
    if (board.filter(Boolean).length === 9) {
      nextState = state = FS.draw
      onPlay(prevState, nextState)
      return
    }

    // if prevState was player x turn, swap to player o turn
    if (prevState === FS.player_x_turn) {
      nextState = state = FS.player_o_turn
      onPlay(prevState, nextState)
      return
    }

    // if prevState was player o turn, swap to player x turn
    if (state === FS.player_o_turn) {
      nextState = state = FS.player_x_turn
      onPlay(prevState, nextState)
      return
    }
  }

  return {
    getState,
    getBoard,
    reset,
    drawBoard,
    play,
  }
}
