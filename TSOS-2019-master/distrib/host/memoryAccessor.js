/* ---------------
* memoryAccessor.ts
*
* Memory Accessor
* ---------------- */
//Memory accessor is for reading and writing to memory
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        read(pcb, addr) {
            if (addr >= 0) {
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
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map