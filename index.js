import TicTacToe, { FS } from './tictactoe.js'

function main() {
  // initialise a new game
  const tictactoe = TicTacToe()

  // get various elements in the dom
  const spots = document.querySelectorAll('.board-spot')
  const turn = document.querySelector('.turn')
  const restartButton = document.querySelector('.button-restart')

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

  // handle game restart
  function onRestart() {
    tictactoe.reset()
    spots.forEach((spot) => (spot.innerHTML = ''))
    turn.innerHTML = 'x'
  }

  // handle click event for board spots
  spots.forEach((element, index) => {
    element.addEventListener('click', () => {
      onSpotClick(element, index)
    })
  })

  // handle click event for reset button
  restartButton.addEventListener('click', () => {
    onRestart()
  })
}

document.addEventListener('DOMContentLoaded', main)
