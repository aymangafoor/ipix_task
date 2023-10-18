import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("ipix");
        if (req.method === "GET") {
            const products = await db
                .collection("products")
                .find({})
                .sort({ metacritic: -1 })
                .limit(10)
                .toArray();

            res.json(products);
        }
        else if (req.method === "POST") {
            console.log("post is calling", req.body)
            let data = req.body
            let post = await db.collection("products").insertOne(data)
            res.json({ status: 200, data: post });
        }
        else if (req.method === "DELETE") {
            let data = req.body
            console.log("data to delete", data)
            let id = new ObjectId(data._id)
            let deleteProduct = await db.collection("products").deleteOne({ _id: id })
            if (deleteProduct.deletedCount === 1) {
                console.log('product deleted successfully.');
                res.json({ status: 200, data: "success" });

            } else {
                console.log('product not found or already deleted.');
                res.status(400).json({ error: 'product not found' });
            }
        }
        else if (req.method === "PATCH") {
            let data = req.body
            let id = new ObjectId(data._id) //for mongo db to identify the id to edit
            delete data._id //deleted as id is not needed in new detail
            let collection = await db.collection("products")
            console.log("data to upadte", data)
            const result = await collection.updateOne(
                { _id: id },
                { $set: data }
            );
            if (result.matchedCount === 1) {
                console.log('product updated successfully.');
                res.json({ status: 200, data: "success" });
            } else {
                console.log('Product not found for updating.', result);
                res.status(400).json({ error: 'product not found' });
            }
        }
    } catch (e) {
        console.error(e);
    }
};