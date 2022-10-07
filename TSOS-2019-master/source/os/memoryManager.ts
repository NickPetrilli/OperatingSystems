/* ----------
* memoryManager.ts
*
* Memory Manager
* ----------- */

//Memory manager responsible for allocating and deallocating memory

module TSOS {

    export class MemoryManager {

        constructor() {

        }

        public load(program: Array<string>, priority: number): number {
            var pcb = new ProcessControlBlock(priority);

            this.allocateMemory(pcb, program);


            return pcb.processID;
        }

        //allocating memory needs to set the base and limit registers of the pcb
        public allocateMemory(pcb: TSOS.ProcessControlBlock, program: Array<string>): void {
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

            TSOS.Control.updateMemoryDisplay(pcb.baseRegister, pcb.limitRegister);
        }


    }
}