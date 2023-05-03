const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../Models/UserModel');
const nodemailer = require('nodemailer');
const Token = require('../../Models/Token');
const randomString = require('randomstring')
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



exports.forgetPassword = async (req, res) => {
  try {
    const found = await user.findOne({ email: req.body.email });
    if (found) {
      const token = await Token.findOne({ companyId: found._id });
      if (token) {
        await token.deleteOne()
      }
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      })
      const resetToken = randomString.generate(30)
      const createdToken = await new Token({
        userId: found._id,
        token: resetToken,
      }).save();
      const resetLink = 'http://localhost:3000/resetPassword/' + resetToken
      await transporter.sendMail({
        from: ' EMAIL@gmail.com',
        to: req.body.email,
        subject: `Reset password request for ${found.Nom} company`,
        html: `<h1>You requested to reset your password so here is your reset password link</h1>
                <p>${resetLink}</p>`
      })
      res.send({ message: 'Reset password mail sent successfully.', token: createdToken })
    } else {
      res.status(400).send({ message: 'Email not found, please enter a valid e-mail!' })
    }
  } catch (error) {
    res.status(500).json({ message: 'error server' })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token })
    if (token) {
      const diffDate = new Date() - token.createdAt;
      const diffSeconds = Math.floor(diffDate / 1000);
      if (diffSeconds < 3600) {
        const saltRounds = bcrypt.genSaltSync(10);
        bcrypt.hash(req.body.password, saltRounds, async (error, hash) => {
          if (error) {
            res.status(500).json({ message: 'Server Error' })
          } else {
            await Company.findByIdAndUpdate(token.companyId, { password: hash })
            res.send({ message: 'Password reset successfully!' });
          }
        })
        await Token.findByIdAndRemove(token._id)
      } else {
        await Token.findByIdAndRemove(token._id)
        res.status(400).send({ message: 'Token expired!' });
      }
    } else {
      res.status(400).send({ message: 'Invalid token!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'error server' })
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