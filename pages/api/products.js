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
            let data = JSON.parse(req.body)
            let deleteProduct = await db.collection("products").deleteOne({ _id: new ObjectID(data) })
            if (deleteProduct.deletedCount === 1) {
                console.log('product deleted successfully.');
            } else {
                console.log('product not found or already deleted.');
            }
        }
        else if (req.method === "PATCH") {
            let data = JSON.parse(req.body)
            let id = data._id
            let collection = await db.collection("products")
            const result = await collection.updateOne(
                { _id: new ObjectID(id) },
                { $set: data }
            );
            if (result.matchedCount === 1) {
                console.log('Product updated successfully.');
            } else {
                console.log('Product not found for updating.');
            }
        }
    } catch (e) {
        console.error(e);
    }
};