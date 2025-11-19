import mongoose, { Schema, Document, Types } from "mongoose";

interface Change {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

interface AuditLogDocument extends Document {
  userId: string;             
  userName: string;
  userRole?: string;
  entity: string;             
  entityId: Types.ObjectId;
  action: "CREATE" | "UPDATE" | "DELETE";
  changes: Record<string, Change[]>; 
  createdAt: Date;
}

const changeSchema = new Schema<Change>(
  {
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String },
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true },
    changes: {
      type: Map,
      of: [changeSchema],
      required: function () {
        return this.action === "UPDATE";
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

const AuditLog =
  mongoose.models.AuditLog || mongoose.model<AuditLogDocument>("AuditLog", auditLogSchema);

export default AuditLog;
