const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const os = require("os");
const moment = require("moment");
const si = require("systeminformation");
const exec = require("child_process").exec;
const shortid = require("shortid");
// const alert = require("electron-alert");
const multer = require("multer");
const bcryptjs = require("bcryptjs");
const cookieParser = require("cookie-parser");
const schedule = require("node-schedule");




// Load environment variables
dotenv.config();

// Create Express app
const app = express();

const PORT = process.env.PORT || 7000;

const CloudinaryDB = process.env.CLOUD_NAME;
const CloudinaryAPIKey = process.env.API_KEY;
const CloudinarySecret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: CloudinaryDB,
  api_key: CloudinaryAPIKey,
  api_secret: CloudinarySecret,
  secure: true,
});




// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));



require("./config/connection");


const UsersDB = require("./models/users");
const NewsDB = require("./models/news");
const AnimesDB = require("./models/animes");

const userAuthenticate = require("./authenticate/customerAuthenticate");


// Routes




// app.post("/api/newUserRegistration",NewUserRegistrationMulter, async (req, res) => {
//   console.log(req.body);
//   try {

//     const Name = req.body.fullname;
//     const Password = req.body.password;
//     const Cpassword = req.body.cpassword;
//     const Email = req.body.email;
//     const PhoneNo = Number(req.body.phoneNo);


//     // Already Used Emails

//     const UsedEmail = await UsersDB.findOne({ email: Email });

//     // Already Used Phone Numbers

//     const UsedPhoneNo = await UsersDB.findOne({
//       phoneNo: PhoneNo,
//     });

//     // Now acutal coding for registration
//     if (Password !== Cpassword) {
//       new alert("Sorry , Password And Confirm Password do not match!");
//       console.log("Sorry , Password And Confirm Password do not match!");
//       return res.status(400).json({ message: "Password And Confirm Password do not match." });
//     }

//     if (UsedEmail) {
//       new alert("Sorry , This Email Id is already registered!");
//       console.log("Sorry , This Email Id is already registered!");
//       return res.status(400).json({ message: "This Email Id is already registered." });
//     }
//     if (UsedPhoneNo) {

//       alert("Sorry Phone Number is already registered! \n Please use another Phone Number.");
//       console.log("Sorry, Phone Number is already registered! \n Please use another Phone Number!");

//       return res.status(400).json({ message: "Phone Number is already registered! Please use another Phone Number." });
//     }

//     function generateUniqueUsername(name) {
//       // Generate a random string of 6 characters (alphanumeric)
//       const randomString = crypto.randomBytes(3).toString('hex'); // 3 bytes -> 6 hex characters
//       return `${name}-${randomString}`;
//     }

//     const userName = generateUniqueUsername(Name);

//     // console.log(userName)

//     const OTP = Math.floor(Math.random() * 1000000 + 1);
//     const Transport = async (email, Subject, Text) => {
//       try {
//         const transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           service: "gmail",
//           port: 587,
//           secure: Boolean(true),
//           auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD,
//           },
//         });
//         await transporter.sendMail({
//           from: process.env.EMAIL,
//           to: Email,
//           subject: Subject,
//           text: Text,
//         });
//         console.log("Email sent successfully");

//       } catch (e) {
//         console.log("Error during sending email: ", e);
//       }
//       // Send OTP to phone number via SMS
//       try {
//         await twilioClient.messages.create({
//           body: `Your OTP is: ${OTP}`, // Message body
//           to: PhoneNo, // Phone number to send to
//           from: process.env.TWILIO_PHONE_NUMBER // Your Twilio phone number
//         });
//         console.log("SMS sent successfully");
//       } catch (error) {
//         console.log("Error sending SMS: ", error);
//       }

//     };


//     function getAge(dateString) {
//       var today = new Date();
//       var birthDate = new Date(dateString);
//       var age = today.getFullYear() - birthDate.getFullYear();
//       var m = today.getMonth() - birthDate.getMonth();
//       if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       return age;
//     }
//     const DateOfBirth = req.body.dateOfBirth;

//     // Date conversion to IST

//     const SubmittedDate = new Date();
//     // const DateOfJoining = req.body.dateOfJoining;

//     let options = {
//       year: "numeric",
//       month: "numeric",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//       hour12: true,
//     };
//     let intlDateObj = new Intl.DateTimeFormat("en-US", options, {
//       timeZone: "Asia/Kolkata",
//     });

//     //Form submission Date

//     let ConvertedFormSubmittedDate = intlDateObj.format(SubmittedDate);


//     await Transport(
//       "coolsam929@gmail.com",
//       "Please Use This OTP To Verify Your Insta-Hooks Account",
//       ` Your OTP is : ${OTP} `
//     );

//     const newUserdata = await new UsersDB({
//       fullname: req.body.fullname,
//       userName: userName,
//       userType: "User",
//       email: req.body.email,
//       phoneNo: req.body.phoneNo,
//       gender: req.body.gender,
//       country: req.body.country,
//       currency: req.body.currency,
//       emailVerification: false,
//       dateOfBirth: req.body.dateOfBirth,
//       age: getAge(DateOfBirth),
//       otp: OTP,
//       convertedDateOfFormSubmission: ConvertedFormSubmittedDate,
//       password: req.body.password,
//       dateOfFormSubmission: new Date(),
//     });


//     await newUserdata.save();

//     console.log("Saved in Database Successfully");
//     new alert(
//       `${Name} Registered Successfully! \n Please Login to Continue`
//     );

//     res.status(200).json({ message: "Registered Successfully! \n Please Login to Continue." });

//     // res.redirect("/EmployeeLogin");



//   } catch (err) {
//     console.log(` Error During Registering of New User --> ${err} `);
//   }
// }
// );

// Updated registration API endpoint





const uploadToCloudinaryUsers = async (file) => {
  try {
    console.log("upload starts");
    const result = await cloudinary.uploader.upload(file, {
      folder: "Instant_Hooks_User",
      resource_type: "auto",
    });
    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// const upload1 = multer({ storage: cloudinaryStorage });

const NewUserRegistrationMulter = multer({
  // storage: cloudinaryStorage, // Use memory storage for Cloudinary

  cloudinary: cloudinary,

  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error("Please upload an image (JPG, JPEG or PNG)."));
    }

    cb(null, true);
  },
}).fields([{ name: "userImage", minCount: 0, maxCount: 1 }]);

app.post("/api/newUserRegistration", NewUserRegistrationMulter, async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const gender = req.body.gender;
    const defaultAvatar = req.body.defaultAvatar;

    // Check for existing users
    const existingUser = await UsersDB.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "This email is already registered. Please use a different email or try logging in."
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({
          message: "This username is already taken. Please choose a different username."
        });
      }
    }

    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
      });
    }

    // Handle avatar upload or default avatar
    let avatarUrl = defaultAvatar;

    if (req.files && req.files.userImage && req.files.userImage[0]) {
      try {
        const uploadResult = await uploadToCloudinaryUsers(req.files.userImage[0].path);
        if (uploadResult && uploadResult.secure_url) {
          avatarUrl = uploadResult.secure_url;
        }
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        // Continue with default avatar if upload fails
      }
    }

    // Set default avatar based on gender if none provided
    if (!avatarUrl) {
      const defaultAvatars = {
        male: "https://cdn.pixabay.com/photo/2013/07/12/15/24/goaty-149860_960_720.png",
        female: "https://cdn.pixabay.com/photo/2023/03/31/05/52/avatar-7889246_960_720.jpg",
        other: "https://cdn.pixabay.com/photo/2023/03/31/05/52/avatar-7889246_960_720.jpg"
      };
      avatarUrl = defaultAvatars[gender] || defaultAvatars.other;
    }

    // Create new user
    const newUser = new UsersDB({
      username: username,
      email: email,
      gender: gender,
      password: password, // Will be hashed by the pre-save middleware
      avatar: avatarUrl,
      role: "user",
      isVerified: false,
      joinDate: new Date(),
      lastLogin: null,
      favorites: [],
      watchHistory: [],
      tokens: ""
    });

    await newUser.save();

    // Generate auth token
    const token = await newUser.generateAuthToken();

    console.log("User registered successfully:", username);

    res.status(201).json({
      message: "Registration successful! Welcome to Otaku Wave!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        joinDate: newUser.joinDate,
        role: newUser.role,
        isVerified: newUser.isVerified
      },
      token: token
    });

  } catch (err) {
    console.error("Registration error:", err);

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `This ${field} is already registered. Please use a different ${field}.`
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        message: messages.join('. ')
      });
    }

    res.status(500).json({
      message: "Internal server error. Please try again later."
    });
  }
});

// Additional API endpoints for user management

// Get user profile
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const user = await UsersDB.findById(req.user._id)
      .select('-password -tokens')
      .populate('favorites', 'title poster rating')
      .populate('watchHistory.anime', 'title poster');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user profile
app.put("/api/user/profile", authenticateToken, NewUserRegistrationMulter, async (req, res) => {
  try {
    const updates = {};
    const allowedUpdates = ['username', 'email'];

    // Check which fields are being updated
    allowedUpdates.forEach(field => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    // Handle avatar update
    if (req.files && req.files.userImage && req.files.userImage[0]) {
      try {
        const uploadResult = await uploadToCloudinaryUsers(req.files.userImage[0].path);
        if (uploadResult && uploadResult.secure_url) {
          updates.avatar = uploadResult.secure_url;
        }
      } catch (uploadError) {
        console.error("Avatar update error:", uploadError);
      }
    } else if (req.body.defaultAvatar) {
      updates.avatar = req.body.defaultAvatar;
    }

    const user = await UsersDB.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -tokens');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: user
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `This ${field} is already taken by another usersDB.`
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user account
app.delete("/api/user/account", authenticateToken, async (req, res) => {
  try {
    const user = await UsersDB.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware for token authentication
async function authenticateToken(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UsersDB.findOne({ _id: decoded._id, tokens: token });

    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid token." });
  }
}

app.get("/api/animeList", async (req, res) => {
  try {
    const animeList = await AnimesDB.find();
    res.status(200).json(animeList);

  } catch (error) {
    console.error("Error fetching anime list:", error);
    res.status(500).json({ message: "Failed to fetch anime list" });
  }
});

// Get single anime by ID
app.get("/api/anime/:id", async (req, res) => {
  try {
    const anime = await AnimesDB.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.status(200).json(anime);
  } catch (error) {
    console.error("Error fetching anime:", error);
    res.status(500).json({ message: "Failed to fetch anime" });
  }
});


const validateAnimeData = (req, res, next) => {
  const requiredFields = ['title', 'description', 'posterImage', 'status'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  if (req.body.seasons) {
    for (const season of req.body.seasons) {
      if (!season.seasonName) {
        return res.status(400).json({
          message: "Each season must have a seasonName"
        });
      }
      if (season.driveLinks && season.driveLinks.some(link => !link)) {
        return res.status(400).json({
          message: "Drive links cannot be empty"
        });
      }
    }
  }

  next();
};


// Add new animesDB
app.post("/api/addAnime", validateAnimeData, userAuthenticate, async (req, res) => {
  try {
    const {
      title,
      originalTitle,
      description,
      posterImage,
      coverImage,
      status,
      popularity,
      genres,
      type,
      seasons,
      studios,
      sourceMaterial,
      durationPerEpisode,
      ageRating,
      relatedAnime,

    } = req.body;

    console.log(req.body)

    // Convert studios string to array if needed
    const studiosArray = typeof studios === 'string'
      ? studios.split(',').map(s => s.trim())
      : studios;

    const relatedAnimeArray = typeof studios === 'string'
      ? relatedAnime.split(',').map(s => s.trim())
      : relatedAnime;

    const newAnime = new AnimesDB({
      title,
      originalTitle,
      description,
      posterImage,
      coverImage,
      status,
      popularity,
      genres,
      type,
      seasons,
      studios: studiosArray,
      sourceMaterial,
      durationPerEpisode,
      ageRating,
      relatedAnime: relatedAnimeArray,
      createdBy: {
        userName: req.rootUser.username,
        email: req.rootUser.email
      },
    });

    const savedAnime = await newAnime.save();
    res.status(201).json(savedAnime);
  } catch (error) {
    console.error("Error adding anime:", error);
    res.status(500).json({ message: "Failed to add anime" });
  }
});

// Update anime
app.put("/api/updateAnime/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert studios string to array if needed
    if (updateData.studios && typeof updateData.studios === 'string') {
      updateData.studios = updateData.studios.split(',').map(s => s.trim());
    }

    const updatedAnime = await AnimesDB.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedAnime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    res.status(200).json(updatedAnime);
  } catch (error) {
    console.error("Error updating anime:", error);
    res.status(500).json({ message: "Failed to update anime" });
  }
});

// Delete anime
app.delete("/api/deleteAnime/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnime = await AnimesDB.findByIdAndDelete(id);

    if (!deletedAnime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    res.status(200).json({ message: "Anime deleted successfully" });
  } catch (error) {
    console.error("Error deleting anime:", error);
    res.status(500).json({ message: "Failed to delete anime" });
  }
});



app.post("/api/userLogin", async (req, res) => {

  let token;
  const Email = req.body.userEmail;
  const Password = req.body.userPassword;

  // FindOne Funtion For all of the scales database

  const data1 = await UsersDB.findOne({
    email: Email,
  });
  // io.emit("statusChanged", { userId: data1._id, status: "online" });

  if (data1) {
    const isMatch = await bcryptjs.compare(Password, data1.password);

    if (isMatch === false) {
      console.log("Login Failed");

      return res.status(400).json({ message: `Sorry Either Username Or Password is Incorrect,` });
    }
    if (isMatch === true) {
      const token = await data1.generateAuthToken();
      await UsersDB.updateOne({ _id: data1._id }, { status: "online", lastLogin: new Date() });

      res.cookie("cookies1", token, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
      });
      console.log("Login Successful");

      // new alert( ` Welcom ${Email} on Instant Hooks`);
      res.status(200).json({
        success: true,
        token,
        user: {
          _id: data1._id,
          email: data1.email,
          username: data1.username
        }
      });

    } else {
      res.send("Sorry!");
    }
  }
});

app.get("/api/logout", userAuthenticate, async (req, res) => {

  try {

    res.clearCookie("cookies1", { path: "/" }); // Ensure the path matches
    console.log("id is : ", req.rootUser._id)

    await UsersDB.updateOne({ _id: req.rootUser._id }, { status: "logout" });
    // io.emit("statusChanged", { userId: req.rootUser._id, status: "logout" });
    console.log("Logout Successful");


    res.status(200).send({ message: "Logout Successful" });

  } catch (err) {

    console.log(`Error During Logout - ${err}`);

    res.status(500).send("Error during logout");

  }

});

app.get("/api/userProfile", userAuthenticate, async (req, res) => {
  try {
    res.send(req.rootUser);
    // console.log(req.rootUser)
  } catch (err) {
    console.log(`Error during Employeee Profile Page -${err}`);
  }
});


app.put("/api/updateProfile", userAuthenticate, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const userId = req.userId;

    // Validation
    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    // Check if username or email already exists (excluding current user)
    const existingUser = await UsersDB.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ username }, { email }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.username === username
          ? "Username already exists"
          : "Email already exists"
      });
    }

    // Update user
    const updatedUser = await UsersDB.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        avatar: avatar || "default-avatar.jpg"
      },
      { new: true, runValidators: true }
    ).select('-password -tokens');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});



// Add to Favorites
app.post("/api/addFavorite", userAuthenticate, async (req, res) => {
  try {
    const { animeId } = req.body;
    const userId = req.userId;

    if (!animeId) {
      return res.status(400).json({ message: "Anime ID is required" });
    }

    const user = await UsersDB.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if anime is already in favorites
    if (user.favorites.includes(animeId)) {
      return res.status(400).json({ message: "Anime already in favorites" });
    }

    // Add to favorites
    user.favorites.push(animeId);
    await usersDB.save();

    res.status(200).json({ message: "Added to favorites successfully" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from Favorites
app.delete("/api/removeFavorite", userAuthenticate, async (req, res) => {
  try {
    const { animeId } = req.body;
    const userId = req.userId;

    if (!animeId) {
      return res.status(400).json({ message: "Anime ID is required" });
    }

    const user = await UsersDB.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== animeId);
    await usersDB.save();

    res.status(200).json({ message: "Removed from favorites successfully" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to Watch History
app.post("/api/addWatchHistory", userAuthenticate, async (req, res) => {
  try {
    const { animeId, season, episode } = req.body;
    const userId = req.userId;

    if (!animeId || !season || !episode) {
      return res.status(400).json({
        message: "Anime ID, season, and episode are required"
      });
    }

    const user = await UsersDB.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if this episode is already in watch history
    const existingEntry = user.watchHistory.find(
      entry => entry.anime.toString() === animeId &&
        entry.season === season &&
        entry.episode === episode
    );

    if (existingEntry) {
      // Update watch time
      existingEntry.watchedAt = new Date();
    } else {
      // Add new entry
      user.watchHistory.push({
        anime: animeId,
        season: parseInt(season),
        episode: parseInt(episode),
        watchedAt: new Date()
      });
    }

    // Keep only last 100 entries (optional)
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory
        .sort((a, b) => b.watchedAt - a.watchedAt)
        .slice(0, 100);
    }

    await usersDB.save();

    res.status(200).json({ message: "Watch history updated successfully" });
  } catch (error) {
    console.error("Error adding to watch history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Clear Watch History
app.delete("/api/clearWatchHistory", userAuthenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UsersDB.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchHistory = [];
    await usersDB.save();

    res.status(200).json({ message: "Watch history cleared successfully" });
  } catch (error) {
    console.error("Error clearing watch history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Last Login (call this when user logs in)
app.put("/api/updateLastLogin", userAuthenticate, async (req, res) => {
  try {
    const userId = req.userId;

    await UsersDB.findByIdAndUpdate(userId, {
      lastLogin: new Date()
    });

    res.status(200).json({ message: "Last login updated" });
  } catch (error) {
    console.error("Error updating last login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Statistics (optional - for dashboard)
app.get("/api/userStats", userAuthenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UsersDB.findById(userId)
      .populate('favorites')
      .populate('watchHistory.anime');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate statistics
    const stats = {
      totalFavorites: user.favorites.length,
      totalWatched: user.watchHistory.length,
      uniqueAnimeWatched: [...new Set(user.watchHistory.map(h => h.anime._id.toString()))].length,
      joinedDaysAgo: Math.floor((new Date() - user.joinDate) / (1000 * 60 * 60 * 24)),
      lastLoginDaysAgo: user.lastLogin
        ? Math.floor((new Date() - user.lastLogin) / (1000 * 60 * 60 * 24))
        : null,
      mostWatchedGenres: [], // You can implement this based on your anime model
      watchingStreak: 0 // You can implement this based on watch history dates
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));