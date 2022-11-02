/* ------------
* memory.ts
*
* Memory
* ------------- */


module TSOS {

    export class Memory {

        public memory;

        //Length will be size 768, 0-767
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

        //Used for clearmem shell command
        public clearMemory(): void {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        }

        //Used when a process terminates or is killed by the user
        public clearRange(base: number, limit: number): void {
            for (var i = 0; i < (limit - base); i++) {
                this.memory[base + i] = '00';
            }
        }

    }
}