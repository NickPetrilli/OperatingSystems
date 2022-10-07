/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public instruction: string = 'N/A',
                    public currentPCB: TSOS.ProcessControlBlock = null) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {            
            // TODO: Accumulate CPU usage and profiling statistics here.

            if (this.currentPCB !== null && this.isExecuting) {

                _Kernel.krnTrace('CPU cycle');
                this.instruction = _MemoryManager.read(this.currentPCB, this.PC);

                switch(this.instruction) {
                    case 'A9': // Load the accumulator with a constant
                        this.loadAccWithConstant();
                        break;
                    case 'AD': // Load acc from memory
                        this.loadAccFromMemory();
                        break;
                    case '8D': // Store acc in memory
                        this.storeAccInMemory();
                        break;
                    case '6D': // Add with carry 
                        this.addWithCarry();
                        break;
                    case 'A2': // Load X Register with a constant
                        this.loadXRegWithConstant();
                        break;
                    case 'AE': //Load X Register from memory
                        this.loadXRegFromMemory();
                        break;
                    case 'A0': // Load Y Register with a constant
                        this.loadYRegWithConstant();
                        break;
                    case 'AC': // Load Y Register from memory
                        this.loadYRegFromMemory();
                        break;
                    case 'EA': // No op
                        this.PC++;
                        break;
                    case '00': // Break (system call)
                        this.breakSystemCall();
                        break;
                    case 'EC': // Compare a byte in memory to the X register, sets Z flag if equal
                        this.compareMemToXReg();
                        break;
                    case 'D0': // Branch N bytes if Z flag = 0
                        this.branch();
                        break;
                    case 'EE': // Increment the value of a byte
                        this.incrementValue();
                        break;
                    case 'FF': // System call
                        this.systemCall();
                        break;
                    default:
                        alert("Illegal instruction");
                        this.isExecuting = false;
                        break;
                } 
            }

            this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);


        }// end of cycle

        private loadAccWithConstant() {
            this.PC++;
            this.Acc = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadAccFromMemory() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++
        }

        private storeAccInMemory() {
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            _MemoryAccessor.write(this.currentPCB, addr, this.Acc.toString(16));
            this.PC++;
        }

        private addWithCarry() {
            this.PC++;

        }

        private loadXRegWithConstant() {
            this.PC++;

        }

        private loadXRegFromMemory() {
            this.PC++;

        }

        private loadYRegWithConstant() {
            this.PC++

        }

        private loadYRegFromMemory() {
            this.PC++;

        }

        private breakSystemCall() {
            this.isExecuting = false;
            this.currentPCB = null;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            
        }

        private compareMemToXReg() {
            this.PC++;

        }

        private branch() {
            this.PC++;

        }

        private incrementValue() {
            this.PC++;

        }

        private systemCall() {
            this.PC++;

        }
    }
}
