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

        public static singleStep: boolean;

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public instruction: string = 'N/A',
                    public currentPCB: TSOS.ProcessControlBlock = null) {
            TSOS.Cpu.singleStep = false;
        }

        public init(): void {

        }
        
        //Loads process from cpu scheduler for context switching
        public loadProcess(pcb: TSOS.ProcessControlBlock): void {
            if (pcb.processState !== "Terminated") {
            this.currentPCB = pcb;
            //Load the cpu registers from the new pcb
            this.PC = this.currentPCB.programCounter;
            this.Acc = this.currentPCB.acc;
            this.Xreg = this.currentPCB.XRegister;
            this.Yreg = this.currentPCB.YRegister;
            this.Zflag = this.currentPCB.ZFlag;
            
            this.runNewProcess();
            }

        }

        //This run process is called by load process above, only used for context switching
        public runNewProcess() {
            this.currentPCB.processState = "Executing";
            TSOS.Control.updatePcbDisplay(false, this.currentPCB);
            this.isExecuting = true;
        }

        //This is the original run process function, used from the shell command of running one process
        public runProcess(pid: number): void {
            this.currentPCB = _MemoryManager.residentList[pid];
            this.currentPCB.processState = "Executing";

            TSOS.Control.updatePcbDisplay(false, this.currentPCB);
            this.isExecuting = true;
        }

        public runAllProcesses(): void {
            for (var i = 0; i < _MemoryManager.residentList.length; i++) {
                var pcb = _MemoryManager.residentList[i];
                pcb.processState = "Ready"; 
                TSOS.Control.updatePcbDisplay(false, pcb);
                _MemoryManager.readyQueue.enqueue(pcb);
                
            }
            this.isExecuting = true;
        }

        public cycle(): void {            
            // TODO: Accumulate CPU usage and profiling statistics here.

            if (this.currentPCB !== null && this.isExecuting) {

                _Kernel.krnTrace('CPU cycle');
                this.instruction = _MemoryAccessor.read(this.currentPCB, this.PC);

                _CpuScheduler.incrementCounter();

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
                        alert("Illegal instruction " + this.instruction);
                        this.isExecuting = false;
                        break;
                } 
            }
            if (this.PC > 256) {
                this.PC = this.PC % 256;
            }

            this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);

            //Stop executing if single step is on
            if (TSOS.Cpu.singleStep) {
                this.isExecuting = false;
            }

            TSOS.Control.updateCpuDisplay(this.currentPCB, this.instruction);
            TSOS.Control.updatePcbDisplay(false, this.currentPCB, this.instruction);




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
            this.currentPCB.processState = "Terminated";
            TSOS.Control.updatePcbDisplay(false, this.currentPCB);
            _MemoryManager.deallocateMemory(this.currentPCB);
            TSOS.Control.updateMemoryDisplay();
            this.currentPCB = null;
            _CpuScheduler.setExecutingPCB(this.currentPCB);
            _CpuScheduler.resetCounter();
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            if (!(_MemoryManager.readyQueue.getSize() > 0)) {
                this.isExecuting = false;
            }
            

        }

        private compareMemToXReg() { //EC
            this.PC++;
            var addr = parseInt(_MemoryAccessor.read(this.currentPCB, this.PC), 16);
            this.PC++;
            //Sets the z flag to 1 if comparison is true, and 0 if false 
            this.Zflag = (this.Xreg === parseInt(_MemoryAccessor.read(this.currentPCB, addr), 16)) ? 1 : 0;
            this.PC++;
        }

        private branch() { //D0
            this.PC++;
            if (this.Zflag === 0) {
                var branch = _MemoryAccessor.read(this.currentPCB, this.PC);
                this.PC++;
                var branchDistance = parseInt(branch, 16);
                //_StdOut.putText("Branching " + branchDistance + " PC before = " + this.PC);
                this.PC += branchDistance;
                //_StdOut.putText("PC after = " + this.PC);
            }
            else {
                //_StdOut.putText("Not branching");
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
