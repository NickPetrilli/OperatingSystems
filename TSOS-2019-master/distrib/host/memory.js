/* ------------
* memory.ts
*
* Memory
* ------------- */
var TSOS;
(function (TSOS) {
    class Memory {
        //Length will be size 256, 0-255
        constructor(length) {
            this.memory = new Array(length);
        }
        init() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        }
        getByte(addr) {
            return this.memory[addr];
        }
        setByte(addr, data) {
            if (data.length === 1) {
                data = '0' + data;
            }
            this.memory[addr] = data;
        }
        getSize() {
            return this.memory.length;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map