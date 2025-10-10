export const calc = (req, res) => {
    
    const { type, initialValue, time, annualInterest} = req.body;

    const result = initialValue * Math.pow((1 + (annualInterest / 100)), time);

    let irrf;
    let month = time * 12;
    let days = month * 30;
    
    if(type === "cdb" || type === "tesouro") {
        if(days <= 180) {
            irrf = 0.225;
        } else if(days > 180 && days <= 360) {
            irrf = 0.200;
        } else if(days > 360 && days <= 720) {
            irrf = 0.175;
        } else {
            irrf = 0.150;
        }  
    } else if (type === "lci" || type === "lca" || type === "cri" || type === "cra") {
        irrf = 0.0;
    } 
    
    const totalCost = (result - initialValue) * irrf;
    const netValue = result - totalCost;
    const grossProfit = result - initialValue;
    const totalTax = irrf * 100;

    return res.status(200).json({
        valorBruto: result.toFixed(2), 
        lucroBruto: grossProfit.toFixed(2),
        valorLiquido: netValue.toFixed(2),
        custoTotal: totalCost.toFixed(2), 
        impostoDeRenda: totalTax.toFixed(2)
    });
}