/*
 * global variables
 */
var bombs = [];
var endValue = -1;
var seconds = -1;
var minutes = -1;
var dispSec = -1;
var styledCells = [];
var remainingBombs = -1;
var playerWon = false;
const maxBombs = 30;


/*
 * setup minesweeper
 */
function showMinesweeper(){

    // change current title
    changeTitle('Minesweeper');

    // get html from file
    $.get('../functions/minesweeper.html', function(data){

        // place in target div
        $('#JS_Target').html(data);

        // create list of bomb IDs (up to 15 possible)
        resetVariables();
        for(var q = 0; q < maxBombs; q++){
            var val = Math.floor(Math.random() * 100);
            if(bombs.indexOf(val) <= -1){               // there's a part of this code where I use nested loops but should just use this
                bombs.push(val);
            }
        }

        // add bomb count to page
        bombs.sort(function (a, b) {  return a - b;  });
        remainingBombs = bombs.length;
        $('#remaining-bombs').html(remainingBombs);

        // create board with 100 cells
        for(var i = 0; i < 100; i++){

            // add the cell
            $('#board').append('<div id="' + i + '" class="minesweeper-cell"></div>');

            // add mouse functionality to cell
            $('#' + i).mousedown(function(event) {
                switch (event.which) {
                    case 1:
                        cellClicked(event.target.id);
                        break;
                    case 2:
                        console.log('Middle mouse button pressed.');
                        break;
                    case 3:
                        event.preventDefault();
                        addFlag(event.target.id);
                        break;
                    default:
                        alert('You have a strange mouse...');
                }
            });

            // no context menu on the board
            $('#' + i).contextmenu(function() {
                return false;
            });

        }

    });
}


/*
 * add bomb flag to cell
 */
function addFlag(id){

    // make sure a bomb was at the flagged cell
    for(var w = 0; w < bombs.length; w++){
        if(bombs[w] == id){

            // update the remaining bomb count
            remainingBombs--;
            $('#remaining-bombs').html(remainingBombs);

            // style the cell as a flag
            $('#' + id).className = '';
            $('#' + id).addClass('flag-cell');
            $('#' + id).append('<span class="glyphicon glyphicon-flash" aria-hidden="true"></span>');

            // check if user has won
            hasWon();
            return;
        }
    }

    // wasn't a bomb, so end the game
    bombHit();

}


/*
 * when any part of the board is clicked
 */
function cellClicked(id){

    // don't do anything if the player already won
    if(playerWon){
        return true;
    }

    // don't do anything if a flagged bomb is clicked
    if($('#' + id).hasClass('flag-cell')){
        return true;
    }

    // start game timer and get stop value
    if(seconds == -1){
        seconds = 0;
        // endValue is stop value in future function calls
        endValue = setInterval(function() {
            seconds++;
            minutes = Math.floor(seconds / 60);
            dispSec = seconds % 60;
            if(dispSec < 10){
                dispSec = '0' + dispSec;
            }
            if(minutes < 10){
                minutes = '0' + minutes;
            }
            $('#timer').html(minutes + ':' + dispSec);
        }, 1000);
    }

    // check if square is bomb
    if(checkForBomb(id)){
        bombHit(id);
    }
    else{
        // show non-bomb cell
        styleCell(id);
        // check if user has won
        hasWon();
    }

}


/*
 * when bomb is clicked
 */
function bombHit(){

    // stop game timer
    if(seconds != -1){
        clearInterval(endValue);
    }

    // reveal board
    revealBoard();

    // display that the player has lost
    $('#JS_Target').append('<div class="alert alert-danger"><strong>You\'ve lost!</strong></div>');

}


/*
 * check if bomb is at passed in id
 */
function checkForBomb(id){
    for(var i = 0; i < bombs.length; i++){
        if(id == bombs[i]){
            return true;
        }
    }
    return false;
}


/*
 * check how many bombs are adjacent (this could
 * be much better)
 */
function getAdjIdArray(id){

    // variables
    var nearIDs = [];
    id = Number(id);
    var boardID = id + 1;

    // get near IDs based on ID location
    if(boardID / 10 > 1){
        if(boardID / 90 > 1){
            if(boardID % 10 == 1){
                nearIDs = [id + 1, id-10, id-9];
            }
            else if(boardID % 10 == 0){
                nearIDs = [id-1, id-10, id-11];
            }
            else{
                nearIDs = [id-1, id+1, id-11, id-10, id-9];
            }
        }
        else{
            if(boardID % 10 == 1){
                nearIDs = [id+1, id+10, id+11, id-10, id-9];
            }
            else if(boardID % 10 == 0){
                nearIDs = [id-1, id-11, id-10, id+9, id+10];
            }
            else{
                nearIDs = [id-11, id-10, id-9, id-1, id+1, id+9, id+10, id+11];
            }
        }
    }
    else{
        if(boardID % 10 == 1){
            nearIDs = [id+1, id+10, id+11];
        }
        else if(boardID % 10 == 0){
            nearIDs = [id-1, id+9, id+10];
        }
        else{
            nearIDs = [id-1, id+1, id+9, id+10, id+11];
        }
    }// end of getting near Ids

    return nearIDs;

}


/*
 * get the number of bombs surrounding passed in id
 */
function getAdjBombCount(nearIDs){
    var bombCount = 0;

    // count how many bombs are near
    for(var t = 0; t < nearIDs.length; t++){
        if(checkForBomb(nearIDs[t])){
            bombCount++;
        }
    }

    // return how many bombs are near
    return bombCount;
}


/*
 * style cell with passed in id
 */
function styleCell(id){

    var cell = $('#' + id);

    // end the recursion if the square's already been styled
    for(var g = 0; g < styledCells.length; g++){
        if(styledCells[g] == id){
            return true;
        }
    }
    styledCells.push(id);

    // get near IDs and number of bombs
    var closeIDs = getAdjIdArray(Number(id));
    var numBombs = getAdjBombCount(closeIDs);

    // if this cell is a zero, display the cells around it
    if(numBombs == 0){
        for(var y = 0; y < closeIDs.length; y++){
            styleCell(closeIDs[y]);	// recursion :)
        }
    }

    // add appropriate color and label
    cell.html(numBombs);
    switch(numBombs){
        case 0:
            cell.addClass('near0');
            break;
        case 1:
            cell.addClass('near1');
            break;
        case 2:
            cell.addClass('near2');
            break;
        case 3:
            cell.addClass('near3');
            break;
        default:
            cell.addClass('near4');
            break;
    }

}


/*
 * check if player has won
 */
function hasWon(){

    var allBombsFlagged = true;

    // check if all bombs are flagged
    for(var q = 0; q < bombs.length; q++){
        if(!$('#' + bombs[q]).hasClass('flag-cell')){
            allBombsFlagged = false;
        }
    }

    // check if all cells are styled, don't include bombs
    allCellsStyled = (styledCells.length == 100 - bombs.length);

    if((allBombsFlagged || allCellsStyled) && !playerWon){

        // end timer and flag that player has won
        clearInterval(endValue);
        playerWon = true;
        revealBoard();

        // display that the player has won
        $('#JS_Target').append('<div class="alert alert-success"><strong>You\'ve won!</strong></div>');
    }

}


/*
 * clear all variables for re-displaying page
 */
function resetVariables(){
    clearInterval(endValue);    // stop the game timer from the old game
    bombs.length = 0;           // fixed so luke can play
    endValue = -1;
    seconds = -1;
    minutes = -1;
    dispSec = -1;
    styledCells.length = 0;
    remainingBombs = -1;
    playerWon = false;
}

/*
 * display the whole board
 */
function revealBoard(){
    loop1:
        for(var i = 0; i < 100; i++){
            // check if current id is bomb id
            for(var j = 0; j < bombs.length; j++){
                if(i == bombs[j]){
                    // style cell as bomb then continue
                    if(playerWon){
                        // in case they didn't flag the bombs they knew (mobile)
                        $('#' + i).addClass('flag-cell').html('<span class="glyphicon glyphicon-flash" aria-hidden="true"></span>');
                    }else{
                        $('#' + i).removeClass('flag-cell');
                        $('#' + i).addClass('bomb-cell').html('X');
                    }
                    continue loop1;
                }
            }
            // add appropriate style to div
            styleCell(i);
        }
}