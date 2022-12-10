/* -----------------
* disk.ts
* 
* Disk
* Contains 4 tracks, with 8 sectors each, each with 8 bytes
* --------------------*/



module TSOS {

    export class Disk {

        public numTracks: number; //The number of tracks on the disk
        public numSectors: number; //The number of sectors in each track
        public numBlocks: number; //The number of blocks on each sector

        constructor() {
            this.numTracks = 4;
            this.numSectors = 8;
            this.numBlocks = 8;
        }


    }

}