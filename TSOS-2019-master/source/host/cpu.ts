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

        }

        public runProcess(pid: number): void {
            this.currentPCB = _MemoryManager.residentList[pid];
            this.currentPCB.processState = "Executing";

            TSOS.Control.updatePcbDisplay(this.currentPCB);
            this.isExecuting = true;
        }

        public cycle(): void {            
            // TODO: Accumulate CPU usage and profiling statistics here.

            if (this.currentPCB !== null && this.isExecuting) {

                _Kernel.krnTrace('CPU cycle');
                this.instruction = _MemoryAccessor.read(this.currentPCB, this.PC);

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
            TSOS.Control.updateCpuDisplay(this.currentPCB, this.instruction);
            TSOS.Control.updatePcbDisplay(this.currentPCB);


        }// end of cycle

        private loadAccWithConstant() { //A9 
            this.PC++;
            this.Acc = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadAccFromMemory() { //AD
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++
        }

        private storeAccInMemory() { //8D
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            _MemoryAccessor.write(this.currentPCB, addr, this.Acc.toString(16));
            this.PC++;
        }

        private addWithCarry() { //6D
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc += parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;

        }

        private loadXRegWithConstant() { //A2
            this.PC++;
            this.Xreg = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadXRegFromMemory() { //AE
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Xreg = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;
        }

        private loadYRegWithConstant() { //A0
            this.PC++
            this.Yreg = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }

        private loadYRegFromMemory() { //AC
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Yreg = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            this.PC++;
        }

        private breakSystemCall() { //00
            this.isExecuting = false;
            this.currentPCB.processState = "Terminated";
            this.currentPCB = null;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            
        }

        private compareMemToXReg() { //EC
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            if (this.Xreg === parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16)) {
                this.Zflag = 1;
            }
            this.PC++;
        }

        private branch() { //D0
            this.PC++;
            if (this.Zflag === 0) {
                var jump = _MemoryAccessor.read(this.currentPCB, this.PC);
                this.PC++;
                var jumpNum = parseInt(jump, 16);
                this.PC += jumpNum;
            }
            else {
                this.PC++;
            }
        }

        private incrementValue() { //EE
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            var value = parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16);
            value++;
            _MemoryAccessor.write(this.currentPCB, addr, value.toString(16));
            this.PC++;
        }

        private systemCall() { //FF
            //If 1 in X Reg = print the integer stored in the Y Reg
            //If 2 in X Reg = print the 00-terminated string stored at the address in the Y Reg

            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString());
                this.PC++;
            }
            else if (this.Xreg === 2) {
                var output = '';
                var addr = this.Yreg;
                var data = _MemoryAccessor.read(this.currentPCB, addr);
                while (data !== '00') {
                    var letter = String.fromCharCode(parseInt(data, 16));
                    output += letter;
                    addr++;
                    var data = _MemoryAccessor.read(this.currentPCB, addr);
                }
                _StdOut.putText(output + '');
                this.PC++;
            }

        }
    }
}
