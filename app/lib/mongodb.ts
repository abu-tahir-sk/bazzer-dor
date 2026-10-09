import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/";

export const mongoClient = new MongoClient(mongodbUri);
export const authDbName = process.env.MONGODB_AUTH_DB ?? "bazzer-dor-auth";
export const appDbName = process.env.MONGODB_APP_DB ?? "bazzer-dor-app";

export const authDb = mongoClient.db(authDbName);
export const appDb = mongoClient.db(appDbName);

export const mongoCollections = {
  userProfiles: "user_profiles",
  products: "products",
  priceHistory: "price_history",
  favorites: "favorites",
  markets: "markets",
} as const;

export async function ensureMongoCollections() {
  const collections = await appDb.listCollections({ name: mongoCollections.userProfiles }).toArray();

  if (collections.length === 0) {
    await appDb.createCollection(mongoCollections.userProfiles, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "name", "email", "role", "createdAt", "updatedAt"],
          additionalProperties: true,
          properties: {
            _id: { bsonType: ["objectId", "string"] },
            userId: { bsonType: "string" },
            name: { bsonType: "string", minLength: 2 },
            email: { bsonType: "string", pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
            role: { enum: ["buyer", "seller", "admin"] },
            avatarUrl: { bsonType: ["string", "null"] },
            phone: { bsonType: ["string", "null"] },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });

    await appDb.collection(mongoCollections.userProfiles).createIndexes([
      { key: { userId: 1 }, unique: true },
      { key: { email: 1 }, unique: true, sparse: true },
    ]);
  }

  const productCollection = await appDb.listCollections({ name: mongoCollections.products }).toArray();
  if (productCollection.length === 0) {
    await appDb.createCollection(mongoCollections.products);
    await appDb.collection(mongoCollections.products).createIndexes([
      { key: { productName: 1 } },
      { key: { marketId: 1, productName: 1 }, unique: true, sparse: true },
      { key: { createdAt: -1 } },
    ]);
  }

  const priceHistoryCollection = await appDb.listCollections({ name: mongoCollections.priceHistory }).toArray();
  if (priceHistoryCollection.length === 0) {
    await appDb.createCollection(mongoCollections.priceHistory);
    await appDb.collection(mongoCollections.priceHistory).createIndexes([
      { key: { productId: 1, recordedAt: -1 } },
      { key: { marketId: 1, recordedAt: -1 } },
    ]);
  }

  const favoritesCollection = await appDb.listCollections({ name: mongoCollections.favorites }).toArray();
  if (favoritesCollection.length === 0) {
    await appDb.createCollection(mongoCollections.favorites);
    await appDb.collection(mongoCollections.favorites).createIndexes([
      { key: { userId: 1, productId: 1 }, unique: true },
    ]);
  }

  const marketsCollection = await appDb.listCollections({ name: mongoCollections.markets }).toArray();
  if (marketsCollection.length === 0) {
    await appDb.createCollection(mongoCollections.markets);
    await appDb.collection(mongoCollections.markets).createIndexes([
      { key: { slug: 1 }, unique: true, sparse: true },
      { key: { district: 1, upazila: 1 } },
    ]);
  }
}
