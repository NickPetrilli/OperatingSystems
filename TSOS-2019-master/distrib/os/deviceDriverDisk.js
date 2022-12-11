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
        createFile(filename) {
            //First file entry will be directory block 001
            //TODO: check that file doesn't exist first - return true or false
            var directoryEntry = this.nextDirectoryEntry();
            var dataEntry = this.nextDataEntry();
            var directoryEntryData = this.createNewBlock();
            var dataEntryData = this.createNewBlock();
            //Set the used bit to 1 for both the directory entry and data entry
            directoryEntryData[0] = "1";
            dataEntryData[0] = "1";
            //Split on commas to put the T,S,B of data entry in the directory
            var dataEntrySplit = dataEntry.split(",");
            directoryEntryData[1] = dataEntrySplit[0];
            directoryEntryData[2] = dataEntrySplit[1];
            directoryEntryData[3] = dataEntrySplit[2];
            for (var i = 0; i < filename.length; i++) {
                directoryEntryData[i + 4] = this.decimalToHex(filename.charCodeAt(i));
            }
            sessionStorage.setItem(directoryEntry, directoryEntryData.join(" "));
            sessionStorage.setItem(dataEntry, dataEntryData.join(" "));
            return true;
        }
        //Finds the next directory entry to store the filename that is being created
        nextDirectoryEntry() {
            for (var i = 0; i < _Disk.numSectors; i++) {
                for (var j = 0; j < _Disk.numTracks; j++) {
                    var data = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (data[0] === "0") {
                        return "0," + i + "," + j;
                    }
                }
            }
            return null;
        }
        nextDataEntry() {
            //Start at track 1 for data section of file system
            for (var i = 1; i < _Disk.numTracks; i++) {
                for (var j = 0; j < _Disk.numSectors; j++) {
                    for (var k = 0; k < _Disk.numBlocks; k++) {
                        var data = sessionStorage.getItem(i + "," + j + "," + k);
                        if (data[0] === "0") {
                            return i + "," + j + "," + k;
                        }
                    }
                }
            }
            return null;
        }
        decimalToHex(decimalNum) {
            return decimalNum.toString(16);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map