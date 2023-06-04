const nodeMailer = require('nodemailer');
const { error } = require('winston');

const sendMail = async (mailoption) => {
  console.log("Hello email");
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 2525,
    // secure : false,
    auth: {
      user: 'www.chandramoulichandru9741@gmail.com',
      pass: 'lwaaswyvwnnjimnl',
    },
  });
  const options = {
    from: 'www.chandramoulichandru9741@gmail.com',
    to: mailoption.email,
    subject: mailoption.subject,
    text: mailoption.message,
  };

  await transporter.sendMail(options, (error, info) => {
    if(error){
      console.log(error);
    }
    console.log(info);
  });
};
module.exports = sendMail;
