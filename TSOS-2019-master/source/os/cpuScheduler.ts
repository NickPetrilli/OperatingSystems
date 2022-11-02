/* -----------------
* cpuScheduler.ts
* 
* CPU Scheduler 
* --------------------*/


module TSOS {

    export class CpuScheduler {

        private quantum: number;

        constructor() {
            this.quantum = 6;
        }

        public getQuantum(): number {
            return this.quantum;
        }

        public setQuantum(q: number): void {
            this.quantum = q;
        }

        public contextSwitch(): void {

        }

    }
}