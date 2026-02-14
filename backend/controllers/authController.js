const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

  
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const user = new User({
      name,
      email,
      password,
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

module.exports = { signup };

