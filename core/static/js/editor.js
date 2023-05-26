initializeBoard();

// If I press esc key deselect the piece
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
            $("#" + key).html("<img src='/static/images/piece_set/" + piece_set + "/" + piece + ".png'>");
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
            if (piece === "trash") {
                $("#" + key).html("<i class='fas fa-trash-alt red' style='font-size:50px;'></i>");
            } else {
                $("#" + key).html("<img src='/static/images/piece_set/" + piece_set + "/" + piece + ".png'>");
            }
        }
    }
    $("#realFen").val("8/8/8/8/8/8/8/8 w - - 0 1");
}

function changeFen() {
    let fen = getFen();
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
