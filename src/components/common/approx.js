const ApproximateDecimal = (data) => {
    const changeToString = String(data);

    const findIndex = changeToString.indexOf(".");
    if(findIndex === -1){
        const rem = changeToString.replace(/[^0-9.]/g, '')
        return Number(rem).toLocaleString();
    }

    const splitDataByDecimal = changeToString.split('.');
    const splitFractions = splitDataByDecimal[1].split('');
    if(splitFractions.length <= 2){
        const left = splitDataByDecimal[0].replace(/[^0-9.]/g, '')
        const format = Number(left).toLocaleString();
        return format.concat(splitDataByDecimal[1]);
    }
    
    let fractionBuilder = splitFractions[0];
    if(Number(splitFractions[2] > 5)){
        const tenths = Number(splitFractions[1]) + 1;
        fractionBuilder = fractionBuilder.concat("", tenths);

    }else{
        fractionBuilder = fractionBuilder.concat(splitFractions[1]);
    }

    const left = splitDataByDecimal[0].replace(/[^0-9.]/g, '')
    const approxWithComma = Number(left).toLocaleString();
    const approxNumber = approxWithComma.concat(".", fractionBuilder);

    return approxNumber;
}

export default ApproximateDecimal;