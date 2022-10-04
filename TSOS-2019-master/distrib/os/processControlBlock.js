/* -----------------
* processControlBlock.ts
*
* Process Control Block
* --------------------*/
var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(priority) {
            this.currentProcessId = 0;
            this.priority = priority;
            this.programCounter = 0;
            this.acc = 0;
            this.XRegister = 0;
            this.YRegister = 0;
            this.ZFlag = 0;
            this.processID = this.currentProcessId++;
            this.processState = "New";
            this.baseRegister = 0;
            this.limitRegister = 0;
        }
        update(pc, acc, XReg, YReg, ZFlag) {
            this.programCounter = pc;
            this.acc = acc;
            this.XRegister = XReg;
            this.YRegister = YReg;
            this.ZFlag = ZFlag;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processControlBlock.js.map