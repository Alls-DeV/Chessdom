initializeBoard();
var pieces = {}, index = 0, index_max = 0, startCellIdG = null, errors = 0;
loadFen();

// Add a click event listener to each cell on the chessboard
$(".cell").click(function () {
    // Get the ID of the clicked cell
    let cellId = $(this).attr("id");
    if (index == index_max) {
        // If a piece is already selected
        if (startCellIdG !== null) {
            if (startCellIdG === cellId) {
                // If the same piece is clicked, deselect the piece
                $(this).removeClass("selected");
                startCellIdG = null;
                return;
            }

            movePiece(cellId);
            if (getFen().split(" ")[0] !== fenList[index + 1].split(" ")[0]) {
                errors++;
                document.getElementById("lose").textContent = "You have done " + errors + " error" + (errors > 1 ? "s" : "") + "!";
                setTimeout(function () { loadFen(); }, 700);
            } else {
                index_max = Math.max(index_max, ++index);
                if (checkList[index]) {
                    let king_to_highlight;
                    if (color === "white") {
                        king_to_highlight = (index % 2 === 0) ? "K" : "k";
                    } else {
                        king_to_highlight = (index % 2 === 0) ? "k" : "K";
                    }
                    let king_cell = null;
                    for (let key in pieces) {
                        if (pieces.hasOwnProperty(key) && pieces[key] === king_to_highlight) {
                            king_cell = key;
                            break;
                        }
                    }
                    $("#" + king_cell).addClass("selected");
                } else {
                    $(".cell").removeClass("selected");
                }
                // win
                if (index_max === fenList.length - 1) {
                    index_max++;
                    document.getElementById("win").textContent = "You win!"
                } else {
                    index_max = Math.max(index_max, ++index);
                    setTimeout(function () { loadFen(); }, 1000);
                }
            }
        }
        // If no piece is selected, select the clicked piece (if there is one)
        else {
            if (getPiece(cellId) !== null) {
                startCellIdG = cellId;
                // Add the selected class to the cell
                $(this).addClass("selected");
            }
        }
    }
});


// if you press the right arrow key, go to the next fen
$(document).keydown(function (e) {
    if (e.keyCode === 39) {
        nextFen();
    }
});

// if you press the left arrow key, go to the previous fen
$(document).keydown(function (e) {
    if (e.keyCode === 37) {
        prevFen();
    }
});

function nextFen() {
    if (index < index_max && index < fenList.length - 1) {
        index++;
        loadFen();
    }
}

function prevFen() {
    if (index > 0) {
        index--;
        loadFen();
    }
}