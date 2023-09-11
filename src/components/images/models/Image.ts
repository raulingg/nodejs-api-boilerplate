/* eslint-disable no-param-reassign */
import mongoose, { Schema } from 'mongoose';
import {
  ImageDocument,
  ImageModel,
  ImageSchema,
} from '../../../interfaces/mongoose.gen';

const schema: ImageSchema = new Schema(
  {
    name: String,
    key: String,
    mimetype: String,
    size: Number,
    width: Number,
    height: Number,
    source: {
      action: {
        type: String,
        enum: ['UPLOAD', 'FETCH', 'TASK'],
      },
      url: String,
    },
    state: {
      fromImage: Schema.Types.ObjectId,
      actions: [
        {
          action: {
            type: String,
            enum: ['SMART_RESIZE', 'RESIZE', 'CROP', 'ROTATE'],
          },
          params: Schema.Types.Mixed,
        },
      ],
      createdAt: Date,
      deletedAt: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toObject: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;

        return ret;
      },
    },
  },
);

export const Image = mongoose.model<ImageDocument, ImageModel>('Image', schema);
