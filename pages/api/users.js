import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("ipix");
        const collection = await db.collection("users")
        if (req.method === "GET") {
            const username = req.query.name
            const users = await collection
                .find({ user_name: username })
                .toArray();
            console.log("users are", users)
            if (users.length == 0)
                res.status(500).json({ error: 'user not found' });
            else {
                console.log("user detail is",users.data)
                // res.json({ status: 200, data: users });
            }

        }
        else if (req.method === "POST") {
            console.log("post is calling", req.body)
            let data = req.body
            let post = await collection.insertOne(data)
            let response = { user_name: post.user_name, Name: post.name }
            console.log("added data is", response)
            res.json({ status: 200, data: response });
        }
        else if (req.method === "DELETE") {
            let data = req.body
            let deleteProduct = await collection.deleteOne({ _id: new ObjectID(data) })
            if (deleteProduct.deletedCount === 1) {
                console.log('user deleted successfully.');
            } else {
                console.log('user not found or already deleted.');
            }
        }
    } catch (e) {
        console.error(e);
    }
};