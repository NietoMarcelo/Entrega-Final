import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        required: true
    },
    service: [
        {
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
}, {
    timestamps: true
});

export const BookingModel = mongoose.model("Booking", bookingSchema);
