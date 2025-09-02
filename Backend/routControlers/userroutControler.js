import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } = req.body;

    // Check if username OR email already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).send({
        success: false,
        message: "Username or Email already exists",
      });
    }

    // Hash password
    const hashPassword = bcryptjs.hashSync(password, 10);

    // Default profile pics
    const defaultPic =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: profilepic || defaultPic,
    });

    await newUser.save();

    // Generate JWT
    const token = jwtToken(newUser._id, res);

    res.status(201).send({
      success: true,
      token, // 👈 token also returned
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilepic: newUser.profilepic,
        email: newUser.email,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Email not registered" });
    }

    const isMatch = bcryptjs.compareSync(password, user.password || "");
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwtToken(user._id, res);

    res.status(200).send({
      success: true,
      token, // 👈 token also returned
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        profilepic: user.profilepic,
        email: user.email,
      },
      message: "Successfully logged in",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export const userLogOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { 
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    res.status(200).send({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};
