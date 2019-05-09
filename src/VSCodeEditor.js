import { TextParser } from 'codewave/lib/TextParser';
import * as vscode from 'vscode';

export class VSCodeEditor extends TextParser{
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
     * @param {string} [val]
     */
    text(val) {
      if (val != null) {
        this.editor.edit(editBuilder => {
            editBuilder.replace(this.makeFullRange(), val);
        });
      }
      return this.editor.document.getText();
    }

        
}