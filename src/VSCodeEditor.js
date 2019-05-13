const TextParser = require('codewave/lib/TextParser').TextParser;
const Pos = require('codewave/lib/positioning/Pos').Pos;
const vscode = require('vscode');

class VSCodeEditor extends TextParser{
    /**
     * @param {vscode.TextEditor} editor
     */
    constructor(editor){
        super()
        this.editor = editor
    }
    textLen () {
        return this.text().length
    }

    /**
     * @returns {vscode.Range}
     */
    makeFullRange(){
        const firstLine = this.editor.document.lineAt(0);
        const lastLine = this.editor.document.lineAt(this.editor.document.lineCount - 1);
        return new vscode.Range(0, 
                    firstLine.range.start.character, 
                    this.editor.document.lineCount - 1, 
                    lastLine.range.end.character
        );
    }

    /**
     * @param {number} start
     * @param {number} end
     * @returns {vscode.Range}
     */
    makeRange(start, end){
        const p1 = this.editor.document.positionAt(start)
        const p2 = this.editor.document.positionAt(end)
        return new vscode.Range(p1,p2)
    }
    /**
     * @param {string} [val]
     * @returns {string}
     */
    text(val) {
      if (val != null) {
        this.editor.edit(editBuilder => {
            editBuilder.replace(this.makeFullRange(), val);
        });
      }
      return this.editor.document.getText();
    }

    /**
     * @param {number} start
     * @param {number} end
     * @returns {string}
     */
    textSubstr(start, end) {
        return this.editor.document.getText(this.makeRange(start, end));
    }

    /**
     * @param {number} start
     * @param {number} end
     * @param {string} text
     */
    spliceText(start, end, text) {
        return this.editor.edit(editBuilder => {
            editBuilder.replace(this.makeRange(start, end), text);
        });
    }

    /**
     * @returns {Pos}
     */
    getCursorPos() {
        return new Pos(
            this.editor.document.offsetAt(this.editor.selection.start),
            this.editor.document.offsetAt(this.editor.selection.end)
        )
    }

    /**
     * @param {number} start
     * @param {number} [end]
     */
    setCursorPos(start, end = null) {
        console.log('setCursorPos')
        if(end == null){
            end = start
        }
        const range = this.makeRange(start,end)
        this.editor.selection = new vscode.Selection(range.start,range.end)
        return new Pos(start, end)
    }

    /**
     * @returns {boolean}
     */
    allowMultiSelection() {
        return true
    }


    /**
     * @param {Pos[]} selections
     */
    setMultiSel (selections){
        const vsSelections = selections.map((sel)=>{
            const range = this.makeRange(sel.start, sel.end)
            console.log('setMultiSel range',range,this.editor.document.offsetAt(new vscode.Position(0,2)))
            return new vscode.Selection(range.start, range.end)
        })
        console.log('setMultiSel',selections,vsSelections)
        this.editor.selection = vsSelections[0];
        this.editor.selections = vsSelections;
    }

    /**
     * @returns {Pos[]}
     */
    getMultiSel() {
        return this.editor.selections.map((sel)=>{
            return new Pos(
                this.editor.document.offsetAt(sel.start),
                this.editor.document.offsetAt(sel.end)
            )
        });
    }

    /**
     * @param {number} pos
     * @returns {number}
     */
    findLineStart(pos) {
        return this.editor.document.lineAt(this.editor.document.positionAt(pos)).range.start.character;
    }

    /**
     * @param {number} pos
     * @returns {number}
     */
    findLineEnd(pos) {
        return this.editor.document.lineAt(this.editor.document.positionAt(pos)).range.end.character;
    }
        
}

exports.VSCodeEditor = VSCodeEditor