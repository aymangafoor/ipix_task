import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import clientPromise from '../../lib/mongodb';
import { useEffect, useState } from 'react';
import axios from "axios"

const Catalog = (props: any) => {
    const [popup, setOpen] = useState(false)
    const [edit, setedit] = useState("")
    const [cat_popup, setOpenCat] = useState(false)
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    useEffect(() => {
        console.log("Products are", props)
    }, [])
    const ModifyCategory = (e: any) => {
        e.preventDefault()
        //check if all data is entered
        if (!e.target.elements.title.value) {
            alert("Enter all details")
        }
        //call api to add category from api folder
        else {
            axios.post(`/api/category`, {
                title: e.target.elements.title.value
            })
                .then(res => {
                    console.log("updated data is", res)
                    alert("Created Successfully")
                    setOpenCat(false)
                })
                .catch(err => {
                    console.error("error on add is", err)
                    alert("Error on Creation")
                })
        }
    }
    const AddUpdateProduct = (event: any) => {
        event.preventDefault()
        console.log("data is", event.target.elements.title.value)
        //check if all data is entered
        if (!event.target.elements.title.value ||
            // !event.target.elements.category.value ||
            !event.target.elements.price.value) {
            alert("Enter all details")
        }
        //call api to add product from api folder
        else {
            if (edit) {
                let file
                console.log("file is", event.target.elements.file.files)
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    //Initiate the JavaScript Image object.
                    var image = new Image();
                    //Set the Base64 string return from FileReader as source.
                    image.src = reader.result;
                    file = reader.result
                }
                );
                reader.readAsDataURL(event.target.elements.file.files[0]);
                file = reader.result
                console.log("result", file)
                axios.post(`/api/products`, {
                    _id: edit,
                    name: event.target.elements.title.value,
                    category: event.target.elements.category.value,
                    price: event.target.elements.price.value,
                    image: file
                })
                    .then(res => {
                        console.log("updated data is", res)
                        setOpen(false)
                        alert("Product updated Successfully")
                    })
                    .catch(err => {
                        console.error("error on add is", err)
                        alert("Error on updating product")
                    })
            }
            else {
                let file
                console.log("file is", event.target.elements.file.files)
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    //Initiate the JavaScript Image object.
                    var image = new Image();
                    //Set the Base64 string return from FileReader as source.
                    image.src = reader.result;
                    file = reader.result
                }
                );
                reader.readAsDataURL(event.target.elements.file.files[0]);
                file = reader.result
                console.log("result", file)
                axios.post(`/api/products`, {
                    name: event.target.elements.title.value,
                    category: event.target.elements.category.value,
                    price: event.target.elements.price.value,
                    image: file
                })
                    .then(res => {
                        console.log("updated data is", res)
                        setOpen(false)
                        alert("Created Successfully")
                    })
                    .catch(err => {
                        console.error("error on add is", err)
                        alert("Error on Creation")
                    })
            }
        }
    }
    const deleteProduct = (id: string) => {
        axios.delete("/api/products", {
            params: { _id: id }
        })
            .then(res => {
                alert("Product deleted successfully")
            })
            .catch(err => {
                alert("Error on deleting")
                console.error("error onn deleting", err)
            })
    }
    const updateProduct = (details: any) => {
        setTitle(details.name)
        setCategory(details.category)
        setPrice(details.price)
        setedit(details._id)
        setOpen(true)
    }
    return (<div className="container my-sm-5 py-sm-5 my-3 py-3">
        <h4>Catalog Management</h4>
        <p className='btn' onClick={() => localStorage.removeItem("user_details")}>Logout</p>
        <div className='row'>
            <div className="col-sm-6 col-12 mb-4">
                <button className="btn btn-primary" onClick={() => { setOpen(true); setedit("") }}>Add a Product</button>
            </div>
            <div className="col-sm-6 col-12">
                <button className="btn btn-primary" onClick={() => setOpenCat(true)}>Add Category</button>
            </div>

        </div>
        <h6>Products</h6>
        <div className='row'>
            {props?.products?.map((product: any) => {
                return (
                    <div className='col-4 col-lg-4 col-md-6 col-12 mb-2'>
                        <div className='card'>
                            <img src={product.image ? product.image : ""} className="card-img-top" alt="..."></img>
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.category ? `Category: ${product.category}` : " "}</p>
                                <p className="card-text">Rs.{product.price}</p>
                                <div className='row'>
                                    <div className='col-6'>
                                        <p className='btn' onClick={() => updateProduct(product)}>Edit</p>
                                    </div>
                                    <div className='col-6'>
                                        <p className='btn' onClick={() => deleteProduct(product._id)}>Delete</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        {popup ? <div className='create-popup'>
            <div className='col-12'>
                <p className='d-flex justify-content-end'><span className='btn' onClick={() => { setOpen(false); setedit("") }}>x</span></p>
            </div>
            <form onSubmit={AddUpdateProduct} className='col-12'>
                <div className='col-12 mb-3'>
                    <input type='text' name="title" value={title} className='w-100' placeholder='Enter the title of product' />
                </div>
                <div className='col-12 mb-3'>
                    <input type='text' value={price} name="price" className='w-100' placeholder='Enter the Price' />
                </div>
                <div className='col-12 mb-3'>
                    <select placeholder='Select Categories' value={category} name='category' className='w-100'>
                        {props.categories?.map((category: any) => {
                            return <option value={category.title}>{category.title}</option>
                        })}
                    </select>
                </div>
                <div className='col-12 mb-3'>
                    <label htmlFor='file' className='col-12 mb-1'>Select an image</label>
                    <input type='file' name='file' id='file' accept="image/*" />
                </div>
                <input type='submit' className='btn btn-primary' value="Submit" />
            </form>

        </div> : ""}
        {cat_popup ? <div className='create-popup'>
            <div className='col-12'>
                <p className='d-flex justify-content-end'><span className='btn' onClick={() => setOpenCat(false)}>x</span></p>
            </div>
            <form action="" onSubmit={ModifyCategory}>
                <div className='col-12 mb-3'>
                    <input type='text' name="title" className='w-100' placeholder='Enter category name' />
                </div>
                <input type='submit' className='btn btn-primary' value="Submit" />
            </form>
        </div> : ""}

    </div>)
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("ipix")
        const products = await db
            .collection("products")
            .find({})
            .sort({ metacritic: -1 })
            .toArray();
        const categories = await db
            .collection("categories")
            .find({})
            .sort({ metacritic: -1 })
            .toArray();
        return {
            props: { products: JSON.parse(JSON.stringify(products)), categories: JSON.parse(JSON.stringify(categories)) },
        }
    }
    catch (e) {
        console.error(e)
        return {
            props: { products: null, categories: null }
        }
    }
}

export default Catalog;