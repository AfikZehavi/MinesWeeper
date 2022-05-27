'use strict'
const BOMB = '&#128163;'
const FLAG = '&#128681;'
const NOMINES = 'hsl(0, 0%, 43%)'
const HEART = '\u2764'
const WIN = '	&#128526;'
const LOSE = '&#129327;'
const NORMAL = '&#128515;'


var gBoard
var gSafeCellTimeOut
var gGame
var gCurrLevel1 = true

var gLevel = {
    SIZE: 4,
    MINES: 2,
}


function init() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: gCurrLevel1 ? 1 : 3,
        safeClicks: 3
    }
    var elsafeClickBtn = document.querySelector('.safe-click-btn')
    elsafeClickBtn.innerHTML = `Safe Click <br>Remaining: ${gGame.safeClicks}`
    gElSmiley.innerHTML = NORMAL
    updateLives()

    clearInterval(gTimeInterval)
    gBoard = createBoard(gLevel.SIZE, gLevel.MINES)
    countAllMinesAround(gBoard)
    printMat(gBoard, '.board-container')

}
function createBoard(boardSize) {
    var board = []
    for (var i = 0; i < boardSize; i++) {
        board.push([])
        for (var j = 0; j < boardSize; j++) {
            var cell = {
                minesAround: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }

            board[i][j] = cell

        }
    }
    plantMines(board)

    return board
}


function countAllMinesAround(board) {
    //Define the numbers inside a cell by counting th mines around
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAround = countMinesAround(board, i, j)
        }
    }

}

function cellClicked(elCell, i, j) {
    //First check if the game is on, if not, the first click on a cell will turn it on
    if (!gGame.isOn) {
        startGame()

    } else {

        var cellLocation = {
            i,
            j,
        }

        var cell = gBoard[i][j]

        //Cancel the option to click on shown cellls
        if (cell.isShown) return

        cell.isShown = true;
        if (cell.isMine) {
            renderCell(cellLocation, BOMB)
            // If the cell is a mine we will check the lives left in the gGame object
            if (gGame.lives > 1) {
                gGame.lives--
                updateLives()

            } else {
                // If no lives left we will finish the game by calling gameOver() function

                gGame.lives--
                updateLives()
                //Update the model in the restart game popup
                var gElH2RestartGame = document.querySelector('.restart-game h2');
                gElH2RestartGame.innerText = 'You Lost The Game!'
                gElSmiley.innerHTML = LOSE
                revealBombs()
                gameOver()
            }
        } else {

            renderCell(cellLocation, cell.minesAround)
            gGame.shownCount++

            if (cell.minesAround === 0) {
                //If there are no mines, we will update the model (the DOM was updated earlier)
                elCell.innerText = ''
                elCell.style.backgroundColor = NOMINES
                //send it clearEmptyCellsAround() to reveal all the neighbors that are also empty or have mines around.
                clearEmptyCellsAround(gBoard, i, j)
                clearTimeout(gSafeCellTimeOut)
            }
        }
        checkGameOver()
    }

}

function markCell(ev, i, j) {
    ev.preventDefault()
    //Mark cells with flags
    if (gGame.isOn) {

        var cellLocation = {
            i,
            j,
        }

        var cell = gBoard[i][j]

        if (!cell.isShown && !cell.isMarked) {
            //Update the model
            cell.isMarked = true;
            //Update the DOM element
            renderCell(cellLocation, FLAG)
            if (cell.isMine) gGame.markedCount++

        }
    }
    checkGameOver()

}

function plantMines(board) {

    var randomLocations = {}

    for (let i = 0; i < gLevel.MINES; i++) {
        randomLocations.i = getRandomInt(0, gLevel.SIZE)
        randomLocations.j = getRandomInt(0, gLevel.SIZE)

        //I used an if statment to ensure that the randomLocations
        //  doesn't repeat itself so there are the right amount of mines
        if (randomLocations !== lastLocations) {
            board[randomLocations.i][randomLocations.j].isMine = true

        } //If they are the same random numbers, we will go back in the loop decreasing the i(index) 
        else {
            i--
        }
        var lastLocations = {
            lasLocationI: randomLocations.i,
            lasLocationJ: randomLocations.j,
        }
    }
}

function revealBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                var bombLocation = {
                    i,
                    j,
                }
                renderCell(bombLocation, BOMB)
            }


        }

    }
}

function findSafeClick(elBtn) {
    if (!gGame.isOn) {
        startGame()
    }
    if (gGame.safeClicks > 0) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                    var elCell = document.querySelector(`.cell-${i}-${j}`);
                    elCell.style.backgroundColor = 'aliceblue'
                    gSafeCellTimeOut = setTimeout(() => {
                        elCell.style.backgroundColor = 'hsl(0, 0%, 73%)'
                        
                    }, 700);
                    gGame.safeClicks--
                    console.log(gGame.safeClicks);
                    elBtn.innerHTML = `Safe Click <br>Remaining: ${gGame.safeClicks}`
                    return
                }
    
    
            }
    
        }

    }
}