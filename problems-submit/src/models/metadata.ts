import mongoose, { Schema } from 'mongoose';

export interface IMetaData extends Document {
  filename: string;
  originalname: string;
  userId: string;
  _id: Schema.Types.ObjectId;
}

const MetaDataSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
      unique: true,
    },
    originalname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MetaData = mongoose.model<IMetaData>('MetaData', MetaDataSchema);

export default MetaData;
