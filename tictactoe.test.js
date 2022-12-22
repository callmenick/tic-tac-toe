import TicTacToe from './tictactoe'

describe('tictactoe', () => {
  describe('base configuration', () => {
    test('default state is player_x_turn', () => {
      const game = TicTacToe()
      const state = game.getState()
      expect(state).toEqual('player_x_turn')
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
    test('expect that player x can play anywhere on first turn and fill the spot', () => {
      const tictactoe = TicTacToe()
      tictactoe.play(1)
      const board = tictactoe.getBoard()
      expect(board[1]).toEqual('x')
    })

    test('expect players to take turns if game is in continuous play state', () => {
      const tictactoe = TicTacToe()

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

    test('execute onContinue callback if game can continue', () => {
      const tictactoe = TicTacToe()
      const onContinue = jest.fn((state) => state)
      tictactoe.play(0, onContinue)
      expect(onContinue.mock.calls.length).toBe(1)
      expect(onContinue.mock.calls[0][0]).toBe('player_o_turn')
      tictactoe.play(1, onContinue)
      expect(onContinue.mock.calls.length).toBe(2)
      expect(onContinue.mock.calls[1][0]).toBe('player_x_turn')
    })

    test('execute onRetry callback if player has to retry', () => {
      const tictactoe = TicTacToe()
      const onRetry = jest.fn((state) => state)
      tictactoe.play(0)
      tictactoe.play(0, undefined, onRetry)
      expect(onRetry.mock.calls.length).toBe(1)
      expect(onRetry.mock.calls[0][0]).toBe('player_o_turn')
    })

    test('execute onWin callback if player wins', () => {
      // define mocks for all callbacks
      const onContinue = jest.fn((state) => state)
      const onRetry = jest.fn((state) => state)
      const onXWin = jest.fn((state) => state)
      const onOWin = jest.fn((state) => state)
      const onDraw = jest.fn((state) => state)

      // test against x win sequence
      const tictactoeXWinner = TicTacToe()
      tictactoeXWinner.play(0, onContinue, onRetry, onXWin, onDraw)
      tictactoeXWinner.play(3, onContinue, onRetry, onXWin, onDraw)
      tictactoeXWinner.play(1, onContinue, onRetry, onXWin, onDraw)
      tictactoeXWinner.play(4, onContinue, onRetry, onXWin, onDraw)
      tictactoeXWinner.play(2, onContinue, onRetry, onXWin, onDraw)
      expect(onContinue.mock.calls.length).toBe(4)
      expect(onRetry.mock.calls.length).toBe(0)
      expect(onDraw.mock.calls.length).toBe(0)
      expect(onXWin.mock.calls.length).toBe(1)
      expect(onXWin.mock.calls[0][0]).toBe('player_x_wins')

      // clear these mocks to reuse them below
      onContinue.mockClear()
      onRetry.mockClear()
      onDraw.mockClear()

      // test against o win sequence
      const tictactoeOWinner = TicTacToe()
      tictactoeOWinner.play(3, onContinue, onRetry, onOWin, onDraw)
      tictactoeOWinner.play(0, onContinue, onRetry, onOWin, onDraw)
      tictactoeOWinner.play(7, onContinue, onRetry, onOWin, onDraw)
      tictactoeOWinner.play(1, onContinue, onRetry, onOWin, onDraw)
      tictactoeOWinner.play(8, onContinue, onRetry, onOWin, onDraw)
      tictactoeOWinner.play(2, onContinue, onRetry, onOWin, onDraw)
      expect(onContinue.mock.calls.length).toBe(5)
      expect(onRetry.mock.calls.length).toBe(0)
      expect(onDraw.mock.calls.length).toBe(0)
      expect(onOWin.mock.calls.length).toBe(1)
      expect(onOWin.mock.calls[0][0]).toBe('player_o_wins')
    })

    test('execute onDraw callback if game is a draw', () => {
      const onContinue = jest.fn((state) => state)
      const onRetry = jest.fn((state) => state)
      const onWin = jest.fn((state) => state)
      const onDraw = jest.fn((state) => state)
      const tictactoe = TicTacToe()

      tictactoe.play(0, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(4, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(1, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(2, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(6, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(3, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(5, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(7, onContinue, onRetry, onWin, onDraw)
      tictactoe.play(8, onContinue, onRetry, onWin, onDraw)

      expect(onContinue.mock.calls.length).toBe(8)
      expect(onRetry.mock.calls.length).toBe(0)
      expect(onWin.mock.calls.length).toBe(0)
      expect(onDraw.mock.calls.length).toBe(1)
      expect(onDraw.mock.calls[0][0]).toBe('draw')
    })
  })
})
