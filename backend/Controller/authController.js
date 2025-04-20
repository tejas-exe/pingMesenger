const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create a new user instance
    user = new User({
      username,
      email,
      password,
      profilePic: `https://avatar.iran.liara.run/public?username=${username}`,
    });
    // Save the user to the database
    const createdUser = await user.save();
    const token = await user.getToken();
    await res.cookie("token", token);
    res.status(201).json({
      message: "User created successfully",
      user: {
        username: createdUser.username,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.log("errorerror", error);

    res.status(500).json({ message: "Server error", error });
  }
};

// Login User (Authenticate)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // If password is correct, generate a JWT token (optional)
    const token = await user.getToken();
    await res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a list of all users or a single user by ID
exports.getUserByUsername = async (req, res) => {
  try {
    const { userName } = req.query;
    const currentUserId = req.user.id; // Get the logged-in user's ID

    if (userName) {
      const users = await User.find({
        username: { $regex: userName, $options: "i" },
        _id: { $ne: currentUserId }, // Exclude the current user by ID
      })
        .select("-password")
        .select("-createdAt")
        .select("-isActive");

      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      return res.status(200).json(users);
    }

    const allUsers = await User.find({
      _id: { $ne: currentUserId }, // Exclude the current user by ID
    })
      .select("-password")
      .select("-createdAt")
      .select("-isActive");

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user details by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    // Find the user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user fields (check if they are provided)
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      // If the password is provided, hash it before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    // Save the updated user
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const { _id, username, email, profilePic } = req.user;
    const myDetails = { _id, username, email, profilePic };
    return res.status(200).json(myDetails);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

