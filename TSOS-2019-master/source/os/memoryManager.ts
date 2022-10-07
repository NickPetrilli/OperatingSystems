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

        public load(program: Array<String>, priority: number): number {
            var pcb = new ProcessControlBlock(priority);

            

            return pcb.processID;
        }


    }
}