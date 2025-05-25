import { Client, Databases, Storage, Users } from 'node-appwrite';

const adminClient = new Client();
adminClient
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

export const adminDatabases = new Databases(adminClient);
export const adminStorage = new Storage(adminClient);

export { adminClient };