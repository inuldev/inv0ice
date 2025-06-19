import mongoose from "mongoose";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: Date | null;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    currency: {
      type: String,
      enum: ["IDR", "USD", "EUR", "GBP", "JPY"],
      default: "USD",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.user || mongoose.model<IUser>("user", userSchema);

export default UserModel;
