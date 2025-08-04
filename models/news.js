
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// News/Updates Schema
const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    relatedAnime: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Anime"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [{
        type: String
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const News = mongoose.model("Anime_News", NewsSchema);

module.exports = News;