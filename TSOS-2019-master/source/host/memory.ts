/* ------------
* memory.ts
*
* Memory
* ------------- */


module TSOS {

    export class Memory {

        private memory;

        //Length will be size 256, 0-255
        constructor(length: number) {
            this.memory = new Array(length);
        }

        public init() {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        }


        
    }
}