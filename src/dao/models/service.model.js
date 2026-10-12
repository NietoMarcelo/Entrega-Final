import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

export const ServiceModel = mongoose.model("Service", serviceSchema);