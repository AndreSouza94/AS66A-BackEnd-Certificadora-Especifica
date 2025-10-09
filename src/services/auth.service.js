import User from "../models/user.models.js";

export const registerUser = async ({ name, email, cpf, password }) => {
  const newUser = new User({ name, email, cpf, password });
  await newUser.save();
  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  if (!user.password) {
    throw new Error("Usuário encontrado, mas senha não definida. Tente registrar novamente.");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Credenciais inválidas.");
  }

  user.password = undefined;

  return user;
};