import mongoose, { Document, Schema } from 'mongoose';

export interface ISolution extends Document {
  submitId: string;
  userId: string;
  hasSolution: boolean;
  solution: {
    objective: string;
    maxDistance: number;
    vehicles: {
      plan: number[];
      dist: number;
    }[];
  };
  duration: number;
}

const SolutionSchema: Schema = new Schema(
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
    hasSolution: {
      type: Boolean,
      required: true,
    },
    solution: {
      objective: {
        type: String,
        required: function (this: ISolution): boolean {
          return this.hasSolution;
        },
      },
      maxDistance: {
        type: Number,
        required: function (this: ISolution): boolean {
          return this.hasSolution;
        },
      },
      vehicles: [
        {
          plan: [
            {
              type: Number,
              required: function (this: ISolution): boolean {
                return this.hasSolution;
              },
            },
          ],
          dist: {
            type: Number,
            required: function (this: ISolution): boolean {
              return this.hasSolution;
            },
          },
        },
      ],
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model<ISolution>('Problem', SolutionSchema);

export default Solution;
