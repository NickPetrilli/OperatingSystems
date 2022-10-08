/* -----------------
* processControlBlock.ts
* 
* Process Control Block 
* --------------------*/



module TSOS {

    export class ProcessControlBlock {
        
        public priority: number;
        public programCounter: number;
        public acc: number;
        public XRegister: number;
        public YRegister: number;
        public ZFlag: number;
        public processID: number;
        public processState: string; // New, Ready, Resident, Executing, Terminated
        public baseRegister: number;
        public limitRegister: number;

        public currentProcessId: number = 0;

        constructor(priority: number) {
            this.priority = priority;
            this.programCounter = 0;
            this.acc = 0;
            this.XRegister = 0;
            this.YRegister = 0;
            this.ZFlag = 0;
            this.processID = this.currentProcessId++;
            this.processState = "New";
            this.baseRegister = -1;
            this.limitRegister = -1;

        }

        //PCB needs to be updated after each instruction
        public update(pc: number, acc: number, XReg: number, YReg: number, ZFlag: number) {
            this.programCounter = pc;
            this.acc = acc;
            this.XRegister = XReg;
            this.YRegister = YReg;
            this.ZFlag = ZFlag;
        }

    }
}