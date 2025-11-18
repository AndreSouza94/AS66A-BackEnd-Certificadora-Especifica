import HistoricoModel from "../models/historico.models.js";

export const getCalculo = async (req, res) => {
    try {
        const userId = req.user.id;
        const historicoUsuario = await HistoricoModel.find({usuarioId: userId})

        return res.status(200).json({ msg: historicoUsuario});
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export const calcular = async (req, res) => {
    try {
        const {tipo, valorInicial, dataInicial, dataFinal, rentabilidade, aporte, salvarHistorico} = req.body;
        const userId = req.user.id;

        let resultado = 0.0,
            impostoRenda = 0.0, 
            impostoIOF = 0.0, 
            diferencaDias = dataFinal - dataInicial,
            meses = (diferencaDias / 30).toFixed(0)

            
        // Fórmula de Juros compostos, verificando o aporte
        if (aporte === 0) {

            resultado = valorInicial * Math.pow(1 + rentabilidade / 100, diferencaDias / 365);

        } else {

            let saldo = valorInicial;
            const taxaMensal = Math.pow(1 + rentabilidade / 100, 1 / 12); 

            for (let i = 1; i <= meses; i++) {
                saldo = saldo * taxaMensal;  
                saldo += aporte;             
            }

            resultado = saldo;
        }

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

        const resultdoSimulacao = {
            usuarioId: userId,
            tipo,
            valorInicial,
            valorAporte: aporte,
            tempoDias: diferencaDias,
            rentabilidade,
            rendimentoBruto: Number(rendimentoBruto.toFixed(2)),
            rendimentoAporte: aporte * meses,
            impostoIOF: Number(valorImpostoIOF.toFixed(2)),
            impostoRenda: Number(valorImpostoIR.toFixed(2)),
            lucroLiquido: Number(lucroLiquido.toFixed(2)),
        }

        if(salvarHistorico === 'sim') {
            const newHistorico = await HistoricoModel.create({
                ...resultdoSimulacao
            })
            return res.status(200).json({msg: newHistorico})
        }
        
        return res.status(200).json({ msg: resultdoSimulacao });
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

export const deleteHistorico = async (req, res) => {
    const {idHistorico, deletarTudo} = req.body;
    const userId = req.user.id;

    try {

         if(deletarTudo === "sim") {
            await HistoricoModel.deleteMany({usuarioId: userId})
            return res.status(200).json({msg: `Historico do usuário ${userId} deletado com sucesso`})
        }  

        const deletar = await HistoricoModel.deleteOne({_id: idHistorico, usuarioId: userId});

        if (deletar.deletedCount === 0) {
            return res.status(403).json({ msg: "Nada encontrado ou não pertence ao usuário" });
        }
        
        return res.status(200).json({msg: "Histórico excluído com sucesso!"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}