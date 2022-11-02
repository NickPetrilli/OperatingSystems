/* -----------------
* cpuScheduler.ts
*
* CPU Scheduler
* --------------------*/
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor() {
            this.quantum = 6;
        }
        getQuantum() {
            return this.quantum;
        }
        setQuantum(q) {
            this.quantum = q;
        }
        contextSwitch() {
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map