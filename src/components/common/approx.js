const ApproximateDecimal = (data) => {
    const changeToString = String(data);

    const findIndex = changeToString.indexOf(".");
    if(findIndex === -1){
        return Number(changeToString).toLocaleString();;
    }

    const splitDataByDecimal = changeToString.split('.');
    const splitFractions = splitDataByDecimal[1].split('');
    if(splitFractions.length <= 2){
        return Number(changeToString).toLocaleString();
    }
    
    let fractionBuilder = splitFractions[0];
    if(Number(splitFractions[2] > 5)){
        const tenths = Number(splitFractions[1]) + 1;
        fractionBuilder = fractionBuilder.concat("", tenths);

    }else{
        fractionBuilder = fractionBuilder.concat(splitFractions[1]);
    }

    const approxWithComma = Number(splitDataByDecimal[0]).toLocaleString();
    const approxNumber = approxWithComma.concat(".", fractionBuilder);

    return approxNumber;
}

export default ApproximateDecimal;