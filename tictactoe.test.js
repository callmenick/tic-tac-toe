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
  })
})
