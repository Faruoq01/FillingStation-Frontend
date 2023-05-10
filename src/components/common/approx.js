const ApproximateDecimal = (data) => {
    const changeToString = String(data);

    const findIndex = changeToString.indexOf(".");
    if(findIndex === -1){
        const rem = changeToString.replace(/[^0-9.]/g, '')
        return Number(rem).toLocaleString();

    }else{
        let splitByDecimal = changeToString.split(".");

        ////////// left hand side //////////////////////
        let removeSpecialCharacters = splitByDecimal[0].replace(/[^0-9.]/g, '');
        let addCommaToLeftSide = Number(removeSpecialCharacters).toLocaleString();

        ////////// right hand side /////////////////////
        let removeCharactersRight = splitByDecimal[1].replace(/[^0-9.]/g, '');
        if(removeCharactersRight.length <= 2){
            return addCommaToLeftSide.concat(".", removeCharactersRight);

        }else{
            let tenths = Number(removeCharactersRight.charAt(2)) < 5? removeCharactersRight.charAt(1): String(Number(removeCharactersRight.charAt(1)) + 1);
            let newRight = removeCharactersRight.charAt(0).concat("", tenths);

            return addCommaToLeftSide.concat(".", newRight); 
        }
    }
}

export default ApproximateDecimal;