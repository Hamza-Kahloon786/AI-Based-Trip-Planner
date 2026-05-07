import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "zakibashir649@gmail.com",
    pass: "dyyi spxw zhkd kzqn",
  },
});

export  function sendMail(to,subject,text){
    return transporter.sendMail({
        from: '"Zaki Bashir" <zakibashir649@gmail.com>',
        to: to,
        subject: subject,
        text: text,
    })
}

