import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome é obrigatório."],
  },
  email: {
    type: String,
    required: [true, "O email é obrigatório."],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Por favor, use um email válido.'],
  },
  cpf: {
    type: String,
    required: [true, "O CPF é obrigatório."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A senha é obrigatória."],
    select: false,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;