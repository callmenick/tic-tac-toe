import TicTacToe, { FS } from './tictactoe.js'

function main() {
  // initialise a new game
  const tictactoe = TicTacToe()

  // get various elements in the dom
  const board = document.querySelector('.board')
  const boardSpots = document.querySelectorAll('.board-spot')
  const turn = document.querySelector('.turn')
  const startButton = document.querySelector('.button-start')
  const restartButton = document.querySelector('.button-restart')
  const resetButton = document.querySelector('.button-reset')

  // handle cell clicks
  function onSpotClick(element, index) {
    tictactoe.play(
      index,
      (prevState, nextState) => {
        // add .filled class to spot
        element.classList.add('filled')

        // fill squares based on previous state
        if (prevState === FS.player_x_turn) element.innerHTML = 'x'
        if (prevState === FS.player_o_turn) element.innerHTML = 'o'

        // handle outcomes based on next state
        if (nextState === FS.player_x_turn) turn.innerHTML = 'x'
        if (nextState === FS.player_o_turn) turn.innerHTML = 'o'
        if (nextState === FS.player_x_wins) alert('X Wins!')
        if (nextState === FS.player_o_wins) alert('O Wins!')
        if (nextState === FS.draw) alert('Draw!')
      },
      () => {
        alert('Spot already filled!')
      }
    )
  }

  // handle game start
  function onStart() {
    tictactoe.start()
    turn.innerHTML = 'x'
    board.classList.add('board-active')
    board.classList.remove('board-inactive')
    startButton.setAttribute('disabled', true)
    restartButton.removeAttribute('disabled')
    resetButton.removeAttribute('disabled')
  }

  // handle game restart
  function onRestart() {
    tictactoe.restart()
    turn.innerHTML = 'x'
    board.classList.add('board-active')
    board.classList.remove('board-inactive')
    boardSpots.forEach((spot) => (spot.innerHTML = ''))
    startButton.setAttribute('disabled', true)
    restartButton.removeAttribute('disabled')
    resetButton.removeAttribute('disabled')
  }

  // handle game reset
  function onReset() {
    tictactoe.reset()
    board.classList.add('board-inactive')
    board.classList.remove('board-active')
    boardSpots.forEach((spot) => (spot.innerHTML = ''))
    turn.innerHTML = '-'
    startButton.removeAttribute('disabled')
    restartButton.setAttribute('disabled', true)
    resetButton.setAttribute('disabled', true)
  }

  // handle click event for board spots
  boardSpots.forEach((element, index) => {
    element.addEventListener('click', () => {
      onSpotClick(element, index)
    })
  })

  // handle click event for start button
  startButton.addEventListener('click', () => {
    onStart()
  })

  // handle click event for restart button
  restartButton.addEventListener('click', () => {
    onRestart()
  })

  // handle click event for reset button
  resetButton.addEventListener('click', () => {
    onReset()
  })
}

document.addEventListener('DOMContentLoaded', main)
