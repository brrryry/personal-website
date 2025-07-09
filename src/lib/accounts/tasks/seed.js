import { dbConnection, closeConnection } from "../mongoConnection.js";

import { accounts, comments, sessions } from "../mongoCollections.js";
import { ObjectId } from "mongodb";

import bcrypt from "bcryptjs";
const saltRounds = Number(process.env.SALT_ROUNDS);

const db = await dbConnection();
await db.dropDatabase();

const accountCol = await accounts();
const commentCol = await comments();
const sessionCol = await sessions();
sessionCol.createIndex({createAt: 1}, {expireAfterSeconds: Number(process.env.EXPIRATION_TIME)}); // Sessions expire after 24 hours

let testPass = await bcrypt.hash("test", saltRounds);
const testAccount = await accountCol.insertOne({
    username: "test",
    bio: "This is a test account",
    password: testPass,
    nano: false,
});

let nanoPass = await bcrypt.hash("nano", saltRounds);
const nanoAccount = await accountCol.insertOne({
    username: "nano",
    bio: "This is a nano account",
    password: nanoPass,
    nano: true,
    isNano: false
});

let adminPass = await bcrypt.hash("admin", saltRounds);
const adminAccount = await accountCol.insertOne({
    username: "admin",
    bio: "This is an admin account",
    password: adminPass,
    nano: true,
    isNano: true
});

let testComment = await commentCol.insertOne({
    accountId: new ObjectId(testAccount.insertedId),
    blogId: "insure-2025",
    content: "This is a test comment",
    createdAt: new Date()
});



console.log("Test account created with ID:", testAccount.insertedId);
console.log("Seeding successful.")
await closeConnection();