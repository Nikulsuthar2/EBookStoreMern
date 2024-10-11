import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
},
  items: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

purchaseSchema.path('items').validate(function (items) {
  return items && items.length > 0;
}, 'At least one item is required in the purchase.');

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
