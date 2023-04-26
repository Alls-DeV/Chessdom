// Dict of pieces, key is the position of the piece, value is the type of the piece
var pieces = {
    "a8" : "r",
    "b8" : "n",
    "c8" : "b",
    "d8" : "q",
    "e8" : "k",
    "f8" : "b",
    "g8" : "n",
    "h8" : "r",
    "a1" : "R",
    "b1" : "N",
    "c1" : "B",
    "d1" : "Q",
    "e1" : "K",
    "f1" : "B",
    "g1" : "N",
    "h1" : "R",
    // top row for add black pieces
    "a9" : "p",
    "b9" : "n",
    "c9" : "b",
    "d9" : "r",
    "e9" : "q",
    "f9" : "k",
    // bottom row for add white pieces
    "a0" : "P", 
    "b0" : "N", 
    "c0" : "B", 
    "d0" : "R", 
    "e0" : "Q", 
    "f0" : "K",
    "g0" : "trash",
};

// add pawns to the pieces array
for (let i = 0; i < 16; i++) {
    if (i < 8)
        pieces[String.fromCharCode(97 + i) + "7"] = "p";
    else
        pieces[String.fromCharCode(97 + i - 8) + "2"] = "P";
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
        if (startCellIdG === cellId) {
            // If the same piece is clicked, deselect the piece
            $(this).removeClass("selected");
            startCellIdG = null;
            return;
        }        

        movePiece(cellId);
    }
    // If no piece is selected, select the clicked piece (if there is one)
    else {
        if (getPiece(cellId) !== null) {
            startCellIdG = cellId;
            // Add the selected class to the cell
            $(this).addClass("selected");

            // TODO
            // if (cellId === "g0") {
            //     // change the cursor to not-allowed in all the page
            //     $("body").css("cursor", "not-allowed");
            // }
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
        } else {
            $("#" + startCellIdG).removeClass("selected");
            startCellIdG = endCellId;
            $("#" + startCellIdG).addClass("selected");
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

// TODO
// Deselect the piece if I click not in the chessboard or in the other rows
// $(document).click(function (e) {
//     if (startCellIdG === null)
//         return;
//     if ($(e.target).closest(".containerr").length === 0 || $(e.target).closest(".row").length !== 0) {
//         $("#" + startCellIdG).removeClass("selected");
//         startCellIdG = null;
//     }
// });

/* TODO
possibilita' di settare delle aperture, magari con fen perche' servira' convertire fen in posizione e il contrario
nel profilo personale per rivedere una partita ogni mossa direi di modificarla in un fen cosi' che possiamo scorrere mossa per mossa
turno del giocatore
selezionare chi ha arroccato
flip board
posizione iniziale
stampare fen
*/