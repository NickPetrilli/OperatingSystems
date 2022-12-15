/* -----------------
* processControlBlock.ts
*
* Process Control Block
* --------------------*/
var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(priority) {
            this.priority = priority;
            this.programCounter = 0;
            this.acc = 0;
            this.XRegister = 0;
            this.YRegister = 0;
            this.ZFlag = 0;
            this.processID = ProcessControlBlock.currentProcessId++;
            this.processState = "New";
            this.baseRegister = -1;
            this.limitRegister = -1;
            this.isInMemory = false;
            this.diskLocation = "";
            this.memSegment = -1;
        }
        //PCB needs to be updated after each instruction
        update(pc, acc, XReg, YReg, ZFlag) {
            this.programCounter = pc;
            this.acc = acc;
            this.XRegister = XReg;
            this.YRegister = YReg;
            this.ZFlag = ZFlag;
        }
    }
    ProcessControlBlock.currentProcessId = 0;
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map