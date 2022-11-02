/* ----------
* memoryManager.ts
*
* Memory Manager
* ----------- */

//Memory manager responsible for allocating and deallocating memory and managing the processes

module TSOS {

    const numPrograms = 3;

    export class MemoryManager {

        //Array to keep track of processes that are loaded
        public residentList: TSOS.ProcessControlBlock[];

        public readyQueue: TSOS.Queue;

        private allocated;

        constructor() {
            this.residentList = [];
            this.readyQueue = new Queue();
            //New array for memory allocation separate from the actual memory array
            this.allocated = new Array(numPrograms);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }

        }

        public load(program: Array<string>, priority: number): number {
            var pcb = new ProcessControlBlock(priority);
            this.residentList[pcb.processID] = pcb;
            //pcb.processState = "Resident";

            this.allocateMemory(pcb, program);
            TSOS.Control.updatePcbDisplay(pcb);

            return pcb.processID;
        }

        //allocating memory needs to set the base and limit registers of the pcb
        public allocateMemory(pcb: TSOS.ProcessControlBlock, program: Array<string>): void {
            
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === -1) {
                    this.allocated[i] = pcb.processID;
                    pcb.baseRegister = i * 256; //base registers will be 0, 256, and 512
                    pcb.limitRegister = pcb.baseRegister + 255; //limit registers will be 255, 511, and 767
                    break;
                }
            }
            
            
            //Check for error setting base reg 
            if (pcb.baseRegister === -1) {
                alert("ERROR: BASE REGISTER IS NOT SET");
            }
            //Actually puts the program instructions into memory
            //Changes so now the program fills the entire allocated memory even if the program isn't that size

            for (var i = 0; i < 256; i++) {
                var code = program[i];
                if (code === undefined) {
                    code = '00';
                }
                _Memory.setByte(pcb.baseRegister + i, code);
            }

            TSOS.Control.updateMemoryDisplay(pcb.baseRegister);
        }
        

        //Deallocate memory when process finishes or is killed
        public deallocateMemory(pcb: TSOS.ProcessControlBlock): void {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === pcb.processID) {
                    this.allocated[i] = -1;
                    _Memory.clearRange(pcb.baseRegister, pcb.limitRegister);
                    break;
                }
            }
            
        }

        public doesProcessExist(pid: number): boolean {
            if (this.residentList[pid] === undefined) {
                return false;
            }
            return true;
        }

        public killProcess(pid: number): void {
            var pcb = this.residentList[pid];
            pcb.processState = "Terminated";
            this.deallocateMemory(pcb);
            //Check if this is the last process in the list, if so then turn the cpu executing to be off
            if (this.readyQueue.getSize() === 0 && _CPU.currentPCB === null) {
                _CPU.isExecuting = false;
            }
            else if (_CPU.currentPCB.processID === pid) {
                _CPU.currentPCB = null;

            }
        }

        public getAllRunningProcesses(): TSOS.ProcessControlBlock[] {
            //Return the entire PCB for each process of the resident list
            var processes: TSOS.ProcessControlBlock[] = [];
            for (var i = 0; i < this.residentList.length; i++) {
                var pcb = this.residentList[i];
                if (pcb.processState === "Running" || pcb.processState === "Resident") {
                    processes.push(pcb);
                }
            }
            return processes;
        }
    }
}