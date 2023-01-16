export default class KeyPress {
    static isSpaceBar = (e)=> {
        return e.key == " " || e.code == "Space" || e.keyCode == 32;
    }

    static isEsc = (e)=> {
        return e.key === "Escape" || e.code === "Escape" || e.keyCode == 27;
    }

    static isS = (e)=> {
        return e.key === "s" || e.code === "KeyS" || e.keyCode == 83;
    }
}