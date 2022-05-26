'use strict'
const BOMB = '&#128163;'
const FLAG = '&#128681;'
const NOMINES = 'hsl(0, 0%, 43%)'
const HEART = '\u2764'
const WIN = '	&#128526;'
const LOSE = '&#129327;'
const NORMAL = '&#128515;'


var gBoard

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
        lives: gCurrLevel1 ? 1 : 3
    }
    gElSmiley.innerHTML = NORMAL
    updateLives()
    var gMsec = 0;
    var gSec = 0;
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
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAround = countMinesAround(board, i, j)
        }
    }

}

function cellClicked(elCell, i, j) {

    if (!gGame.isOn) {
        startGame()

    } else {

        var cellLocation= {
            i,
            j,
        }

        
    
    // var cellLocation = getTdId(elCell)
    var cell = gBoard[i][j]
    console.log('CellLocation: ', gBoard[i][j]);
    //Make sure the cell isn't shown so it won't cause looping
    if (cell.isShown) return
    cell.isShown = true;
    if (cell.isMine) {
        renderCell(cellLocation, BOMB)

        if (gGame.lives > 1) {
            gGame.lives--
            console.log('hi');
            updateLives()

        } else {
            gGame.lives--
            updateLives()
            var gElH2RestartGame = document.querySelector('.restart-game h2');
            gElH2RestartGame.innerText = 'You Lost The Game!'
            gElSmiley.innerHTML = LOSE

            gameOver()
        }
    } else {
        renderCell(cellLocation, cell.minesAround)
        gGame.shownCount++

        if (cell.minesAround === 0) {
            elCell.innerText = ''
            elCell.style.backgroundColor = NOMINES
            //send it to neighbors count to empty all the cells that has no numbers
            clearEmptyCellsAround(gBoard, i, j)
        }
    }
    checkGameOver()
}

}

function cellMarked(elCell, ev) {
    ev.preventDefault()
    if (gGame.isOn) {
        var cellLocation = getTdId(elCell)
        var cell = gBoard[cellLocation.i][cellLocation.j]
        if (!cell.isShown) {
            cell.isMarked = true;
            renderCell(cellLocation, FLAG)
            //
            if (cell.isMine) gGame.markedCount++

        }
        checkGameOver()
    }

}

function plantMines(board) {

    var randomLocations = {

    }
    for (let i = 0; i < gLevel.MINES; i++) {
        randomLocations.i = getRandomInt(0, gLevel.SIZE)
        randomLocations.j = getRandomInt(0, gLevel.SIZE)

        //I used an if statment to ensure that the randomLocations doesn't repeat itself so there are atleast the right amount of mines
        if (randomLocations !== lastLocations) {
            board[randomLocations.i][randomLocations.j].isMine = true

        } else {
            i--
        }
        var lastLocations = {
            lasLocationI: randomLocations.i,
            lasLocationJ: randomLocations.j,
        }
    }
}

