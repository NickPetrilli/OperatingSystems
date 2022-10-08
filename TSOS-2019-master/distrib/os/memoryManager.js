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
            this.residentList = [];
        }
        load(program, priority) {
            var pcb = new TSOS.ProcessControlBlock(priority);
            this.residentList[pcb.processID] = pcb;
            pcb.processState = "Resident";
            this.allocateMemory(pcb, program);
            TSOS.Control.updatePcbDisplay(pcb);
            return pcb.processID;
        }
        //allocating memory needs to set the base and limit registers of the pcb
        allocateMemory(pcb, program) {
            //this is just finding the first open space - but would need to check for a block of consecutive memory
            //compare the length of the program to the length of consecutive '00' in the memory array?
            //right now memory will be open, and one program is allocated the full 0-255 size
            for (var i = 0; i < _MemorySize; i++) {
                if (_Memory.memory[i] === '00') {
                    pcb.baseRegister = i;
                    pcb.limitRegister = pcb.baseRegister + 255;
                    break;
                }
            }
            //Check for error setting base reg 
            if (pcb.baseRegister === -1) {
                alert("ERROR: BASE REGISTER IS NOT SET");
            }
            //Actually puts the program instructions into memory
            for (var i = 0; i < program.length; i++) {
                _Memory.setByte(pcb.baseRegister + i, program[i]);
            }
            TSOS.Control.updateMemoryDisplay(pcb.baseRegister);
        }
        //also need to deallocate memory for when each process finishes
        deallocateMemory(pcb) {
            //need some sort of indication to know where the first memory location is
            //clears range of the pcb's base register to the limit register 
        }
        doesProcessExist(pid) {
            if (this.residentList[pid] === undefined) {
                return false;
            }
            return true;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map