import {
  play,
  start,
  reset,
  getBoard,
  getState,
  getCurrentPlayer,
} from './tictactoe'

beforeEach(() => {
  reset()
})

describe('tictactoe', () => {
  describe('idle state', () => {
    test('default state is idle', () => {
      const state = getState()
      expect(state).toEqual('idle')
    })

    test('board is empty', () => {
      const board = getBoard()
      expect(board.flat().filter(Boolean).length).toEqual(0)
    })
  })

  describe('game play', () => {
    test('expect game to transition to playing on start, and current player to be x', () => {
      let state = getState()
      let currentPlayer = getCurrentPlayer()
      expect(state).toEqual('idle')
      start()
      state = getState()
      expect(state).toEqual('playing')
      expect(currentPlayer).toEqual('x')
    })

    test('expect players to take turns if game is in continuous play state', () => {
      let state = getState()
      let currentPlayer = getCurrentPlayer()
      expect(state).toEqual('idle')
      expect(currentPlayer).toEqual('x')

      start()

      state = getState()
      expect(state).toEqual('playing')

      play(0, 0)
      state = getState()
      currentPlayer = getCurrentPlayer()
      expect(state).toEqual('playing')
      expect(currentPlayer).toEqual('o')

      play(0, 1)
      state = getState()
      currentPlayer = getCurrentPlayer()
      expect(state).toEqual('playing')
      expect(currentPlayer).toEqual('x')

      // x plays in spot 2
      play(0, 2)
      state = getState()
      currentPlayer = getCurrentPlayer()
      expect(state).toEqual('playing')
      expect(currentPlayer).toEqual('o')

      // attempt to play in an already filled spot
      play(0, 2)
      state = getState()
      currentPlayer = getCurrentPlayer()
      expect(state).toEqual('playing')
      expect(currentPlayer).toEqual('o')

      // check that the board is filled with correct number of spots and correct
      // values for each spot
      let board = getBoard()
      expect(board[0][0]).toEqual('x')
      expect(board[0][1]).toEqual('o')
      expect(board[0][2]).toEqual('x')
    })

    describe('x win sequences', () => {
      // Define play sequences for which x wins. Each of the sub arrays
      // represent the x,y (row,col) coordinates for the alternating turns of x
      // and o. By playing these turns in order, we can expect x to win.
      const winningSequences = [
        [
          [0, 0],
          [0, 2],
          [1, 0],
          [1, 2],
          [2, 0],
        ],
        [
          [1, 0],
          [0, 0],
          [1, 1],
          [0, 1],
          [1, 2],
        ],
        [
          [2, 0],
          [0, 0],
          [2, 1],
          [0, 1],
          [2, 2],
        ],
        [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
          [2, 0],
        ],
        [
          [0, 1],
          [0, 0],
          [1, 1],
          [1, 0],
          [2, 1],
        ],
        [
          [0, 2],
          [0, 0],
          [1, 2],
          [1, 0],
          [2, 2],
        ],
        [
          [0, 0],
          [0, 1],
          [1, 1],
          [0, 2],
          [2, 2],
        ],
        [
          [0, 2],
          [0, 0],
          [1, 1],
          [1, 0],
          [2, 0],
        ],
      ]

      for (let i = 0; i < winningSequences.length; i++) {
        let winningSequence = winningSequences[i]
        let winningSequenceString = winningSequence.map(
          (s) => `[${s.join('')}]`
        )
        test(`expect x to win for play sequence ${winningSequenceString}`, () => {
          start()
          for (let j = 0; j < winningSequence.length; j++) {
            let spot = winningSequence[j]
            play(...spot)
          }
          let state = getState()
          let currentPlayer = getCurrentPlayer()
          expect(state).toEqual('win')
          expect(currentPlayer).toEqual('x')
        })
      }
    })

    describe('o win sequences', () => {
      // Define play sequences for which x wins. Each of the sub arrays
      // represent the x,y (row,col) coordinates for the alternating turns of x
      // and o. By playing these turns in order, we can expect x to win.
      const winningSequences = [
        [
          [2, 1],
          [0, 0],
          [0, 2],
          [1, 0],
          [1, 2],
          [2, 0],
        ],
        [
          [2, 2],
          [1, 0],
          [0, 0],
          [1, 1],
          [0, 1],
          [1, 2],
        ],
        [
          [1, 0],
          [2, 0],
          [0, 0],
          [2, 1],
          [0, 1],
          [2, 2],
        ],
        [
          [2, 2],
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1],
          [2, 0],
        ],
        [
          [2, 2],
          [0, 1],
          [0, 0],
          [1, 1],
          [1, 0],
          [2, 1],
        ],
        [
          [1, 1],
          [0, 2],
          [0, 0],
          [1, 2],
          [1, 0],
          [2, 2],
        ],
        [
          [1, 0],
          [0, 0],
          [0, 1],
          [1, 1],
          [0, 2],
          [2, 2],
        ],
        [
          [0, 1],
          [0, 2],
          [0, 0],
          [1, 1],
          [1, 0],
          [2, 0],
        ],
      ]

      for (let i = 0; i < winningSequences.length; i++) {
        let winningSequence = winningSequences[i]
        let winningSequenceString = winningSequence.map(
          (s) => `[${s.join('')}]`
        )
        test(`expect o to win for play sequence ${winningSequenceString}`, () => {
          start()
          for (let j = 0; j < winningSequence.length; j++) {
            let spot = winningSequence[j]
            play(...spot)
          }
          let state = getState()
          let currentPlayer = getCurrentPlayer()
          expect(state).toEqual('win')
          expect(currentPlayer).toEqual('o')
        })
      }
    })

    test('expect draw if play sequence results in full board with no winner', () => {
      start()
      play(0, 0)
      play(0, 1)
      play(0, 2)
      play(2, 2)
      play(1, 2)
      play(1, 1)
      play(2, 1)
      play(2, 0)
      play(1, 0)
      const state = getState()
      expect(state).toEqual('draw')
    })

    test('expect state and board to reset on reset', () => {
      let state = getState()
      let board = getBoard()
      expect(state).toEqual('idle')
      expect(board.flat().filter(Boolean).length).toEqual(0)
      start()
      state = getState()
      board = getBoard()
      expect(state).toEqual('playing')
      expect(board.flat().filter(Boolean).length).toEqual(0)
      play(0, 0)
      state = getState()
      board = getBoard()
      expect(state).toEqual('playing')
      expect(board.flat().filter(Boolean).length).toEqual(1)
      play(1, 0)
      state = getState()
      board = getBoard()
      expect(state).toEqual('playing')
      expect(board.flat().filter(Boolean).length).toEqual(2)
      reset()
      state = getState()
      board = getBoard()
      expect(state).toEqual('idle')
      expect(board.flat().filter(Boolean).length).toEqual(0)
    })
  })
})
