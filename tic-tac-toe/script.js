const state = {
    gameElement: document.querySelector('.game'),
    cells: Array(9).fill(null),
    playerFlag: true,
    gameFinised: false,
    winningCombinations: [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle row
        [2, 5, 8], // right row
        [0, 4, 8], // left diagonal
        [2, 4, 6], // right diagonal
    ]
}

function drawBoard() {
    state.gameElement.innerHTML='';

    for(let i = 0; i < 9 ; i++ ) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        if(state.cells[i] != null) {
            if(state.gameFinised){
                return;
            }
            const cellSymbol = document.createElement('p');
            cellSymbol.innerHTML = state.cells[i];
            cellSymbol.classList.add('symbol');
            cell.append(cellSymbol);
        }
        else {
            cell.addEventListener('click',function(){

                state.cells[i] = state.playerFlag ? 'x' : 'o';
                state.playerFlag = !state.playerFlag;
                
                drawBoard();

                if(checkForWinner()) {
                    console.log('somebody won!')
                    state.finish = true;
                    drawMessage();
                }
            });
        }

        state.gameElement.append(cell);
    }
}

drawBoard();

function checkForWinner(){
    // console.log(`check if player with symbol ${symbol} won`);
    return state.winningCombinations.some(function(combo){
        const cells = combo.map(function(index){
            return state.cells[index]
        });

        return !(cells.includes(null)) && new Set(cells).size === 1;
    });
}

function drawMessage() {
    const banner = document.createElement('div');
    banner.classList.add('banner');
    const h1 = document.createElement('h1');
    h1.innerText = "Congratulations! You won!"
    banner.append(h1);
    state.gameElement.append(banner);
}
