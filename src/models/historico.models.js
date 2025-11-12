import mongoose from "mongoose";

const historicoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tipo: {
        type: String,
    },
    valorInicial: {
        type: Number,
    },
    tempoDias: {
        type: Number,
    },
    rentabilidade: {
        type: Number,
    }, 
    rendimentoBruto: {
        type: Number
    },  
    impostoIOF: {
        type: Number
    },
    impostoRenda: {
        type: Number
    },
    lucroLiquido: {
        type: Number
    },
}, {
    timestamps: true,
});

const Historico = mongoose.model('Historico', historicoSchema)

export default Historico;