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
            this.scheduleMode = "Round Robin";
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
                case "Round Robin":
                    this.scheduleRoundRobin();
                    break;
                case "Priority":
                    this.schedulePriority();
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
                    //_CpuDispatcher.contextSwitch();
                }
            }
        }
        schedulePriority() {
            //TODO for iProject 4
        }
        scheduleFirstComeFirstServe() {
            //TODO for iProject 4
        }
        incrementCounter() {
            this.counter++;
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map