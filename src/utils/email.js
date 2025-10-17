import sgMail from '@sendgrid/mail';

const sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const senderEmail = process.env.SENDGRID_VERIFIED_SENDER;

  if (!senderEmail) {
    console.error("ERRO CRÍTICO: A variável de ambiente SENDGRID_VERIFIED_SENDER não foi encontrada. Verifique seu arquivo .env e reinicie o servidor.");
    throw new Error("O e-mail do remetente não está configurado no servidor.");
  }

  const msg = {
    to: options.email,
    from: senderEmail,
    subject: options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ E-mail enviado com sucesso via SendGrid!');
  } catch (error) {
    console.error('--- ERRO DETALHADO DO SENDGRID ---');
    console.error('Mensagem:', error.message);
    if (error.response) {
      console.error('Corpo da Resposta:', JSON.stringify(error.response.body, null, 2));
    }
    console.error('--- FIM DO ERRO ---');
    throw error;
  }
};

export default sendEmail;