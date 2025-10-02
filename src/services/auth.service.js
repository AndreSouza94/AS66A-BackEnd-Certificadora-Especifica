import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

export const register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      message: "Usuário registrado com sucesso!",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email ou CPF já cadastrado." });
    }
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);
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
    res.status(401).json({ message: error.message });
  }
};