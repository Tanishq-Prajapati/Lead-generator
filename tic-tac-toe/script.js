console.log("Tic-tac-toe started...");


var score = document.getElementById('high_score');
score.innerText = `wins -> ${(window.localStorage.getItem('tictac')) ? window.localStorage.getItem('tictac') : 0}`

var welcome_cont = document.getElementById('welcome_container')
var game_exit_but = document.getElementById('exitgame')

// turn of value DIV
var turn_of = document.getElementById('whose_turn');

// getting all the board chances here
var Bmoves = document.getElementsByClassName('board_step');

// game over button
var game_over = document.getElementById('game_over')
var game_over_head = document.getElementById('game_over_head')

var buttons = document.getElementsByClassName('but')
var clickable = {
    playAgain: buttons[0],
    toMenu: buttons[1],
    play: buttons[2],
    exit: buttons[3],
    gameExit: game_exit_but
}

clickable.play.addEventListener('click', () => {
    welcome_cont.style.opacity = '0'
    welcome_cont.style.pointerEvents = 'none'
    Array.from(Bmoves).forEach((ele)=>{
        ele.innerText = ''
    })
})

clickable.gameExit.addEventListener('click', () => {
    welcome_cont.style.opacity = '1'
    welcome_cont.style.pointerEvents = 'inherit'
})

clickable.playAgain.addEventListener('click', () => {
    Array.from(Bmoves).forEach((ele)=>{
        ele.innerText = ''
    })
    game_over.style.opacity = '0';
    game_over.style.pointerEvents = 'none';
})

clickable.toMenu.addEventListener('click', ()=>{
    game_over.style.opacity = '0';
    game_over.style.pointerEvents = 'none';
    welcome_cont.style.opacity = '1'
    welcome_cont.style.pointerEvents = 'inherit'
})

clickable.exit.addEventListener('click', (e) => {
    numbs = score.innerText.split(' ')[2]
    score.innerText = `wins -> ${parseInt(numbs) - 1}`
    console.log("Yooo...");
})

// Adding the Code of the TIC-TAC-TOE here
// 0 -> User(X), 1 -> Computer(O)
var move = 0;
var moveIdentifier = {
    0: 'X',
    1: 'O'
}

var winPatterns = [
    [0,1,2], [0,3,6], [0,4,8],
    [3,4,5], [1,4,7], [2,4,6],
    [6,7,8], [2,5,8]
]

// sleeping function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// creating function change turn
function change_turn(){
    move = (move == 0 ? 1: 0)
    turn_of.innerText = 'Turn of '+moveIdentifier[move]
}

function is_step_empty(step_idx){
    console.log(step_idx);
    return Bmoves[step_idx].innerText == '';
}

function setScore(mover){
    if (mover != "X"){
        return false;
    }

    // setting the local storage
    let dek = window.localStorage.getItem('tictac')
    if(!dek){
        window.localStorage.setItem('tictac', '0')
    }
    else{
        window.localStorage.setItem('tictac', `${parseInt(dek) + 1}`)
    }

    score.innerText = `wins -> ${window.localStorage.getItem('tictac')}`
}

function is_space_left(move_arr){
    for (let i = 0; i < move_arr.length; i++) {
        if (move_arr[i].innerText == ""){
            return true;
        }
    }
    return false;
}

function who_won(Bmoves){
    for(let i = 0; i < winPatterns.length; i++){
        if(Bmoves[winPatterns[i][0]].innerText == 'X' &&
           Bmoves[winPatterns[i][1]].innerText == 'X' &&
           Bmoves[winPatterns[i][2]].innerText == 'X'){
            return 0;
        }
        if(Bmoves[winPatterns[i][0]].innerText == 'O' &&
           Bmoves[winPatterns[i][1]].innerText == 'O' &&
           Bmoves[winPatterns[i][2]].innerText == 'O'){
            return 1;
        }
    }
    return 2;
}

// adding a event Listener here
Array.from(Bmoves).forEach((ele, idx) => {
    ele.addEventListener('click', async (e)=>{
        if (!is_space_left(Bmoves)){
            console.log("GAME FULL...");
            return true;
        }
        if (is_step_empty(idx)){
            ele.innerText = 'X'
            change_turn()
            // telling computer that his turn is now
            await computers_turn()
        }
        winner = who_won(Bmoves);
        if (winner != 2){
            setScore(moveIdentifier[winner])
            game_over_head.innerText = "Winner is "+moveIdentifier[winner];
            game_over.style.opacity = '1'
            game_over.style.pointerEvents = 'inherit'
        }
    })
})

async function computers_turn(){
    if (!is_space_left(Bmoves)){
        console.log("Game Full...")
        return true;
    }
    while (true){
        let moveNum = Math.floor(Math.random() * 9);
        if (!is_step_empty(moveNum)){
            // this if is for checking the errors
            continue;
        }
        // adding the O in step index
        await sleep(1000);
        Bmoves[moveNum].innerText = 'O'
        break;
    }
    winner = who_won(Bmoves);
    if (winner != 2){
        setScore(moveIdentifier[winner])
        game_over_head.innerText = "Winner is "+moveIdentifier[winner];
        game_over.style.opacity = '1'
        game_over.style.pointerEvents = 'inherit'
    }
}

function box_checker(){

}