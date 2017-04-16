import HomePanel from './HomePanel';
import Leaderboard from './Leaderboard';


export default class Dom {
    constructor() {
        this.homePanel = new HomePanel();
        this.leaderboard = new Leaderboard();
        this.mainFade = document.getElementById('mainFade');
        
        this.resize();
    }
    
    resize() {
        this.homePanel.resize();
        this.leaderboard.resize();
    }
    
    newGame() {
        this.homePanel.hide();
        this.leaderboard.show();
    }
    
    gameOver() {
        this.homePanel.show();
        this.leaderboard.hide();
    }
    
    
}