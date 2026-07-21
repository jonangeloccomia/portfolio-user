import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const templateSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export type Template = InferSchemaType<typeof templateSchema>;

export const TemplateModel: Model<Template> =
  (models.Template as Model<Template>) ?? model<Template>("Template", templateSchema);
