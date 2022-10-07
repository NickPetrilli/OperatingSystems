/* ----------
* memoryManager.ts
*
* Memory Manager
* ----------- */
//Memory manager responsible for allocating and deallocating memory
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
        }
        load(program, priority) {
            var pcb = new TSOS.ProcessControlBlock(priority);
            for (var i = 0; i < _MemorySize; i++) {
                _Memory.setByte(i, program[i]);
            }
            TSOS.Control.updateMemoryDisplay();
            return pcb.processID;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map