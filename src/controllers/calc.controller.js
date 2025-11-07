import HistoricoModel from "../models/historico.models.js";

export const getCalc = async (req, res) => {
    try {
        const userId = req.user.id;
        const historicoUsuario = await HistoricoModel.find({usuarioId: userId})

        return res.status(200).json({ msg: historicoUsuario});
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const calc = async (req, res) => {
    try {
        const { tipo, valorInicial, tempoAnos, rentabilidade} = req.body;
        const userId = req.user.id;
        const result = valorInicial * Math.pow((1 + (rentabilidade / 100)), tempoAnos);
    
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
        const valorFinal = result - custoTotal;
        const lucroLiquido = result - valorInicial;
        const impostoDeRenda = impostoIR * 100;
    
        const newHistorico = await HistoricoModel.create({
            usuarioId: userId,
            tipo,
            valorInicial,
            tempoAnos,
            rentabilidade,
            valorFinal: valorFinal.toFixed(2),
            lucroLiquido: lucroLiquido.toFixed(2),
        })
        
        return res.status(200).json({ msg: newHistorico });
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}