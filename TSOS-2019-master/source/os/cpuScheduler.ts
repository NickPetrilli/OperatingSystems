/* -----------------
* cpuScheduler.ts
* 
* CPU Scheduler 
* --------------------*/

//CPU Scheduler schedules processes based on its configured mode and sends to CPU Dispatcher for context switches

module TSOS {

    export class CpuScheduler {

        private quantum: number; //Round Robin quantum
        private rrQuantum: number; //Saved RR quantum, restored when switching from FCFS back to RR
        private scheduleMode: string; //Round Robin, FCFS

        public executingPCB: TSOS.ProcessControlBlock;
        private counter: number;

        constructor() {
            this.quantum = 6;
            this.rrQuantum = 6;
            this.scheduleMode = "rr";

            this.executingPCB = null;
            this.counter = 1;
        }

        public getQuantum(): number {
            return this.quantum;
        }

        public setQuantum(q: number): void {
            this.quantum = q;
            this.rrQuantum = q;
        }

        public schedule(): void {
            switch(this.scheduleMode) {
                case "rr":
                    this.scheduleRoundRobin();
                    break;
                case "fcfs":
                    this.scheduleFirstComeFirstServe();
                    break;
            }
        }

        public scheduleRoundRobin(): void {
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

        public scheduleFirstComeFirstServe(): void {
            // Run the next process if the CPU is idle; no quantum-based preemption
            if (this.executingPCB === null && _MemoryManager.readyQueue.getSize() > 0) {
                this.executingPCB = _MemoryManager.readyQueue.dequeue();
                _CPU.loadProcess(this.executingPCB);
            }
        }

        public incrementCounter(): void {
            this.counter++;
        }

        public resetCounter(): void {
            this.counter = 1;
        }

        public setExecutingPCB(pcb: TSOS.ProcessControlBlock): void {
            this.executingPCB = pcb;
        }

        public getScheduleMode(): string {
            if (this.scheduleMode == "rr") {
                return "Round Robin";
            }
            else if (this.scheduleMode === "fcfs") {
                return "First Come First Serve";
            }
            
        }

        public setSchedulingMode(mode: string): void {
            this.scheduleMode = mode;
            if (mode === "rr") {
                // Restore the saved RR quantum in case we were in FCFS mode
                this.quantum = this.rrQuantum;
            }
        }

    }
}