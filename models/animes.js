const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Anime Schema
const AnimeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    originalTitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    posterImage: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    status: {
        type: String,
        enum: ["ongoing", "completed", "upcoming", "hiatus"],
        required: true
    },
    popularity: {
        type: String,
        enum: ["trending", "popular", "regular", "niche"],
        default: "regular"
    },
    genres: [{
        type: String,
        enum: ["shonen", "seinen", "shoujo", "josei", "isekai", "fantasy", "sci-fi",
            "romance", "comedy", "drama", "horror", "mystery", "sports", "mecha",
            "slice of life", "adventure", "action", "psychological", "supernatural"]
    }],
    type: {
        type: String,
        enum: ["TV", "Movie", "OVA", "ONA", "Special"],
        default: "TV"
    },
    seasons: [{
        seasonName: {
            type: String,
            required: true
        },
        driveLinks: [{
            type: String
        }]
    }],
    studios: [{
        type: String
    }],
    sourceMaterial: {
        type: String,
        enum: ["manga", "light novel", "original", "visual novel", "game", "other"],
        default: "original"
    },
    durationPerEpisode: {
        type: Number
    },
    ageRating: {
        type: String,
        enum: ["G", "PG", "PG-13", "R", "R+", "Rx"],
        default: "PG-13"
    },
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }],
    relatedAnime: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        userName: {
            type: String,
        },
        email: {
            type: String,
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
AnimeSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Update average rating when new ratings are added
AnimeSchema.methods.updateRating = function (newRating) {
    const totalRatings = this.rating.count;
    const currentAverage = this.rating.average;

    this.rating.average = ((currentAverage * totalRatings) + newRating) / (totalRatings + 1);
    this.rating.count += 1;

    return this.save();
};

const Anime = mongoose.model("Anime_Anime", AnimeSchema);

module.exports = Anime;