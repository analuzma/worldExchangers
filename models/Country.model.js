const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const countrySchema = new Schema(
  {
    name: {type: Object},
    cca3: {type: String},
    capital: {type: Array},
    region: {type:String},
    subregion: {type:String},
    timezones: {type:Object},
    continents: {type:Object},
    flags: {type:Object},
    population: {type:String},
    _students: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    _organizations: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }]
  },
    {
    timestamps: true
    }
);

const Country = model("Country", countrySchema);

module.exports = Country;
