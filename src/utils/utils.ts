export default class Utils{


    static formatString(text: string): string{
        const STRING_SIZE = 50

        let strLen = text.length;
        if (strLen > STRING_SIZE){
            return text.substr(0, STRING_SIZE-1) + "…";
        }
        return text.padEnd(STRING_SIZE," ");
    }
}