const { createHmac, randomBytes } = require("crypto"); //importing crypto module
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const UserSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/download.png",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!this.isModified("password")) return;

  const salt = randomBytes(15).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});


UserSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const hashedGivenPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== hashedGivenPassword) {
      throw new Error("Incorrect Password");
    }
    const token = createTokenForUser(user);
    console.log("Generated token:", token); // Check if this logs a valid token
    return token;
  }
);

const User = model("User", UserSchema);

module.exports = User;
