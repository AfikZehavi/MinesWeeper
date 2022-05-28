//Didn't use strict mode here to activate time with milsecs and secs
var gMsec = 00;
var gSec = 00;
var gMin = 00;
var gTimeInterval
var gElRestartGame = document.querySelector('.restart-game')
var gElSmiley = document.querySelector('.smiley-container')
var gCheckLevels

function printMat(mat, selector) {
    //Update the DOM
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})" oncontextmenu="markCell(event,${i},${j})";></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function checkGameOver() {
//Sum the cells that are marked currectly (If they marked a mine) and the cells that are shown, if the equal to the size of the board then it's a WIN.
    if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2) {
        var gElH2RestartGame = document.querySelector('.restart-game h2');
        gElH2RestartGame.innerText = 'You Won The Game!'
        gElSmiley.innerHTML = WIN
        gameOver()
    }
}

function gameOver() {
    console.log('Game Over');
    clearInterval(gTimeInterval)

    gGame.isOn = false
    gElRestartGame.style.display = 'flex'
    //cleartimeinterval
}

function countMinesAround(board, posI, posJ) {
    var minesCount = 0
    for (var i = posI - 1; i <= posI + 1; i++) {

        if (i < 0 || i > board.length - 1) continue
        for (var j = posJ - 1; j <= posJ + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue
            if (i === posI && j === posJ) continue

            var cell = board[i][j]
            if (cell.isMine) {
                minesCount++
            }

        }
    }
    return minesCount
}



function clearEmptyCellsAround(board, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue

        for (var j = posJ - 1; j <= posJ + 1; j++) {



            if (j < 0 || j > board[0].length - 1) continue
            if (i === posI && j === posJ) continue

            var cell = board[i][j]
            //Save location to see numbered neighbors
            var cellLocation = {
                i,
                j,
            }

            if (!cell.minesAround && !cell.isShown) {
                //Find all the cells with no mines around and mark them
                cell.isShown = true
                gGame.shownCount++
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.style.backgroundColor = NOMINES
                console.log('i, j', i + ' ' + j);


                clearEmptyCellsAround(board, i, j)
            } else if (cell.minesAround && !cell.isShown) {
                //When there are no empty cells left mark all the numbered cells around the empty cells
                cell.isShown = true;
                gGame.shownCount++
                renderCell(cellLocation, cell.minesAround)

            }
        }
    }
}

function checkLevel(btnChecked) {
    //This function gets the attributes of the radio buttons above the board and set the level by it's user decision.
    var elTable = document.querySelector('.board-container')
    console.log(btnChecked);
    gCheckLevels = btnChecked.getAttribute('id')
    if (gCheckLevels === 'level1') {
        elTable.classList.remove('level3')

        gLevel = {
            SIZE: 4,
            MINES: 2,

        }
        //Set the gCurrLevel1 to true to decrease the amount of lives in that round.
        gCurrLevel1 = true
        clearInterval(gTimeInterval)
        updateLives()
        init()
        return
    }

    if (gCheckLevels === 'level2') {
        elTable.classList.remove('level3')
        gLevel = {
            SIZE: 8,
            MINES: 12,

        }
        gCurrLevel1 = false

        clearInterval(gTimeInterval)
        init()
        return
    }

    if (gCheckLevels === 'level3') {
        gLevel = {
            SIZE: 12,
            MINES: 30,

        }
    }
    gCurrLevel1 = false
    console.log('Level', gLevel.SIZE);
    //Add level3 calss for the different style of the larger board in css file.
    elTable.classList.add('level3')
    clearInterval(gTimeInterval)
    init()
}

function updateTimer() {
    //6 digits countup timer
    gMsec += 1;
    if (gMsec == 60) {
        gSec += 1;
        gMsec = 00;
        if (gSec == 60) {
            gSec = 00;
            gMin += 1;

        }
    }
    var strMsec = gMsec < 10 ? '0' + gMsec : gMsec
    var strSec = gSec < 10 ? '0' + gSec : gSec
    var strMin = gMin < 10 ? '0' + gMin : gMin
    document.querySelector('.time-container h2').innerHTML = strMin + ':' + strSec + ":" + strMsec;
}

function startGame() {
    //Pop up the restart game div.
    gElRestartGame.style.display = 'none'
    if (gSec !== null) {

        init()
    }

    //restore the game timer and set gGame.isOn to true
    gMsec = 00;
    gSec = 00;
    gMin = 00;
    gGame.isOn = true
    gTimeInterval = setInterval(() => {
        updateTimer()
    }, 10);

}

function updateLives() {
    //Update the game lives meter. 
    //This function will be called everytime the user steps on a mine.
    var livesContainer = document.querySelector('.lives-container h2')
    var strHTML = ``
    for (var i = 0; i < gGame.lives; i++) {
        console.log('i', i);
        strHTML += HEART + ''
    }
    livesContainer.innerHTML = strHTML
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
