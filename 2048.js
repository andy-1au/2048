//Main Branch

// Audio Objects
var whoosh = new Audio('audio/discord-notification.mp3');
whoosh.playbackRate = 4;


var song = new Audio("audio/bg-music.mp3");
var gameoverSound = new Audio('audio/gameover-sound.mp3');
var newgameSound = new Audio('audio/newgame.mp3');
var clickSound = new Audio('audio/click.mp3');

// restart the audio clip if it is still playing
function playAudio(audio) {
    if (audio.currentTime > 0) {
        audio.currentTime = 0;
    }
    audio.play();
}



var board;
var scores = [0x0, 0x0, 0x0, 0x0, 0x0];
var score = 0;
var rows = 4;
var cols = 4;

var overPopup = false;

// with high score table

window.onload = function () {
    newGame();
    SortList(scores);
    song.loop = true;
    song.volume = 0.7;



    // add event listeners here
    //if user clicks the new game button, start a new game
    document.getElementById("reset").onclick = function () {
        resetBoard();
        overPopup = false;

        console.log("found");

        // reset the gameover sound
        gameoverSound.currentTime = 0;
        gameoverSound.muted = true;
        //play the new game sound
        playAudio(newgameSound);
        song.muted = false;
    }

    //add click event listener to the splash screen
    document.getElementById("splash").onclick = function () {
        document.getElementById("splash").style.display = "none";
    }

    // play the background song when the user clicks anywhere on the page
    document.getElementById("board").onclick = function () {
        song.play();
    }

    // if user clicks the sound button, mute or unmute the sound
    document.getElementById("sound").onclick = function () {
        if (whoosh.muted) { // if the sound is muted, unmute it
            playAudio(clickSound);
            whoosh.muted = false;
            gameoverSound.muted = false;
            newgameSound.muted = false;
            clickSound.muted = false;
            song.muted = false;
            document.getElementById("sound").innerText = "Sound: On";
        } else { // if the sound is not muted, mute it
            whoosh.muted = true;
            gameoverSound.muted = true;
            newgameSound.muted = true;
            clickSound.muted = true;
            song.muted = true;

            // reset the audio clips
            whoosh.currentTime = 100;
            gameoverSound.currentTime = 100;
            newgameSound.currentTime = 100;
            clickSound.currentTime = 100;

            document.getElementById("sound").innerText = "Sound: Off";
        }
    }
}

function changeTheme() {
    let themeList = ["starwars", "duck"];
    // when the user clicks the theme button, change the theme
    let currentTheme = document.getElementById("style").getAttribute("href");
    if (currentTheme === "css/" + theme[0] + ".css") {
        document.getElementById("style").setAttribute("href", "css/" + themeList[1] + ".css");
    } else {
        document.getElementById("style").setAttribute("href", "css/" + themeList[0] + ".css");
    }
}

function newGame() {
    board =
        [
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2]
        ]

    /* 
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 0, 0],
    [0, 0, 0, 0] 
    */

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();  // set the id of the tile
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile); // add the tile to the board
        }
    }

    generateTile();
    generateTile();
}

function resetBoard() {
    score = 0;
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString()); // update the tile, html element
            let num = board[r][c];
            updateTile(tile, num);
        }
    }

    //remove the game over popup
    let popup = document.getElementById("gameover");
    if (popup) {
        popup.remove();
    }

    generateTile();
    generateTile();
}

function isGameOver() {
    // check if the board is full
    if (!isFull()) {
        return false;
    }

    // check if there are any adjacent tiles that are the same
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (r > 0 && board[r][c] === board[r - 1][c]) { // check above
                return false;
            }
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) { // check below
                return false;
            }
            if (c < cols - 1 && board[r][c] === board[r][c + 1]) { // check to the right 
                return false;
            }
            if (c > 0 && board[r][c] === board[r][c - 1]) { // check to the left
                return false;
            }
        }
    }
    return true;
}

function isFull() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] == 0) {
                return false; // if there is a zero, the board is not full
            }
        }
    }
    return true; //otherwise, the board is full
}

function generateTile() {
    if (isFull()) {
        return; // if the board is full, don't generate a tile
    }

    let found = false; // flag to check if we found a spot to generate a tile

    while (!found) {
        // generate a random row and column value 
        let r = Math.floor(Math.random() * rows); // 0 - 3
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString()); // update the tile, html element
            let num = board[r][c]; // get the number of the tile from the board
            updateTile(tile, num);
            tile.animate( // animate the tiles that pop in
                [
                    {
                        transform: "scale(0)",
                    },
                    {
                        transform: "scale(1)",
                    },
                ],
                125 //switched from 100 t0 125
            );
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = ""; // clear the tile number
    tile.classList.value = ""; // clear the tile class
    tile.classList.add("tile"); // add the tile class back

    if (num > 0) {
        tile.innerText = num; // set the tile number
        if (num <= 4096) {
            tile.classList.add("x" + num.toString()); // add the tile class back
        } else {
            tile.classList.add("x8192");
        }
    }

    document.getElementById("score").innerText = score; // update the score
}

document.addEventListener("keyup", (e) => {
    // console.log(overPopup);

    // Arrow Keys
    if (e.code == "ArrowLeft") {
        if (slideLeft()) {
            playAudio(whoosh);
            generateTile();
        }
    }
    else if (e.code == "ArrowRight") {
        if (slideRight()) {
            playAudio(whoosh);
            generateTile();
        }
    }
    else if (e.code == "ArrowUp") {
        if (slideUp()) {
            playAudio(whoosh);
            generateTile();
        }
    }
    else if (e.code == "ArrowDown") {
        if (slideDown()) {
            playAudio(whoosh);
            generateTile();
        }
    }

    if (isGameOver() && !overPopup) {
        overPopup = true;

        scores.push(score);
        scores = scores.filter((item, index) => scores.indexOf(item) === index);

        gameOverPopup();

        song.muted = true;
        gameoverSound.muted = false;
        playAudio(gameoverSound);
    }
})

function gameOverPopup() {
    // create a new img element inside the boarder div
    var gameOver = document.createElement("img");
    gameOver.src = "gif/gameover.gif";
    gameOver.id = "gameover";
    gameOver.style.position = "absolute";
    // center the gamover popup
    gameOver.style.left = "50%";
    gameOver.style.top = "50%";
    gameOver.style.transform = "translate(-50%, -50%)";

    gameOver.style.zIndex = "1"; // make sure it's on top of the board



    document.getElementById("title").append(gameOver); //append to title div so it's centered above the board

    gameOver.animate( //animations 
        [
            {
                transform: "scale(0)",
            },
            {
                transform: "scale(1)",
            },
        ],
        500
    );
}

function filterZero(row) {
    return row.filter(num => num != 0); // return a new array with all the non-zero numbers
}

function slide(row) {
    row = filterZero(row); // remove all the zeros

    for (let i = 0; i < row.length - 1; i++) {
        //check every 2, from left to right
        list = [];
        if (row[i] == row[i + 1]) { // left and right are the same 
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]; // update the score to what was doubled
        }
    }
    row = filterZero(row); // remove all the zeros again due to empty tiles
    //add zeros back to the end of the row
    while (row.length < cols) { // as long as the row is not full or equal to 4
        row.push(0);
    }
    return row;
}

function slideLeft() {
    // check if the board can slide left
    let canSlide = false;

    for (r = 0; r < rows; r++) {
        let newRow = slide(board[r]); // slide the row
        if (newRow.toString() != board[r].toString()) { //compare the new row to the old row
            canSlide = true;
        }
        // board[r] = newRow; //not sure if this is needed 
    }

    for (let r = 0; r < rows; r++) {
        let row = board[r]; // get the row
        row = slide(row); // slide the row
        board[r] = row; // update the board with the new row

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c]; // get the number of the tile from the board
            updateTile(tile, num);
        }
    }
    //console.log(score);
    let list = SortList(score);
    return canSlide;
}

function slideRight() {
    // check if the board can slide right
    let canSlide = false;

    for (r = 0; r < rows; r++) {
        board[r].reverse(); // reverse the row
        let newRow = slide(board[r]); // slide the row
        if (newRow.toString() != board[r].toString()) { //compare the new row to the old row
            canSlide = true;
        }
        board[r] = newRow; // update the board with the new row
        board[r].reverse(); //reverse the row back to normal
    }

    for (let r = 0; r < rows; r++) {
        let row = board[r]; // get the row
        //[0, 0, 2, 2] -> [2, 2, 0, 0] -> [4, 0, 0, 0] -> [0, 0, 0, 4]
        row.reverse(); // reverse the row, so we can slide left, this is the same as sliding right once we reverse it back
        row = slide(row); // slide the row
        row.reverse();
        board[r] = row; // update the board with the new row

        for (let c = 0; c < cols; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c]; // get the number of the tile from the board
            updateTile(tile, num);
        }
    }

    console.log("RIGHT " + score);
    list = SortList(score);

    return canSlide;
}

function slideUp() {
    // check if the board can slide up
    let canSlide = false;

    for (c = 0; c < cols; c++) {
        let col = [];
        for (r = 0; r < rows; r++) {
            col.push(board[r][c]); // get the column
        }
        let newCol = slide(col); // slide the column
        if (newCol.toString() != col.toString()) { //compare the new column to the old column
            canSlide = true;
        }
    }

    for (let c = 0; c < cols; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]; // get the column
        row = slide(row);

        for (let r = 0; r < rows; r++) {
            // update the board with the new column
            board[r][c] = row[r];

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c]; // get the number of the tile from the board
            updateTile(tile, num);
        }
    }
    SortList(score);
    return canSlide;
}

function slideDown() {
    // check if the board can slide down
    let canSlide = false;

    for (c = 0; c < cols; c++) {
        let col = [];
        for (r = 0; r < rows; r++) {
            col.push(board[r][c]); // get the column
        }
        col.reverse(); // reverse the column
        let newCol = slide(col); // slide the column
        if (newCol.toString() != col.toString()) { //compare the new column to the old column
            canSlide = true;
        }
    }

    for (let c = 0; c < cols; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]; // get the column
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
            // update the board with the new column
            board[r][c] = row[r];

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c]; // get the number of the tile from the board
            updateTile(tile, num);
        }
    }
    SortList(score);

    return canSlide;
}

function SortList(n) {
    let tmpScores = scores.slice(0, scores.length); // copy the scores array to a temp array so we don't modify the original array

    tmpScores.push(n); // add the new score to the array
    // // sort the list
    tmpScores = tmpScores.sort(function (a, b) { return b - a });

    // get the top 5 scores
    tmpScores = tmpScores.slice(0, 5);

    // update the list
    for (let i = 0; i < tmpScores.length; i++) {
        let row = document.getElementById("r" + i.toString());
        row.innerHTML = tmpScores[i];
    }

    return tmpScores;
}
