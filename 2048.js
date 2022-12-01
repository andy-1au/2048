var board;
var score = 0; 
var rows = 4;
var cols = 4;

window.onload = function() {
    newGame();
}

function newGame() {
    board = [
        [2, 2, 0, 0],
        [0, 16, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c]; 
            updateTile(tile, num);
            document.getElementById("board").append(tile);
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
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
    } 
    else if (e.code == "ArrowRight") {
        slideRight();
    }
})

function filterZero(row) {
    return row.filter(num => num != 0); // return a new array with all the non-zero numbers
}

function slide(row) {
    row = filterZero(row); // remove all the zeros
    for (let i = 0; i < row.length - 1; i++) {
        //check every 2, from left to right
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
}
