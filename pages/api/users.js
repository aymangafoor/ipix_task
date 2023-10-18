import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("ipix");
        const collection = await db.collection("users")
        if (req.method === "GET") {
            const username = req.query.name
            console.log("user is", username)
            const users = await collection
                .find({ user_name: username })
                .toArray();
            console.log("users are", users)
            if (users.length == 0)
                console.log("not found")
            // res.status(500).json({ error: 'user not found' });
            else {
                console.log("user detail is", users)
                if (users[0].password == req.query.password)
                    res.json({ status: 200, data: users[0] });
                else
                    res.status(500).json({ error: 'password not match' });

            }

        }
        else if (req.method === "POST") {
            console.log("post is calling", req.body)
            let data = req.body
            // check if user name is already taken before creation
            const users = await collection
                .find({ user_name: data.user_name })
                .toArray();
            if (users.length) {
                res.status(400).json({ error: "already taken" })
            }
            else {
                let post = await collection.insertOne(data)
                let response = { user_name: post.user_name, Name: post.name }
                console.log("added data is", response)
                res.json({ status: 200, data: response });
            }
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