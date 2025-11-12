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
        const { tipo, valorInicial, dataInicial, dataFinal, rentabilidade} = req.body;
        const userId = req.user.id;
        
        let impostoRenda, impostoIOF, diferencaDias = dataFinal - dataInicial;

        // Fórmula de Juros compostos
        const resultado = valorInicial * Math.pow((1 + (rentabilidade / 100)), (diferencaDias / 365));

        // Cálculo de IOF
        if(diferencaDias <= 30) {
            impostoIOF = (diferencaDias * 30) - ((diferencaDias / 3) - 1) * 100;
        }

        //Valor do Imposto de Renda
        if(tipo === "lci" || tipo === "lca") {
            impostoRenda = 0.0; 
        } else {
            if(diferencaDias <= 180) {
                impostoRenda = 0.225;
            } else if(diferencaDias <= 360) {
                impostoRenda = 0.200;
            } else if(diferencaDias <= 720) {
                impostoRenda = 0.175;
            } else {
                impostoRenda = 0.150;
            }  
        }
        
        const rendimentoBruto = resultado - valorInicial;       
        const valorImpostoIR = rendimentoBruto * impostoRenda;     
        const valorImpostoIOF = rendimentoBruto * Number(impostoIOF) || 0;
        const impostosTotais = valorImpostoIOF + valorImpostoIR;
        const lucroLiquido = resultado - impostosTotais;          

        const newHistorico = await HistoricoModel.create({
            usuarioId: userId,
            tipo,
            valorInicial,
            tempoDias: diferencaDias,
            rentabilidade,
            rendimentoBruto: rendimentoBruto.toFixed(2),
            impostoIOF: valorImpostoIOF.toFixed(2),
            impostoRenda: valorImpostoIR.toFixed(2),
            lucroLiquido: lucroLiquido.toFixed(2),
        })
        
        return res.status(200).json({ msg: newHistorico });
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}