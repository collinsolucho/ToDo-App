import { client, ObjectId } from "../.server/mongo";

let db = client.db("todo");
let collection = db.collection("tasks");

export async function getItem() {
  return collection.find().toArray();
}

export async function addItem(task) {
  return collection.insertOne(task);
}

export async function removeItem(id) {
  return collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
}

export async function updateItem(id, updateData) {
  return collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: updateData }
  );
}
export async function getItemById(id) {
  return collection.findOne({ _id: ObjectId.createFromHexString(id) });
}
