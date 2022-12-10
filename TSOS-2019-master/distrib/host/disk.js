/* -----------------
* disk.ts
*
* Disk
* Contains 4 tracks, with 8 sectors each, each with 8 bytes
* --------------------*/
var TSOS;
(function (TSOS) {
    class Disk {
        constructor() {
            this.numTracks = 4;
            this.numSectors = 8;
            this.numBlocks = 8;
        }
    }
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=disk.js.map