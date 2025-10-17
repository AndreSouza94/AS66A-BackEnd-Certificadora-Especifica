export const getPasswordResetHTML = (resetURL) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
        <h2 style="color: #0056b3;">Recuperação de Senha</h2>
      </div>
      <div style="padding: 20px;">
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você não fez esta solicitação, pode ignorar este e-mail com segurança.</p>
        <p>Para criar uma nova senha, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" target="_blank" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Redefinir Senha</a>
        </div>
        <p>Este link de redefinição de senha é válido por <strong>10 minutos</strong>.</p>
        <p>Se você tiver qualquer dificuldade, copie e cole a seguinte URL no seu navegador:</p>
        <p style="word-break: break-all; font-size: 12px;"><a href="${resetURL}" target="_blank">${resetURL}</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Atenciosamente,<br>TAX SIM</p>
      </div>
    </div>
  `;
};