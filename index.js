import {
  start,
  play,
  replay,
  reset,
  getState,
  getCurrentPlayer,
} from './tictactoe.js'

function main() {
  // get various elements in the dom
  const $board = document.querySelector('.board')
  const $boardCells = document.querySelectorAll('.board-cell')
  const $currentPlayer = document.querySelector('.current-player')
  const $startButton = document.querySelector('.button-start')
  const $replayButton = document.querySelector('.button-replay')
  const $resetButton = document.querySelector('.button-reset')

  // handle cell clicks
  function onCellClick($element, index) {
    let state = getState()
    let currentPlayer = getCurrentPlayer()

    // don't bother with dom logic if the game is not in a playing state
    if (state !== 'playing') return

    // get the row and col based on cell index
    const row = Math.floor(index / 3)
    const col = index % 3

    try {
      // make the play
      play(row, col)

      // update the cell with the current player
      $element.innerHTML = currentPlayer
      $element.classList.add('filled')

      state = getState()

      // decide what to do depending on the next state
      switch (state) {
        case 'win': {
          alert(`player ${currentPlayer} wins!`)
          break
        }
        case 'draw': {
          alert(`draw!`)
          break
        }
        case 'playing': {
          currentPlayer = getCurrentPlayer()
          $currentPlayer.innerHTML = currentPlayer
          break
        }
        default:
          break
      }
    } catch (error) {
      alert(error)
    }
  }

  // handle game start
  function onStart() {
    start()
    $currentPlayer.innerHTML = getCurrentPlayer()
    $board.classList.add('board-active')
    $board.classList.remove('board-inactive')
    $startButton.setAttribute('disabled', true)
    $replayButton.removeAttribute('disabled')
    $resetButton.removeAttribute('disabled')
  }

  // handle game replay
  function onReplay() {
    replay()
    $boardCells.forEach((cell) => (cell.innerHTML = ''))
    $currentPlayer.innerHTML = getCurrentPlayer()
    $startButton.removeAttribute('disabled')
    $replayButton.setAttribute('disabled', true)
    $resetButton.setAttribute('disabled', true)
  }

  // handle game reset
  function onReset() {
    reset()
    $board.classList.add('board-inactive')
    $board.classList.remove('board-active')
    $boardCells.forEach((cell) => (cell.innerHTML = ''))
    $currentPlayer.innerHTML = '-'
    $startButton.removeAttribute('disabled')
    $replayButton.setAttribute('disabled', true)
    $resetButton.setAttribute('disabled', true)
  }

  // handle click event for board cells
  $boardCells.forEach((element, index) => {
    element.addEventListener('click', () => {
      onCellClick(element, index)
    })
  })

  // handle click event for start button
  $startButton.addEventListener('click', () => {
    onStart()
  })

  // handle click event for replay button
  $replayButton.addEventListener('click', () => {
    onReplay()
  })

  // handle click event for reset button
  $resetButton.addEventListener('click', () => {
    onReset()
  })
}

document.addEventListener('DOMContentLoaded', main)
