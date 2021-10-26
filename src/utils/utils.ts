export default class Utils{


    static formatString(text: string): string{
        const STRING_SIZE = 50

        let strLen = text.length;
        if (strLen > STRING_SIZE){
            return text.substr(0, STRING_SIZE-1) + "…";
        }
        return text.padEnd(STRING_SIZE," ");
    }

    static parseSecondsToISO(lenghtSeconds: number): string{
        let seconds = (lenghtSeconds % 60).toString();
        seconds = seconds.length > 1 ? seconds.toString() : "0" + seconds.toString();
        let minutes = (lenghtSeconds/60>>0)%60;
        let hours = lenghtSeconds/3600>>0;
        let response = "";

        if(hours > 0)
            response += `${hours}:`
        response += `${minutes}:${seconds}`
        return response

    }

    static parseISOToSeconds(ISO : string): number{
        let ISOArr = ISO.split(":");
        let multi = 1;
        let total = 0;
        for (let i = ISOArr.length-1; i >= 0 ; i--){
            total += parseInt(ISOArr[i])*multi;
            multi *= 60;
        }
        return total;
    }

    // https://www.30secondsofcode.org/js/s/levenshtein-distance
    static levenshteinDistance(s: string, t: string): number{
        if (!s.length) return t.length;
        if (!t.length) return s.length;
        const arr = [];
        for (let i = 0; i <= t.length; i++) {
            arr[i] = [i];
            for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
                i === 0
                ? j
                : Math.min(
                    arr[i - 1][j] + 1,
                    arr[i][j - 1] + 1,
                    arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
            }
        }
        return arr[t.length][s.length];
    };
}