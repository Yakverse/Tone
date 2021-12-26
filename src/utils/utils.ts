export default class Utils{

    static shuffleArray(array: any[]){
        let currentIndex = array.length,  randomIndex;

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    static formatString(text: string, stringSize: number): string{

        let strLen = text.length;
        if (strLen > stringSize){
            return text.substr(0, stringSize-1) + "…";
        }
        return text.padEnd(stringSize," ");
    }

    static parseSecondsToISO(lenghtSeconds: number): string{
        let seconds = (lenghtSeconds % 60).toString();
        seconds = seconds.length > 1 ? seconds : "0" + seconds;
        let minutes = ((lenghtSeconds/60>>0)%60).toString();
        minutes = minutes.length > 1 ? minutes : "0" + minutes;
        let hours = lenghtSeconds/3600>>0;
        return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    }

    static parseISOToSeconds(ISO : string): number{
        if (!ISO){
            return 0;
        }
        let ISOArr = ISO.split(":").reverse();
        let hours = 0, minutes = 0, seconds = 0;
        switch (ISOArr.length) {
            case 3:
                hours   = parseInt(ISOArr[2]);
            case 2:
                minutes = parseInt(ISOArr[1]);
            case 1:
                seconds = parseInt(ISOArr[0]);
                return hours * 3600 + minutes * 60 + seconds;
            default:
                // Não deve chegar aqui
                return 0;
        }
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
