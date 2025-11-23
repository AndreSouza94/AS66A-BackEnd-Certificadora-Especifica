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
            impostoIOF_Taxa = 0.0, 
            msDiferenca = dataFinal - dataInicial
        
        let tempoDias = msDiferenca / (1000 * 60 * 60 * 24);
        if (tempoDias < 1) {
            tempoDias = 1;
        }

        let meses = Math.floor(tempoDias / 30);

        // Fórmula de Juros compostos, verificando o aporte
        const monthlySeries = [];
        let totalCapitalAportado = valorInicial;
        if (aporte > 0) {
            totalCapitalAportado += (aporte * meses);
        } 
        
         if (aporte === 0) {
            
            resultado = valorInicial * Math.pow(1 + rentabilidade / 100, tempoDias / 365);
            
            const fatorCapitalizacaoMensal = Math.pow(1 + rentabilidade / 100, 1 / 12); 
            let saldo = valorInicial;
            
            monthlySeries.push({ periodo: 0, saldo: valorInicial, aportado: valorInicial });

            for (let i = 1; i <= meses; i++) {
                saldo *= fatorCapitalizacaoMensal;
                
                monthlySeries.push({
                    periodo: i,
                    saldo: saldo,
                    aportado: valorInicial 
                });
            }
            
            if (monthlySeries.length > 0) {
                monthlySeries[monthlySeries.length - 1].saldo = resultado;
                monthlySeries[monthlySeries.length - 1].periodo = meses; 
            }


        } else {
            let saldo = valorInicial;
            const fatorCapitalizacaoMensal = Math.pow(1 + rentabilidade / 100, 1 / 12); 
            let totalAportadoAtual = valorInicial;

            monthlySeries.push({ periodo: 0, saldo: valorInicial, aportado: valorInicial });

            for (let i = 1; i <= meses; i++) {
                saldo *= fatorCapitalizacaoMensal;  
                saldo += aporte;
                totalAportadoAtual += aporte;

                monthlySeries.push({
                    periodo: i,
                    saldo: saldo,
                    aportado: totalAportadoAtual
                });
            }
            resultado = saldo; 
        }

        if(tempoDias <= 30) {
            if (tipo === "cdb" || tipo === "tesouro") {
                impostoIOF_Taxa = Math.trunc((tempoDias * 30) - ((tempoDias / 3) - 1) * 100) / 100;
            }
        }

        if(tipo === "lci" || tipo === "lca") {
            impostoRenda = 0.0; 
        } else {
            if(tempoDias <= 180) {
                impostoRenda = 0.225;
            } else if(tempoDias <= 360) {
                impostoRenda = 0.200;
            } else if(tempoDias <= 720) {
                impostoRenda = 0.175;
            } else {
                impostoRenda = 0.150;
            }  
        }
        
        const rendimentoBruto = resultado - totalCapitalAportado;       
        const valorImpostoIR = rendimentoBruto * impostoRenda;     
        const valorImpostoIOF = rendimentoBruto * Number(impostoIOF_Taxa) || 0;
        const impostosTotais = valorImpostoIOF + valorImpostoIR;
        const lucroLiquido = resultado - impostosTotais;          

        const resultadoSimulacao = {
            usuarioId: userId,
            tipo,
            valorInicial,
            valorAporte: aporte,
            tempoDias,
            rentabilidade,
            rendimentoBruto: Number(rendimentoBruto.toFixed(2)),
            rendimentoAporte: aporte * meses,
            impostoIOF: Number(valorImpostoIOF.toFixed(2)),
            impostoRenda: Number(valorImpostoIR.toFixed(2)),
            lucroLiquido: Number(lucroLiquido.toFixed(2)),
            totalCapitalAportado: Number(totalCapitalAportado.toFixed(2)),
            monthlySeries,
        }
        
        if(salvarHistorico === 'sim') {
            const newHistorico = await HistoricoModel.create({
                ...resultadoSimulacao
            })
            return res.status(200).json({msg: newHistorico})
        }
        return res.status(200).json({ msg: resultadoSimulacao }); 
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