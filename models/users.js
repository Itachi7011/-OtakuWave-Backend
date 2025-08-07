const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "default-avatar.jpg"
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    role: {
        type: String,
        enum: ["user", "moderator", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime"
    }],
    watchHistory: [{
        anime: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Anime"
        },
        season: Number,
        episode: Number,
        watchedAt: {
            type: Date,
            default: Date.now
        }
    }],
    tokens: {
        type: String
    }
});

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
            expiresIn: "30d",
        });
        this.tokens = token;
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
};

const User = mongoose.model("Anime_User", UserSchema);

module.exports = User;