import TicTacToe from './tictactoe'

describe('tictactoe', () => {
  describe('base configuration', () => {
    test('default state is idle', () => {
      const tictactoe = TicTacToe()
      const state = tictactoe.getState()
      expect(state).toEqual('idle')
    })

    test('board size is 9', () => {
      const tictactoe = TicTacToe()
      const board = tictactoe.getBoard()
      expect(board.length).toEqual(9)
    })

    test('board is empty', () => {
      const tictactoe = TicTacToe()
      const board = tictactoe.getBoard()
      expect(board.filter(Boolean).length).toEqual(0)
    })
  })

  describe('game play', () => {
    test('expect game to transition to player x turn after starting', () => {
      const tictactoe = TicTacToe()
      let state = tictactoe.getState()
      expect(state).toEqual('idle')

      tictactoe.start()
      state = tictactoe.getState()
      expect(state).toEqual('player_x_turn')
    })

    test('expect players to take turns if game is in continuous play state', () => {
      const tictactoe = TicTacToe()
      tictactoe.start()

      // x plays in spot 0
      tictactoe.play(0)
      let state = tictactoe.getState()
      expect(state).toEqual('player_o_turn')

      // o plays in spot 1
      tictactoe.play(1)
      state = tictactoe.getState()
      expect(state).toEqual('player_x_turn')

      // x plays in spot 2
      tictactoe.play(2)
      state = tictactoe.getState()
      expect(state).toEqual('player_o_turn')

      // attempt to play in an already filled spot
      tictactoe.play(2)
      state = tictactoe.getState()
      expect(state).toEqual('player_o_turn')

      // check that the board is filled with correct number of spots and correct
      // values for each spot
      const board = tictactoe.getBoard()
      expect(board.filter(Boolean).length).toEqual(3)
      expect(board[0]).toEqual('x')
      expect(board[1]).toEqual('o')
      expect(board[2]).toEqual('x')
    })

    describe('x win sequences', () => {
      // define play sequences for which x wins
      const xWinningSequences = [
        [0, 3, 1, 4, 2],
        [3, 0, 4, 1, 5],
        [6, 0, 7, 1, 8],
        [0, 1, 3, 2, 6],
        [1, 0, 4, 3, 7],
        [2, 0, 5, 3, 8],
        [0, 1, 4, 2, 8],
        [2, 1, 4, 8, 6],
      ]

      for (let i = 0; i < xWinningSequences.length; i++) {
        const tictactoe = TicTacToe()
        const xWinningSequence = xWinningSequences[i]
        tictactoe.start()

        test(`expect x to win for play sequence ${xWinningSequence.toString()}`, () => {
          for (let j = 0; j < xWinningSequence.length; j++) {
            let spot = xWinningSequence[j]
            tictactoe.play(spot)
          }
          const state = tictactoe.getState()
          expect(state).toEqual('player_x_wins')
        })
      }
    })

    describe('o win sequences', () => {
      const oWinningSequences = [
        [3, 0, 7, 1, 8, 2],
        [0, 3, 7, 4, 8, 5],
        [0, 6, 3, 7, 4, 8],
        [1, 0, 2, 3, 8, 6],
        [0, 1, 3, 4, 8, 7],
        [0, 2, 1, 5, 3, 8],
        [1, 0, 2, 4, 3, 8],
        [0, 2, 1, 4, 3, 6],
      ]

      for (let i = 0; i < oWinningSequences.length; i++) {
        const tictactoe = TicTacToe()
        const oWinningSequence = oWinningSequences[i]
        tictactoe.start()

        test(`expect o to win for play sequence ${oWinningSequence.toString()}`, () => {
          for (let j = 0; j < oWinningSequence.length; j++) {
            let spot = oWinningSequence[j]
            tictactoe.play(spot)
          }
          const state = tictactoe.getState()
          expect(state).toEqual('player_o_wins')
        })
      }
    })

    test('expect draw if play sequence results in full board with no winner', () => {
      const tictactoe = TicTacToe()
      tictactoe.start()

      tictactoe.play(0)
      tictactoe.play(4)
      tictactoe.play(1)
      tictactoe.play(2)
      tictactoe.play(6)
      tictactoe.play(3)
      tictactoe.play(5)
      tictactoe.play(7)
      tictactoe.play(8)

      const state = tictactoe.getState()
      expect(state).toEqual('draw')
    })

    test('expect state and board to reset on reset', () => {
      const tictactoe = TicTacToe()

      let state = tictactoe.getState()
      let board = tictactoe.getBoard()
      expect(state).toEqual('idle')
      expect(board.filter(Boolean).length).toEqual(0)

      tictactoe.start()
      state = tictactoe.getState()
      board = tictactoe.getBoard()
      expect(state).toEqual('player_x_turn')
      expect(board.filter(Boolean).length).toEqual(0)

      tictactoe.play(0)
      state = tictactoe.getState()
      board = tictactoe.getBoard()
      expect(state).toEqual('player_o_turn')
      expect(board.filter(Boolean).length).toEqual(1)

      tictactoe.play(1)
      state = tictactoe.getState()
      board = tictactoe.getBoard()
      expect(state).toEqual('player_x_turn')
      expect(board.filter(Boolean).length).toEqual(2)

      tictactoe.reset()
      state = tictactoe.getState()
      board = tictactoe.getBoard()
      expect(state).toEqual('idle')
      expect(board.filter(Boolean).length).toEqual(0)
    })

    test('execute onPlay callback if game can continue', () => {
      const tictactoe = TicTacToe()
      tictactoe.start()

      const onPlay = jest.fn((prevState, nextState) => [prevState, nextState])

      tictactoe.play(0, onPlay)
      expect(onPlay.mock.calls.length).toBe(1)
      expect(onPlay.mock.calls[0][0]).toBe('player_x_turn')
      expect(onPlay.mock.calls[0][1]).toBe('player_o_turn')

      tictactoe.play(1, onPlay)
      expect(onPlay.mock.calls.length).toBe(2)
      expect(onPlay.mock.calls[1][0]).toBe('player_o_turn')
      expect(onPlay.mock.calls[1][1]).toBe('player_x_turn')
    })

    test('execute onRetry callback if player has to retry', () => {
      const tictactoe = TicTacToe()
      tictactoe.start()

      const onRetry = jest.fn((prevState, nextState) => [prevState, nextState])

      tictactoe.play(0)
      tictactoe.play(0, undefined, onRetry)
      expect(onRetry.mock.calls.length).toBe(1)
      expect(onRetry.mock.calls[0][0]).toBe('player_o_turn')
      expect(onRetry.mock.calls[0][1]).toBe('player_o_turn')
    })

    test('expect winner to be returned as next state from callback', () => {
      // define mocks for all callbacks
      const onPlay = jest.fn((prevState, nextState) => [prevState, nextState])
      const onRetry = jest.fn((prevState, nextState) => [prevState, nextState])

      // test against x win sequence
      const tictactoeXWinner = TicTacToe()
      tictactoeXWinner.start()
      tictactoeXWinner.play(0, onPlay, onRetry)
      tictactoeXWinner.play(3, onPlay, onRetry)
      tictactoeXWinner.play(1, onPlay, onRetry)
      tictactoeXWinner.play(4, onPlay, onRetry)
      tictactoeXWinner.play(2, onPlay, onRetry)
      expect(onRetry.mock.calls.length).toBe(0)
      expect(onPlay.mock.calls.length).toBe(5)
      expect(onPlay.mock.calls[4][0]).toBe('player_x_turn')
      expect(onPlay.mock.calls[4][1]).toBe('player_x_wins')

      // clear these mocks to reuse them below
      onPlay.mockClear()
      onRetry.mockClear()

      // test against o win sequence
      const tictactoeOWinner = TicTacToe()
      tictactoeOWinner.start()
      tictactoeOWinner.play(3, onPlay, onRetry)
      tictactoeOWinner.play(0, onPlay, onRetry)
      tictactoeOWinner.play(7, onPlay, onRetry)
      tictactoeOWinner.play(1, onPlay, onRetry)
      tictactoeOWinner.play(8, onPlay, onRetry)
      tictactoeOWinner.play(2, onPlay, onRetry)
      expect(onRetry.mock.calls.length).toBe(0)
      expect(onPlay.mock.calls.length).toBe(6)
      expect(onPlay.mock.calls[5][0]).toBe('player_o_turn')
      expect(onPlay.mock.calls[5][1]).toBe('player_o_wins')
    })

    test('execute onDraw callback if game is a draw', () => {
      const onPlay = jest.fn((prevState, nextState) => [prevState, nextState])
      const onRetry = jest.fn((prevState, nextState) => [prevState, nextState])
      const tictactoe = TicTacToe()

      tictactoe.start()
      tictactoe.play(0, onPlay, onRetry)
      tictactoe.play(4, onPlay, onRetry)
      tictactoe.play(1, onPlay, onRetry)
      tictactoe.play(2, onPlay, onRetry)
      tictactoe.play(6, onPlay, onRetry)
      tictactoe.play(3, onPlay, onRetry)
      tictactoe.play(5, onPlay, onRetry)
      tictactoe.play(7, onPlay, onRetry)
      tictactoe.play(8, onPlay, onRetry)

      expect(onRetry.mock.calls.length).toBe(0)
      expect(onPlay.mock.calls.length).toBe(9)
      expect(onPlay.mock.calls[8][0]).toBe('player_x_turn')
      expect(onPlay.mock.calls[8][1]).toBe('draw')
    })
  })
})
