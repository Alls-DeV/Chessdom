initializeBoard();

// If I press esc key, TODO (or outside the board), deselect the piece
$(document).keyup(function (e) {
    if (e.keyCode === 27) {
        $("#" + startCellIdG).removeClass("selected");
        startCellIdG = null;
    }
});

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
        changeFen();
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

// Dict of pieces, key is the position of the piece, value is the type of the piece
var pieces = {};
var extra = {
    // top row for add black pieces
    "a9": "p",
    "b9": "n",
    "c9": "b",
    "d9": "r",
    "e9": "q",
    "f9": "k",
    // bottom row for add white pieces
    "a0": "P",
    "b0": "N",
    "c0": "B",
    "d0": "R",
    "e0": "Q",
    "f0": "K",
    "g0": "trash",
};


resetBoard();

function resetBoard() {
    clearBoard();

    let fen = $("#fen").val()
    let rows = fen.split(" ")[0].split("/");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let j = 0;
        for (let k = 0; k < row.length; k++) {
            let c = row[k];
            if (c >= '1' && c <= '8') {
                j += parseInt(c);
            } else {
                pieces[String.fromCharCode(97 + j) + (8 - i)] = c;
                j++;
            }
        }
    }

    // Loop through the pieces array and add them to the chessboard
    for (let key in pieces) {
        if (pieces.hasOwnProperty(key)) {
            let piece = pieces[key];
            $("#" + key).html("<img src='/static/images/" + piece + ".png'>");
        }
    }

    changeFen();
}

function clearBoard() {
    if (startCellIdG !== null) {
        $("#" + startCellIdG).removeClass("selected");
        startCellIdG = null;
    }

    pieces = {};
    $(".cell").html("");

    // Loop through the extra array and add them to the chessboard
    for (let key in extra) {
        if (extra.hasOwnProperty(key)) {
            let piece = extra[key];
            $("#" + key).html("<img src='/static/images/" + piece + ".png'>");
        }
    }
    $("#realFen").val("8/8/8/8/8/8/8/8 w - - 0 1");
}

function changeFen() {
    let fen = "";
    for (let i = 8; i >= 1; i--) {
        let empty = 0;
        for (let j = 0; j < 8; j++) {
            let key = String.fromCharCode(97 + j) + i;
            if (pieces.hasOwnProperty(key)) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                fen += pieces[key];
            } else {
                empty++;
            }
        }
        if (empty > 0) {
            fen += empty;
        }
        if (i > 1) {
            fen += "/";
        }
    }
    let turn = $("#turn").val()
    fen += " " + turn + " ";
    let wk = (document.getElementById("wk").checked ? "K" : ""),
        wq = (document.getElementById("wq").checked ? "Q" : ""),
        bk = (document.getElementById("bk").checked ? "k" : ""),
        bq = (document.getElementById("bq").checked ? "q" : "");
    fen += (wk + wq + bk + bq).length > 0 ? (wk + wq + bk + bq) : "-";
    fen += " - 0 1";
    $("#realFen").val(fen);
}

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
    if (cellId[1] !== "0" && cellId[1] !== "9")
        return pieces.hasOwnProperty(cellId) ? pieces[cellId] : null;
    return extra.hasOwnProperty(cellId) ? extra[cellId] : null;
}


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
nel profilo personale per rivedere una partita ogni mossa direi di modificarla in un fen cosi' che possiamo scorrere mossa per mossa
flip board
*/