export default class Utils{


    static formatString(text: string): string{
        const STRING_SIZE = 50

        let strLen = text.length;
        if (strLen > STRING_SIZE){
            return text.substr(0, STRING_SIZE-1) + "…";
        }
        return text.padEnd(STRING_SIZE," ");
    }

    static parseSecondsToISO(seconds: number): string{
        if (seconds < 3600)
            return new Date(seconds * 1000).toISOString().substr(14, 5);
        return new Date(seconds * 1000).toISOString().substr(11, 8)
    }

    static parseISOToSeconds(ISO : string): number{
        let ISOArr = ISO.split(":");
        let multi = 1;
        let total = 0;
        for (const isoArrKey in ISOArr) {
            total += parseInt(isoArrKey)*multi;
            multi *= 60;
        }
        return total;
    }
}