import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    birthdate: {
        type: Date
    },
    url_profile: {
        type: String
    },
    adress: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);