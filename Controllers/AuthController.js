const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../Models/UserModel');
const nodemailer = require('nodemailer');
const email = process.env.EMAIL
const password = process.env.PASSWORD
exports.register = async (req, res) => {
  try {
    const found = await user.findOne({ Email: req.body.Email })
    if (found) {
      res.status(400).send({ message: 'email already exist' })
    }
    else {
      const salt = bcrypt.genSaltSync(10);
      req.body.Password = bcrypt.hashSync(req.body.Password, salt);
      await user.create(req.body)

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });

      const mailOptions = {
        from: email,
        to: req.body.Email,
        subject: 'Création de compte avec succes',
        html: `
        <p>Bonjour , <br/> vous avez reussi a creer votre compte , vous pouvez connecter a tout moment avec votre email et mot de passe que vous avez choisis <br/> Au revoir et merci pour votre confiance </p>
      `,
      };

      await transporter.sendMail(mailOptions);
      res.status(201).send({ message: 'account created succesfully' })
    }
  } catch (error) {
    res.status(500).send({ message: 'error serveur' || error })
  }
}
exports.login = async (req, res) => {
  try {
    const found = await user.findOne({ Email: req.body.Email })

    if (found) {
      const valid = bcrypt.compareSync(req.body.Password, found.Password)
      if (valid) {
        const data = {
          username: found.Name,
          useremail: found.Email,
          userId: found._id
        }
        const token = jwt.sign(data, process.env.JWTSECRET, { expiresIn: "1d" });
        res.status(200).send({ message: 'connected successfully', token })
      }
      else {
        res.status(400).send({ message: 'verify password' })
      }
    }
    else {
      res.status(400).send({ message: 'verify email and password' })
    }
  } catch (error) {
    res.status(500).send({ message: 'erreur serveur' || error })
  }
}
exports.forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const User = await user.findOne({ Email });
    if (!User) {
      return res.status(400).send({ message: 'User not found' });
    } else {
      const token = jwt.sign({ userId: User._id }, process.env.JWTSECRET, { expiresIn: '15m' });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email,
          pass: password,
        },
      });

      const mailOptions = {
        from: email,
        to: Email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
        <p>Bonjour , pour renitialisez votre mot de passe SVP Cliquez sur le lien ci-dessous :</p>
        <a  href="http://localhost:3000/demo8/auth-reset">Réinitialiser votre mot de passe</a>
        <p> vous avez besoin d utiliser cet code : </p>
       
        <hr>
        <p style='color:red;'>
        ${token} 
        </p>
        <hr>
       
        <p>Au revoir et merci pour votre confiance </p>
      `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).send({ message: 'Password reset link sent to your email' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.resetPassword = async (req, res) => {
  const { NewPassword } = req.body;
  const { Code } = req.body

  try {

    const decoded = jwt.verify(Code, process.env.JWTSECRET)
    const userfound = await user.findById(decoded.userId)
    if (!userfound) {
      return res.status(404).send({ message: 'User not found' });
    }

    await user.findByIdAndUpdate(userfound._id, { Password: NewPassword })
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    const mailOptions = {
      from: email,
      to: userfound.Email,
      subject: 'succés de renitialisation',
      html: `
      <p>Bonjour , vous avez renitialisez votre mot de passe avec succes 
      
      Au revoir et merci pour votre confiance </p>
    `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {

    res.status(400).send({ message: 'Invalid token' });
  }
}
// exports.LogOut = async (req, res) => {
//   try {

//     res.clearCookie('auth_token');

//     res.status(200).json({ message: 'User successfully logged out' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }