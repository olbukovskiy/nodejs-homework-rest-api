const sgMail = require("@sendgrid/mail");

const generateAndSendToken = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: "olbukovskiy@meta.ua",
    subject: "Sending verification link",
    text: `Click here to verify your email http://localhost:3000/api/users/verify/${verificationToken}`,
    html: `<h1>Click <a href="http://localhost:3000/api/users/verify/${verificationToken}">Here</a> to verify your email</h1>`,
  };

  await sgMail.send(msg);
};

module.exports = generateAndSendToken;
