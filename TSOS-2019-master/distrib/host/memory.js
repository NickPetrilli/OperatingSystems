/* ------------
* memory.ts
*
* Memory
* ------------- */
var TSOS;
(function (TSOS) {
    class Memory {
        //Length will be size 768, 0-767
        constructor(length) {
            this.memory = new Array(length);
        }
        init() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        }
        //Used by the memory accessor to read data
        getByte(addr) {
            return this.memory[addr];
        }
        //Used by the memory accessor to write data
        setByte(addr, data) {
            if (data.length === 1) {
                data = '0' + data;
            }
            this.memory[addr] = data;
        }
        getSize() {
            return this.memory.length;
        }
        //Used for clearmem shell command
        clearMemory() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        }
        //Used when a process terminates or is killed by the user
        clearRange(base, limit) {
            for (var i = 0; i < (limit - base); i++) {
                this.memory[base + i] = '00';
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map