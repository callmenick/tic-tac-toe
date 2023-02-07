import { play, reset, getState, getCurrentPlayer } from './tictactoe.js'

function main() {
  // get various elements in the dom
  const $board = document.querySelector('.board')
  const $boardCells = document.querySelectorAll('.board-cell')
  const $currentPlayer = document.querySelector('.current-player')
  const $resetButton = document.querySelector('.button-reset')

  // handle cell clicks
  function onCellClick($element, index) {
    // get state and current player before the play is made
    const stateBeforePlay = getState()
    const currentPlayerBeforePlay = getCurrentPlayer()

    // halt execution if the game is not in a playing state
    if (stateBeforePlay !== 'playing') return

    // get the row and col based on cell index
    const row = Math.floor(index / 3)
    const col = index % 3

    try {
      // attempt to make the play
      play(row, col)

      // update the cell with the player who just played
      $element.innerHTML = currentPlayerBeforePlay
      $element.classList.add('filled')

      // get the state and current player after the play is made
      const stateAfterPlay = getState()
      const currentPlayerAfterPlay = getCurrentPlayer()

      // decide what to do depending on state after play
      switch (stateAfterPlay) {
        case 'win': {
          // run this in a setTimeout so the dom gets filled before the alert
          // pops up on screen
          setTimeout(() => alert(`player ${currentPlayerBeforePlay} wins!`), 0)
          break
        }
        case 'draw': {
          alert(`draw!`)
          break
        }
        case 'playing': {
          $currentPlayer.innerHTML = currentPlayerAfterPlay
          break
        }
        default:
          break
      }
    } catch (error) {
      alert(error)
    }
  }

  // handle game reset
  function onReset() {
    reset()
    $board.classList.add('board-inactive')
    $board.classList.remove('board-active')
    $boardCells.forEach((cell) => (cell.innerHTML = ''))
    $currentPlayer.innerHTML = getCurrentPlayer()
  }

  // add currentPlayer to dom
  $currentPlayer.innerHTML = getCurrentPlayer()

  // handle click event for board cells
  $boardCells.forEach((element, index) => {
    element.addEventListener('click', () => {
      onCellClick(element, index)
    })
  })

  // handle click event for reset button
  $resetButton.addEventListener('click', () => {
    onReset()
  })
}

document.addEventListener('DOMContentLoaded', main)
