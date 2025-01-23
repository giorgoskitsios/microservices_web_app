import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  submitId: string;
  userId: string;
  name: string;
  price: number;
  locations: {
    latitude: number;
    longitude: number;
  }[];
  numVehicles: number;
  depot: number;
  maxDistance: number;
}

const ProblemSchema: Schema = new Schema(
  {
    submitId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
        type: String,
        required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    locations: [
      {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    ],
    numVehicles: {
      type: Number,
      required: true,
      min: 1,
    },
    depot: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDistance: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);

export default Problem;
