var board;
var scores = [0x0,0x0,0x0,0x0,0x0];
var score = 0;
var rows = 4;
var cols = 4;

// load game with an ajax call

window.onload = function() { 
    newGame();
    SortList(scores);
}

function newGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();  // set the id of the tile
            let num = board[r][c];  
            updateTile(tile, num); 
            document.getElementById("board").append(tile); // add the tile to the board
        }
    }

    generateTile(); // generate a "2" tile twice to start the game
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
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = ""; // clear the tile number
    tile.classList.value = ""; // clear the tile class
    tile.classList.add("tile"); // add the tile class back

    if (num > 0) { 
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
    document.getElementById("score").innerText = score; // update the score
}

document.addEventListener("keyup", (e) => {
    //if user clicks the new game button, start a new game
    document.getElementById("reset").onclick = function() {
        resetBoard();
    }
    // Arrow Keys
    if (e.code == "ArrowLeft") {
        if (slideLeft()) {
            generateTile();
            console.log("generated tile");
        }
        // generateTile();
        if (isGameOver()) {
            scores.push(score);
            scores = scores.filter((item, index) => scores.indexOf(item) === index);
            alert("Game Over!, Your score is: " + score);
        }
    } 
    else if (e.code == "ArrowRight") {
        slideRight();
        generateTile();
        if (isGameOver()) {
            scores.push(score);
            scores = scores.filter((item, index) => scores.indexOf(item) === index);
        }
    } 
    else if (e.code == "ArrowUp") {
        slideUp();
        generateTile();
        if (isGameOver()) {
            scores.push(score);
            scores = scores.filter((item, index) => scores.indexOf(item) === index);
            alert("Game Over!, Your score is: " + score);
        }
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        generateTile();
        if (isGameOver()) {
            scores.push(score);
            scores = scores.filter((item, index) => scores.indexOf(item) === index);
            alert("Game Over!, Your score is: " + score);
        }
    }
})

function filterZero(row) {
    return row.filter(num => num != 0); // return a new array with all the non-zero numbers
}

function slide(row) {
    row = filterZero(row); // remove all the zeros
    
    for (let i = 0; i < row.length - 1; i++) {
        //check every 2, from left to right
        list = [];
        if (row[i] == row[i+1]) { // left and right are the same 
            row[i] *= 2; 
            row[i+1] = 0;
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
    
    for (let r = 0; r < rows; r++) {
        let row = board[r]; // get the row
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
}

function slideUp() {
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
    //console.log(score);
    SortList(score);
}

function slideDown() {
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
    //console.log(score);
    SortList(score);
}

function SortList(n){
    let tmpScores =  scores.slice(0, scores.length); // copy the scores array to a temp array so we don't modify the original array

    tmpScores.push(n); // add the new score to the array
    // // sort the list
    tmpScores = tmpScores.sort(function(a, b){return b-a});

    // get the top 5 scores
    tmpScores = tmpScores.slice(0, 5); 

    // update the list
    for (let i = 0; i < tmpScores.length; i++) {
        let row = document.getElementById("r" + i.toString());
        row.innerHTML = tmpScores[i];
    }

    return tmpScores;
}

