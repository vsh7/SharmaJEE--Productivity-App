const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

  
    const userExists = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const user = new User({
      name,
      email,
      password : hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // here we are checking if the user exits on not
    const user = await User.findOne({ email });
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({ message: "Invalid password" });
}

    // password checking
    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // after email and password both exists we check if it is correct or not
    return res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
   
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { signup ,login};

