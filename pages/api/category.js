import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("ipix");
        const collection = await db.collection("categories")
        if (req.method === "GET") {
            const categories = await collection
                .find({})
                .sort({ metacritic: -1 })
                .limit(10)
                .toArray();

            res.json(categories);
        }
        else if (req.method === "POST") {
            console.log("post is calling", req.body)
            let data = req.body
            let post = await collection.insertOne(data)
            res.json({ status: 200, data: post });
        }
        else if (req.method === "DELETE") {
            let data = req.body
            let deleteProduct = await collection.deleteOne({ _id: new ObjectID(data) })
            if (deleteProduct.deletedCount === 1) {
                console.log('Document deleted successfully.');
            } else {
                console.log('Document not found or already deleted.');
            }
        }
    } catch (e) {
        console.error(e);
    }
};