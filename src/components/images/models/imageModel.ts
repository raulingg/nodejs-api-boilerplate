/* eslint-disable no-param-reassign */
import type { Model, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { Image } from '../entities/Image.js';

const imageSchema = new Schema<Image, Model<Image>>(
  {
    name: { type: String, required: true },
    key: String,
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    width: Number,
    height: Number,
    url: String,
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      virtuals: true,
      transform(doc, ret: Document<mongoose.Types.ObjectId>) {
        ret.id = ret._id?.toString();
        delete ret._id;

        return ret;
      },
    },
  },
);

export const imageModel = mongoose.model<Image>('Image', imageSchema);
