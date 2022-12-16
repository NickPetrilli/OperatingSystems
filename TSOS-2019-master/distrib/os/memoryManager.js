/* ----------
* memoryManager.ts
*
* Memory Manager
* ----------- */
//Memory manager responsible for allocating and deallocating memory and managing the processes
var TSOS;
(function (TSOS) {
    const numPrograms = 3;
    class MemoryManager {
        constructor() {
            this.residentList = [];
            this.readyQueue = new TSOS.Queue();
            //New array for memory allocation separate from the actual memory array
            this.allocated = new Array(numPrograms);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }
        }
        load(program, priority) {
            var pcb = new TSOS.ProcessControlBlock(priority);
            this.residentList[pcb.processID] = pcb;
            pcb.processState = "Resident";
            this.allocateMemory(pcb, program);
            TSOS.Control.updatePcbDisplay(true, pcb);
            return pcb.processID;
        }
        //allocating memory needs to set the base and limit registers of the pcb
        allocateMemory(pcb, program) {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === -1) {
                    this.allocated[i] = pcb.processID;
                    pcb.baseRegister = i * 256; //base registers will be 0, 256, and 512
                    pcb.limitRegister = pcb.baseRegister + 255; //limit registers will be 255, 511, and 767
                    pcb.isInMemory = true;
                    break;
                }
            }
            if (!pcb.isInMemory) {
                //Memory is full, need to write to disk
                pcb.isInMemory = false;
                var programStr = '';
                for (var i = 0; i < program.length; i++) {
                    programStr += program[i] + " ";
                }
                _krnDiskDriver.createSwapFile(pcb.processID, programStr);
                TSOS.Control.updateDiskDisplay();
            }
            else {
                //Actually puts the program instructions into memory
                //Changes so now the program fills the entire allocated memory even if the program isn't that size
                for (var i = 0; i < 256; i++) {
                    var code = program[i];
                    if (code === undefined) {
                        code = '00';
                    }
                    _Memory.setByte(pcb.baseRegister + i, code);
                }
            }
            TSOS.Control.updateMemoryDisplay();
        }
        //Deallocate memory when process finishes or is killed
        deallocateMemory(pcb) {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === pcb.processID) {
                    this.allocated[i] = -1;
                    _Memory.clearRange(pcb.baseRegister, pcb.limitRegister);
                    break;
                }
            }
            //this.residentList.splice(pcb.processID, 1);
        }
        doesProcessExist(pid) {
            if (this.residentList[pid] === undefined) {
                return false;
            }
            return true;
        }
        killProcess(pid) {
            var pcb = this.residentList[pid];
            pcb.processState = "Terminated";
            TSOS.Control.updatePcbDisplay(false, pcb);
            this.deallocateMemory(pcb);
            TSOS.Control.updateMemoryDisplay();
            /*
            if (_CPU.currentPCB.processID === pid) {
                _CPU.currentPCB = null;
            }
            */
            //Check if this is the last process in the list, if so then turn the cpu executing to be off
            if (this.readyQueue.getSize() === 0 && _CPU.currentPCB === null) {
                _CPU.isExecuting = false;
            }
        }
        getAllRunningProcesses() {
            //Return the entire PCB for each process of the resident list
            var processes = [];
            for (var i = 0; i < this.residentList.length; i++) {
                var pcb = this.residentList[i];
                if (pcb.processState === "Running" || pcb.processState === "Ready" || pcb.processState === "Resident") {
                    processes.push(pcb);
                }
            }
            return processes;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map