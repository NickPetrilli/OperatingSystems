/* ------------
* memory.ts
*
* Memory
* ------------- */


module TSOS {

    export class Memory {

        public memory;

        //Length will be size 256, 0-255
        constructor(length: number) {
            this.memory = new Array(length);
        }

        public init() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        }

        //Used by the memory accessor to read data
        public getByte(addr: number): string {
            return this.memory[addr];
        }

        //Used by the memory accessor to write data
        public setByte(addr: number, data: string) {
            if (data.length === 1) {
                data = '0' + data;
            }
            this.memory[addr] = data;
        }

        public getSize(): number {
            return this.memory.length;
        }

    }
}