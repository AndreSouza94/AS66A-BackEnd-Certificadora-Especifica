import User from '../models/user.model.js';

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw new Error('Nome, email e senha são obrigatórios.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Este email já está em uso.');
  }

  const newUser = await User.create({ name, email, password });
  return newUser;
};

export const loginUser = async (loginData) => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios.');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Email ou senha incorretos.');
  }

  return user;
};