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
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false, instruction = 'N/A', currentPCB = null) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.instruction = instruction;
            this.currentPCB = currentPCB;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        cycle() {
            // TODO: Accumulate CPU usage and profiling statistics here.
            if (this.currentPCB !== null && this.isExecuting) {
                _Kernel.krnTrace('CPU cycle');
                this.instruction = _MemoryManager.read(this.currentPCB, this.PC);
                switch (this.instruction) {
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
        } // end of cycle
        loadAccWithConstant() {
            this.PC++;
            this.Acc = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }
        loadAccFromMemory() {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        }
        storeAccInMemory() {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            _MemoryManager.write(this.currentPCB, addr, this.Acc.toString(16));
            this.PC++;
        }
        addWithCarry() {
            this.PC++;
        }
        loadXRegWithConstant() {
            this.PC++;
        }
        loadXRegFromMemory() {
            this.PC++;
        }
        loadYRegWithConstant() {
            this.PC++;
        }
        loadYRegFromMemory() {
            this.PC++;
        }
        breakSystemCall() {
            this.isExecuting = false;
            this.currentPCB = null;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
        }
        compareMemToXReg() {
            this.PC++;
        }
        branch() {
            this.PC++;
        }
        incrementValue() {
            this.PC++;
        }
        systemCall() {
            this.PC++;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map