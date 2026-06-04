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
            this.rrQuantum = 6;
            this.scheduleMode = "rr";
            this.executingPCB = null;
            this.counter = 1;
        }
        getQuantum() {
            return this.quantum;
        }
        setQuantum(q) {
            this.quantum = q;
            this.rrQuantum = q;
        }
        schedule() {
            switch (this.scheduleMode) {
                case "rr":
                    this.scheduleRoundRobin();
                    break;
                case "fcfs":
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
            // Run the next process if the CPU is idle; no quantum-based preemption
            if (this.executingPCB === null && _MemoryManager.readyQueue.getSize() > 0) {
                this.executingPCB = _MemoryManager.readyQueue.dequeue();
                _CPU.loadProcess(this.executingPCB);
            }
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
            if (this.scheduleMode == "rr") {
                return "Round Robin";
            }
            else if (this.scheduleMode === "fcfs") {
                return "First Come First Serve";
            }
        }
        setSchedulingMode(mode) {
            this.scheduleMode = mode;
            if (mode === "rr") {
                // Restore the saved RR quantum in case we were in FCFS mode
                this.quantum = this.rrQuantum;
            }
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map