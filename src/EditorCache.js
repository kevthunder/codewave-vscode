class EditorCache {
    constructor(){
        /**
         * @type {Object.<string, {editor:import("vscode").TextEditor, value:any}>}
         */
        this.data = {}
    }

    /**
     * @template T
     * @param {import("vscode").TextEditor} editor 
     * @param {function():T} cb 
     * @returns T
     */
    remember(editor, cb){
        const key = editor.document.fileName
        if(typeof this.data[key] === "undefined" || this.data[key].editor != editor){
            this.data[key] = {
                editor: editor,
                value: cb()
            }
        }
        return this.data[key].value
    }

}

exports.EditorCache = EditorCache