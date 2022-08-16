// define the state and behaviour needed.
const state = {
    numCells: (600 / 40) * (600 / 40),
    cells: [],
    shipPosition: 217,
    alienPositions: [
        3, 4, 5, 6, 7, 8, 9, 10,11,
        18,19,20,21,22,23,24,25,26,
        33,34,35,36,37,38,39,40,41,
        48,49,50,51,52,53,54,55,56
    ],
    gameover: false,
    score: 0
}

const RIGHT = 'right'
const LEFT = 'left'

const SPACESHIP = 'spaceship'
const ALIEN = 'alien'
const LASER = 'laser'
const HIT = 'hit'

const setupGame = (element) => {
    state.element = element
    // draw the grid
    drawGrid()
    // draw the spaceship
    drawShip()
    // draw the aliens
    drawAliens()
    // draw the scoreboard
    drawScoreboard()
}

const drawGrid = () => {
    // create container div
    const grid = document.createElement('div')
    grid.classList.add('grid')
    // insert grid into the app
    state.element.append(grid)
    // loop through a certain number to generate cells.
    for (let i=0; i<state.numCells; i++) {
        const cell = document.createElement('div')
        state.cells.push(cell)
        // insert cell into grid
        grid.append(cell)
    }
}

const drawShip = () => {
    // find starting point
    // add class to cell to add background image.
    state.cells[state.shipPosition].classList.add(SPACESHIP)
}

const controlShip = (event) => {
    if(state.gameover) return
    // if the key pressed is left
    if(event.code === 'ArrowLeft'){
        moveShip(LEFT)
    }
    // right
    else if(event.code === 'ArrowRight'){
        moveShip(RIGHT)
    }
    // if spac
    else if(event.code === 'Space'){
        fire()
    }
}

const moveShip = (direction) => {
    // remove image from current position
    state.cells[state.shipPosition].classList.remove(SPACESHIP)
    // figure out the delta
    if(direction===LEFT && state.shipPosition%15!==0){
        state.shipPosition--
    }
    else if(direction===RIGHT && state.shipPosition%15!==14){
        state.shipPosition++
    }
    // add image to new position
    state.cells[state.shipPosition].classList.add(SPACESHIP)
}

const fire = () => {
    // use an interval: run some code repeatedly each time after a specified time
    let interval;
    // laser starts at the ship position
    let laserPosition = state.shipPosition
    interval = setInterval(()=>{
        // remove the laser image
        state.cells[laserPosition].classList.remove(LASER)
        // decrease (move up a row) the laser position
        laserPosition-=15
        // check we are still in bounds
        if(laserPosition<0){
            clearInterval(interval)
            return
        }
        // check if we have hit an alien
        if(state.alienPositions.includes(laserPosition)){
            // clear the interval
            clearInterval(interval)
            // remove alien image
            state.cells[laserPosition].classList.remove(ALIEN,LASER)
            // remove alien from alien position
            const index = state.alienPositions.indexOf(laserPosition)
            state.alienPositions.splice(index,1)
            // add the booom image
            state.cells[laserPosition].classList.add(HIT)
            state.score++
            state.scoreElement.innerText = state.score
            // set a timeout to remove the boom image
            setTimeout(()=>{
                state.cells[laserPosition].classList.remove(HIT)
            }, 200)
            return
        }
        // add the laser image
        state.cells[laserPosition].classList.add(LASER)
    },100)
}

const drawAliens = () => {
    // adding the aliens to the grid -> we need to store the positions of the alines in our game state
    state.cells.forEach((cell,index) => {
        // remove any alien images
        if (cell.classList.contains(ALIEN)) {
            cell.classList.remove(ALIEN)
        }
        // add the image to the cell if the index is in the set of alien positions
        if(state.alienPositions.includes(index)){
            cell.classList.add(ALIEN)
        }
    })
}

const play = () => {
    // start the aliens moving!
    let interval
    // starting direction
    let direction = RIGHT
    interval = setInterval(()=>{
        let movement
        // if right
        if(direction == RIGHT) {
            // if at edge, increase by 15, decrease 1
            if(atEdge(direction)){
                movement = 15 - 1
                direction = LEFT
            }
            else {
                // continue moving right -> increase position
                movement = 1
            }
        }
        // if left
        else if(direction == LEFT){
            // if at the edge, increase by 15, increase 1
            if(atEdge(direction)){
                movement = 15 + 1
            }
            else {
                // continue moving left -> decrease position
                movement = -1
            }
        }
        // update the alien positions
        state.alienPositions = state.alienPositions.map(position => position + movement)
        // redraw aliens on the page
        drawAliens()
        // check game state (and stop the aliens, and stop the ship)
        checkGameState(interval)
    }, 400)
    // set up the ship controls
    window.addEventListener('keydown', controlShip)
}

const atEdge = (side) => {
    if(side===LEFT){
        return state.alienPositions.some(position => position%15 === 0)
    }
    else if(side==RIGHT){
        return state.alienPositions.some(position => position%15 === 14)
    }
}

const checkGameState = (interval) => {
    // did player win
    if(state.alienPositions.length===0){
       // stop aliens
        clearInterval(interval)
        // set game state
        state.gameover = true
        // show win message
        drawMessage("HUMAN WINS!")
    }
    // did aliens win
    else if (state.alienPositions.some(position => position >= state.shipPosition)){
        // stop aliens
        clearInterval(interval)
        // set game state
        state.gameover = true
        // make ship go boom
        state.cells[state.shipPosition].classList.remove('spaceship')
        state.cells[state.shipPosition].classList.add('hit')
        // show lose message
        drawMessage("GAME OVER!")
    }
}

const drawMessage = (message)  => {
    // add message element with class
    const messageEl = document.createElement('div')
    messageEl.classList.add('message')

    // append h1 with text
    const h1 = document.createElement('h1')
    h1.innerText = message
    messageEl.append(h1)

    // append el to the app
    state.element.append(messageEl)
}

const drawScoreboard = () => {
    const heading = document.createElement("h1")
    heading.innerText = 'Space Invaders'
    const paragraph1 = document.createElement("p")
    paragraph1.innerText = 'Press SPACE to shoot.'
    const paragraph2 = document.createElement("p")
    paragraph2.innerText = 'Press ← and → to move'
    const scoreboard = document.createElement('div')
    scoreboard.classList.add('scoreboard')
    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score
    const heading3 = document.createElement('h3')
    heading3.innerText = 'Score: '
    heading3.append(scoreElement)
    scoreboard.append(heading, paragraph1, paragraph2, heading3)
  
    state.scoreElement = scoreElement
    state.element.append(scoreboard)
  }

// query the page for the element
const appElement = document.querySelector('.app')
// insert app into the game
setupGame(appElement)
// play!
play()