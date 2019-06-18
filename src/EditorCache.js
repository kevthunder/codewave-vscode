class EditorCache {
    constructor(){
        /**
         * @type {Object.<string, any>}
         */
        this.data = {}
    }

    /**
     * @template T
     * @param {string} key 
     * @param {function():T} cb 
     * @returns T
     */
    remember(key, cb){
        if(typeof this.data[key] === "undefined"){
            this.data[key] = cb()
        }
        return this.data[key]
    }

}

exports.EditorCache = EditorCache