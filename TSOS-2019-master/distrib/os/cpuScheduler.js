/* -----------------
* cpuScheduler.ts
*
* CPU Scheduler
* --------------------*/
//CPU Scheduler schedules processes based on its configured mode and sends to CPU Dispatcher for context switches
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor() {
            this.quantum = 6;
            this.scheduleMode = "RR";
            this.executingPCB = null;
            this.counter = 1;
        }
        getQuantum() {
            return this.quantum;
        }
        setQuantum(q) {
            this.quantum = q;
        }
        schedule() {
            switch (this.scheduleMode) {
                case "RR":
                    this.scheduleRoundRobin();
                    break;
                case "FCFS":
                    this.scheduleFirstComeFirstServe();
                    break;
            }
        }
        scheduleRoundRobin() {
            if (this.executingPCB === null && _MemoryManager.readyQueue.getSize() > 0) {
                this.executingPCB = _MemoryManager.readyQueue.dequeue();
                _CPU.loadProcess(this.executingPCB);
            }
            //Already have a process executing, checking for another one to context switch to
            else if (_MemoryManager.readyQueue.getSize() > 0) {
                //Each process executes 6 cpu cycles and then moves to the next process
                if (this.counter === this.quantum) {
                    this.counter = 1;
                    _Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ);
                }
            }
        }
        scheduleFirstComeFirstServe() {
            //FCFS is essentially Round Robin scheduling with the quantum set as the highest value
            this.quantum = Number.MAX_VALUE;
            this.scheduleRoundRobin();
        }
        incrementCounter() {
            this.counter++;
        }
        resetCounter() {
            this.counter = 1;
        }
        setExecutingPCB(pcb) {
            this.executingPCB = pcb;
        }
        getScheduleMode() {
            return this.scheduleMode;
        }
        setSchedulingMode(mode) {
            this.scheduleMode = mode;
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map