import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/auth.service.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, cpf, password } = req.body;
    const newUser = await registerUser({ name, email, cpf, password });

    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      message: "Usuário registrado com sucesso",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email ou CPF já cadastrado." });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    const token = signToken(user._id);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    if (error.message.includes("Credenciais inválidas")) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};

