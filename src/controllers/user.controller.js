import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import dotenv from "dotenv";
import { check, validationResult } from "express-validator";

const register = async (req, res) => {
  const { name, email, cpf, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name, email, cpf, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "usuario registrado" });
  } catch (error) {
    console.error("Erro ao registrar usuario:", error);
    res.status(500).json({ message: "Erro ao registrar usuario" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: "Credenciais invalidas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token }); ktu
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};
dotenv.config();

export { register, login };