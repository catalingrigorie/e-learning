const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const CampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [1000, "Description can not be longer than 250 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      required: [true, "Please add an email address"],
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: [true, "Please select at least one relevant career"],
      enum: [
        "Robotics",
        "Mechatronics",
        "Artificial Vision",
        "Desktop Applications",
        "Programmable Logic Controller",
        "Web Development",
        "Mobile Development",
        "Machine Learning",
        "Data Analysis",
        "Artificial Intelligence",
        "Networking & Security",
        "Operating Systems",
        "Hardware",
        "Web Design",
        "Graphic Design",
      ],
    },
    enrolledUsers: {
      type: [{ email: String, name: String }],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating can not be more than 5"],
    },
    averageCost: Number,
    image: {
      type: String,
      default: "no-photo.jpg",
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CampSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

CampSchema.pre("save", async function (next) {
  if (this.address == "") {
    this.location = {
      formattedAddress: "Remote",
    };

    this.address = undefined;
    return;
  }

  const location = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].streetName,
    city: location[0].city,
    zipcode: location[0].zipcode,
    country: location[0].countryCode,
  };

  this.address = undefined;
  next();
});

/**
 * @description Cascade delete all courses asociated with a bootcamp that is being deleted
 */
CampSchema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({
    camp: this._id,
  });
  next();
});

CampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "camp",
  justOne: false,
});

module.exports = mongoose.model("Camp", CampSchema);
