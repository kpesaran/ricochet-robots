import GUI from 'lil-gui'

export default class Debug {
    ui: GUI
    background: HTMLHtmlElement | null;
    backgroundColor: string
    constructor() {
        this.ui = new GUI()
        
        this.background = document.querySelector('html')
        this.backgroundColor = '#000000';
        // Add a color controller to the GUI
        this.ui.addColor(this, 'backgroundColor').onChange((value: string) => {
            // Update the scene background color
          
            if (this.background) {
                this.background.style.backgroundColor = value; 
            }
        });
    }
}