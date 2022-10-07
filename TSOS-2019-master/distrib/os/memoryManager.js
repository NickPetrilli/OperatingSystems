/* ----------
* memoryManager.ts
*
* Memory Manager
* ----------- */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(maxProcesses) {
            //Each process takes up 256 bytes in memory, represented in blocks
            this.memorySize = _Memory.getSize();
            this.numOfBlocks = this.memorySize / maxProcesses;
            this.allocated = new Array(maxProcesses);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }
        }
        read(pcb, addr) {
            if (addr >= 0 && addr < this.numOfBlocks) {
                return _Memory.getByte(pcb.baseRegister + addr);
            }
            else {
                alert('Memory Access Error');
            }
        }
        write(pcb, addr, data) {
            if (addr >= 0 && addr < 256) {
                if (parseInt(data, 16) > 255) {
                    //Cant store more than FF
                }
                else {
                    _Memory.setByte(pcb.baseRegister + addr, data);
                }
            }
            else {
                alert('Memory Access Error');
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map