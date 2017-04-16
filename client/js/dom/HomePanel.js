

export default class HomePanel {
    constructor() {
        this.mainFade = document.getElementById('mainFade');
        this.homePanel = document.getElementById('homePanel');
    }
    
    resize() {
        const scale = window.innerHeight / 716; //800
        
        //zoom is better (no blur)
        this.homePanel.style.zoom = scale;
        this.homePanel.style.MozTransform = "scale(" + scale + ")";
    }
    
    show() {
        this.mainFade.style.display = 'block';
    }
    
    hide() {
        this.mainFade.style.display = 'none';
    }
}