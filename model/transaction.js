const { Schema, model, SchemaTypes } = require('mongoose')

const transacSchema = new Schema(
  {
    date: {
      type: String,
    },
    category: {
      type: String,
    },
    income: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
    },
    sum: {
      type: Number,
    },
    owner: {
      type: SchemaTypes.ObjectId,
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
