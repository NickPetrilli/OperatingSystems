/* ---------------
* memoryAccessor.ts
*
* Memory Accessor
* ---------------- */

//Memory accessor is for reading and writing to memory

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }

        public read(pcb: TSOS.ProcessControlBlock, addr: number) {
            if (addr >= 0) {
                return _Memory.getByte(pcb.baseRegister + addr);
            }
            else {
                alert('Memory Access Error');
            }
        }

        public write(pcb: TSOS.ProcessControlBlock, addr: number, data: string) {
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
}