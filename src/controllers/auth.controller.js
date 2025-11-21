import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.models.js';
import { registerUser, loginUser } from '../services/auth.service.js';
import sendEmail from '../utils/email.js';
import { getPasswordResetHTML } from '../utils/emailTemplate.js';
import logger from '../config/log/logger.js';

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

    logger.info(`Novo usuário registrado: ${email} (CPF: ${cpf})`, { ip: req.ip });

    res.status(201).json({
      status: 'success',
      message: 'Usuário registrado com sucesso',
      data: { user: newUser },
    });
  } catch (error) {
    logger.error('Erro ao registrar usuário: %s', error.message, { ip: req.ip });
    if (error.code === 11000) {
      logger.warn(`Tentativa de registro com e-mail/CPF duplicado: ${req.body.email} / ${req.body.cpf}`, { ip: req.ip });
      return res.status(409).json({ message: 'Email ou CPF já cadastrado.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    const token = signToken(user._id);
    user.password = undefined;

    logger.info(`Login bem-sucedido para o usuário: ${email}`, { ip: req.ip });

    res.status(200).json({
      status: 'success',
      token,
      data: { user },
    });
  } catch (error) {
    if (error.message.includes('Credenciais inválidas')) {
      logger.warn(`Tentativa de login falhou (credenciais inválidas) para o e-mail: ${req.body.email}`, { ip: req.ip });
      return res.status(401).json({ message: error.message });
    }

    logger.error('Erro inesperado ao fazer login para %s: %o', req.body.email, error, { ip: req.ip });

    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

export const forgotPassword = async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      logger.warn(`Tentativa de recuperação de senha para e-mail não cadastrado: ${req.body.email}`, { ip: req.ip });
      return res.status(404).json({ message: 'Não há usuário com este e-mail.' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `https://andresouza94.github.io/AS66A-Front-End-Certificadora-Especifica/Projeto/redefinir-senha.html/${resetToken}`;
    const html = getPasswordResetHTML(resetURL);

    await sendEmail({
      email: user.email,
      subject: 'Recuperação de Senha da Sua Aplicação',
      html,
    });

    logger.info(`E-mail de recuperação de senha enviado para: ${user.email}`, { ip: req.ip });
    res.status(200).json({ status: 'success', message: 'Token de recuperação enviado para o e-mail!' });
  } catch (error) {
    logger.error("Falha ao enviar e-mail de recuperação para %s: %s", req.body.email, error.message, { ip: req.ip });
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: 'Houve um erro ao enviar o e-mail. Tente novamente mais tarde.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn(`Tentativa de reset de senha com token inválido ou expirado. Token: ${req.params.token}`, { ip: req.ip });
      return res.status(400).json({ message: 'Token é inválido ou já expirou.' });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    logger.info(`Senha redefinida com sucesso para o usuário: ${user.email}`, { ip: req.ip });

    res.status(200).json({ status: 'success', token });
  } catch (error) {
    logger.error('Erro ao redefinir a senha: %s', error.message, { ip: req.ip });
    res.status(500).json({ message: 'Erro ao redefinir a senha.' });
  }
};