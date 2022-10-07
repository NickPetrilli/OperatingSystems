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

            for (var i = 0; i < _MemorySize; i++) {
                _Memory.setByte(i, program[i]);
            }
            TSOS.Control.updateMemoryDisplay();

            return pcb.processID;
        }


    }
}