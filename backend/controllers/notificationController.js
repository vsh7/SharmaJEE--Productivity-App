const User = require("../models/User");

const registerToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Push token is required" });
        }

        await User.findByIdAndUpdate(req.user.id, { expoPushToken: token });
        return res.status(200).json({ message: "Push token registered" });
    } catch (error) {
        console.error("Error registering push token:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerToken };
