import mongoose from "mongoose";

const historicoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: [true, 'O tipo de investimento é obrigatório.'],
    },
    valorInicial: {
        type: Number,
        required: [true, 'Insira um valor inicial.']
    },
    tempoAnos: {
        type: Number,
        required: [true, 'Digite o tempo de investimento.']
    },
    rentabilidade: {
        type: Number,
        required: [true, 'Insira a taxa anual.']
    }, 
    valorFinal: {
        type: Number
    },  
    lucroLiquido: {
        type: Number
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
});

const Historico = mongoose.model('Historico', historicoSchema)

export default Historico;