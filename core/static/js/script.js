function initializeBoard() {
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

}