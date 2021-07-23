const { Schema, model, SchemaTypes } = require('mongoose')

const transacSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    income: {
      type: Boolean,
      required: true,
      default: false,
    },
    comment: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
      min: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        return ret
      },
    },
    // toObject: { virtuals: true },
  }
)

const Transaction = model('transaction', transacSchema)

transacSchema.virtual('info').get(function () {
  return `This is transaction ${this.owner}`
})

module.exports = Transaction
