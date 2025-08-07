function calculateTotalPay(data) {
    return data.reduce((acc, item) => {
        const price = item.price ? +item.price : 0;
        const taxes = item.taxes ? +item.taxes : 0;
        const ads = item.ads ? +item.ads : 0;
        const count = item.count ? +item.count : 1;
        return acc + ((price + taxes + ads) * count);
    }, 0);
}

module.exports = {
    calculateTotalPay
};