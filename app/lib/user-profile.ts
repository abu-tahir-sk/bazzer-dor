import type { ObjectId } from "mongodb";
import { appDb, mongoCollections } from "./mongodb";

export type UserRole = "buyer" | "seller" | "admin";

export type UserProfile = {
  _id?: ObjectId;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function findUserProfileByUserId(userId: string): Promise<UserProfile | null> {
  return appDb.collection<UserProfile>(mongoCollections.userProfiles).findOne({ userId });
}

export async function findUserProfileByEmail(email: string): Promise<UserProfile | null> {
  return appDb.collection<UserProfile>(mongoCollections.userProfiles).findOne({ email: email.toLowerCase() });
}

export async function upsertUserProfile(input: {
  userId: string;
  name: string;
  email: string;
  role?: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
}): Promise<UserProfile> {
  const now = new Date();
  const profile: UserProfile = {
    userId: input.userId,
    name: input.name.trim(),
    email: input.email.toLowerCase(),
    role: input.role ?? "buyer",
    avatarUrl: input.avatarUrl ?? null,
    phone: input.phone ?? null,
    createdAt: now,
    updatedAt: now,
  };

  const collection = appDb.collection<UserProfile>(mongoCollections.userProfiles);
  const existingProfile = await collection.findOne({ userId: input.userId });

  if (existingProfile) {
    await collection.updateOne(
      { _id: existingProfile._id },
      {
        $set: {
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatarUrl: profile.avatarUrl,
          phone: profile.phone,
          updatedAt: now,
        },
      },
    );

    return { ...existingProfile, ...profile, updatedAt: now };
  }

  const result = await collection.insertOne(profile);
  return { ...profile, _id: result.insertedId };
}
