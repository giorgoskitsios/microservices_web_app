import mongoose, { Schema, Types } from 'mongoose';

export interface IBalance extends Document {
  userId: String;
  credits: number;
}

const balanceSchema = new mongoose.Schema<IBalance>({
  userId: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Balance = mongoose.model<IBalance>('Balance', balanceSchema);

export default Balance;
