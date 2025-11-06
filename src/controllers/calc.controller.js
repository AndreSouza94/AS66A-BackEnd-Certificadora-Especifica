export const calc = (req, res) => {
    
    const { tipo, valorInicial, tempoAnos, taxaAnual} = req.body;

    const result = valorInicial * Math.pow((1 + (taxaAnual / 100)), tempoAnos);

    let impostoIR;
    let tempoMeses = tempoAnos * 12;
    let dias = tempoMeses * 30;
    
    if(tipo === "cdb" || tipo === "tesouro-direto") {
        if(dias <= 180) {
            impostoIR = 0.225;
        } else if(dias > 180 && dias <= 360) {
            impostoIR = 0.200;
        } else if(dias > 360 && dias <= 720) {
            impostoIR = 0.175;
        } else {
            impostoIR = 0.150;
        }  
    } else if (tipo === "lci" || tipo === "lca" || tipo === "cri" || tipo === "cra") {
        impostoIR = 0.0;
    } else {
        return res.status(400).json({msg: "Tipo de investimento não existe!"});
    }
    
    const custoTotal = (result - valorInicial) * impostoIR;
    const valorLiquido = result - custoTotal;
    const lucroBruto = result - valorInicial;
    const impostoDeRenda = impostoIR * 100;

    return res.status(200).json({
        valorBruto: result.toFixed(2), 
        lucroBruto: lucroBruto.toFixed(2),
        valorLiquido: valorLiquido.toFixed(2),
        custoTotal: custoTotal.toFixed(2), 
        impostoDeRenda: impostoDeRenda.toFixed(2)
    });
}