import mongoose from 'mongoose';

interface BalanceAttrs {
  userId: string;
  amount: number;

}

interface BalanceDoc extends mongoose.Document {
  userId: string;
  amount: number;
}

interface BalanceModel extends mongoose.Model<BalanceDoc> {
  build(attrs: BalanceAttrs): BalanceDoc;
}

const balanceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

balanceSchema.statics.build = (attrs: BalanceAttrs) => {
  return new Balance(attrs);
};

const Balance = mongoose.model<BalanceDoc, BalanceModel>('Balance', balanceSchema);

export { Balance };
