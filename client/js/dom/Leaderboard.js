

export default class Leaderboard {
    constructor() {
        this.hudContainer = document.getElementById('hudContainer');
        this.create();
    }
    
    resize() {
        const leaderboard = document.getElementById('leaderboard'); 
        const boardDiv = document.getElementById('boardDiv'); 
        const entry = document.getElementById('entry'); 
        leaderboard.style.fontSize = (boardDiv.offsetWidth / 7) + "px";
        entry.style.fontSize = (boardDiv.offsetWidth / 11) + "px";
    }
    
    //called in hud preloadHud
    create() {
        //Board
        // const board = document.getElementById('boardDiv');
        // const leaderboard = document.getElementById('leaderboard');
        const num = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        this.entries = [];
        for (let i = 0; i < 10; i++) {
            this.entries.push(document.getElementById(num[i]));
        }
    }
    
    updateBoard(board) {
        const len = board.length;
        for (let i = 0; i < len; i++) {
            this.entries[i].textContent = (i + 1) + '. ' + board[i];
        }
        
        if (len < 10) {
            for (let i = len; i < 10; i++) {
                this.entries[i].textContent = '';
            }
        }
    }
    
    show() {
        // this.hudContainer.style.display = 'block';
        this.hudContainer.style.visibility = 'visible';
    }
    
    hide() {
        // this.hudContainer.style.display = 'none';
        this.hudContainer.style.visibility = 'hidden';
    }
} 