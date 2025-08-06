

const prefixZero = (num) => {
    return num  > 0 && num < 10 ? "00" + num :  num > 10 && num < 100 ? "0" + num : num;
}

export default prefixZero