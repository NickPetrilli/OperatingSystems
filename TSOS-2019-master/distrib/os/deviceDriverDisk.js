/* -----------------
* deviceDriverDisk.ts
*
* Device Driver Disk
* --------------------*/
var TSOS;
(function (TSOS) {
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the Disk Device Driver.
            this.status = "loaded";
            // More?
        }
        formatDisk() {
            _Kernel.krnTrace("Beginning disk format.");
            var block = this.createNewBlock();
            for (var i = 0; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        //Master Boot Record
                        if ((i == 0) && (j == 0) && (k == 0)) {
                            block[0] = "1";
                            sessionStorage.setItem(i + "," + j + "," + k, block.join(" "));
                            block[0] = "0";
                        }
                        else {
                            sessionStorage.setItem(i + "," + j + "," + k, block.join(" "));
                        }
                    }
                }
            }
            _Kernel.krnTrace("Disk formatted.");
            TSOS.Control.updateDiskDisplay();
        }
        createNewBlock() {
            //Each block is an array of size 64
            let block = new Array(64);
            for (var i = 0; i < 4; i++) {
                block[i] = "0";
            }
            for (var j = 0; j < block.length; j++) {
                block[j] = "-";
            }
            return block;
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map