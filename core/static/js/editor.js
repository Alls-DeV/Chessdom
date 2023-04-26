// Dict of pieces, key is the position of the piece, value is the type of the piece
var pieces = {
    "a8" : "R",
    "b8" : "N",
    "c8" : "B",
    "d8" : "Q",
    "e8" : "K",
    "f8" : "B",
    "g8" : "N",
    "h8" : "R",
    "a1" : "r",
    "b1" : "n",
    "c1" : "b",
    "d1" : "q",
    "e1" : "k",
    "f1" : "b",
    "g1" : "n",
    "h1" : "r",
    // top row for add black pieces
    "a9" : "P",
    "b9" : "N",
    "c9" : "B",
    "d9" : "R",
    "e9" : "Q",
    "f9" : "K",
     // bottom row for add white pieces
    "a0" : "p", 
    "b0" : "n", 
    "c0" : "b", 
    "d0" : "r", 
    "e0" : "q", 
    "f0" : "k",
    "g0" : "trash"
};

// add pawns to the pieces array
for (let i = 0; i < 16; i++) {
    if (i < 8)
        pieces[String.fromCharCode(97 + i) + "7"] = "P";
    else
        pieces[String.fromCharCode(97 + i - 8) + "2"] = "p";
}

// deep copy of pieces array
var default_pieces = JSON.parse(JSON.stringify(pieces));

// Loop through all the div in the chessboard
$(".containerr div").each(function (index, value) {
    // Get the ID of the cell
    let cellId = $(this).attr("id");
    if (cellId !== undefined && cellId.length === 2) {
        $(this).addClass("cell");
        // id is like "a7" or "b7". a = 0, b = 1, c = 2, etc. add the first character to the second digit to get the number of the cell
        let cellNumber = cellId.charCodeAt(0) - 97 + parseInt(cellId[1]);
        if (cellNumber % 2 === 1) {
            $(this).addClass("black");
        }
    }
});

// Loop through the pieces array and add them to the chessboard
for (let key in pieces) {
    if (pieces.hasOwnProperty(key)) {
        let piece = pieces[key];
        $("#" + key).html("<img src='/static/images/" + piece + ".png'>");
    }
}


var startCellIdG = null;

// Add a click event listener to each cell on the chessboard
$(".cell").click(function () {
    // Get the ID of the clicked cell
    let cellId = $(this).attr("id");

    // If a piece is already selected
    if (startCellIdG !== null) {
        movePiece(cellId);
    }
    // If no piece is selected, select the clicked piece (if there is one)
    else {
        if (getPiece(cellId) !== null) {
            startCellIdG = cellId;
            // Add the selected class to the cell
            $(this).addClass("selected");
        }
    }
});

function movePiece(endCellId) {
    // Get the piece that is in the starting cell
    var piece = getPiece(startCellIdG);

    if (piece === "trash") {
        if (endCellId[1] !== "0" && endCellId[1] !== "9") {
            $("#" + endCellId).html("");
            // Remove the piece from the pieces array
            delete pieces[endCellId];
        }
    } else {
        let startCell = $("#" + startCellIdG);
        startCell.removeClass("selected");

        // If the piece isn't in the row 0 or 9, remove the piece from the current cell
        if (startCellIdG[1] !== "0" && startCellIdG[1] !== "9" &&
            endCellId[1] !== "0" && endCellId[1] !== "9") {
            startCell.html("");
            // Remove the piece from the pieces array
            delete pieces[startCellIdG];
        }

        if (endCellId[1] !== "0" && endCellId[1] !== "9") {
            let endCell = $("#" + endCellId);
            endCell.html("<img src='/static/images/" + piece + ".png'>");
            pieces[endCellId] = piece;
            startCellIdG = null;
        } else {
            startCellIdG = endCellId;
            $("#" + startCellIdG).addClass("selected");
        }
    }
}


// Function to get the piece in a cell (if there is one)
function getPiece(cellId) {
    return pieces.hasOwnProperty(cellId) ? pieces[cellId] : null;
}

// If I press esc key, TODO (or outside the board), deselect the piece
$(document).keyup(function (e) {
    if (e.keyCode === 27) {
        $("#" + startCellIdG).removeClass("selected");
        startCellIdG = null;
    }
});