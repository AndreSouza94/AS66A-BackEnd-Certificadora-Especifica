import * as authService from "../services/auth.service.js";


const singToken = (userId) => {
  return jwt.sing({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, cpf, password } = req.body;
    const Newuser = await authService.register({ name, email, cpf, password });
    res.status(201).json({
      status: "sucess",
      message: "Usuario registrado com sucesso",
      data: {
        user: Newuser,
      },
    });

    newUser.password = undefined;
  } catch (error) {
    console.error("Erro ao registrar usuario:", error);
    res.status(500).json({ message: "Erro ao registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    const token = singToken(user._id);

    user.password = undefined;

    res.status(200).json({
      status: "sucess",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
};
