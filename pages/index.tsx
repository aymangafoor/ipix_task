import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import 'bootstrap/dist/css/bootstrap.css'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("ipix")
    const products = await db
      .collection("products")
      .find({})
      .sort({ metacritic: -1 })
      .toArray();
    return {
      props: { products: JSON.parse(JSON.stringify(products)) },
    }
  }
  catch (e) {
    console.error(e)
    return {
      props: { products: null }
    }
  }
}

export default function Home(props: any) {
  const { push } = useRouter();
  const [user_name, setUserName] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [login_pop, openLogin] = useState(false)
  const [login, changeType] = useState(true)
  const checkLogined = () => {
    if (localStorage.getItem("user_details")) {
      push("/catalog-management")
    }
    else {
      openLogin(true)
    }
  }
  const userCheck = (event: any) => {
    event.preventDefault()
    console.log("event", event.target)
    if (login) {
      if (!user_name || !password) {
        alert("Enter all details")
      }
      else {
        axios.get(`/api/users?name=${user_name}&password=${password}`)
          .then(res => {
            localStorage.setItem("user_details", JSON.stringify(res.data.data))
            push("/catalog-management")
            alert("Login success")
          })
          .catch(err => {
            alert("User name and password dont match")
          })
      }
    }
    else {
      if (!name || !user_name || !password) {
        alert("Enter all details")
      }
      else {
        axios.post("/api/users", {
          name: name,
          user_name: user_name,
          password: password
        })
          .then(res => {
            alert("User created successfully")
            localStorage.setItem("user_details", JSON.stringify(res))
            push("/catalog-management",)
          })
          .catch(err => {
            console.log("error is", err.response.data)
            let error = err.response.data?.error
            if (error === "already taken") {
              alert("User name is already taken")
            }
            else {
              alert("error on creating")
            }
            console.log("error")
          })
      }
    }
  }
  return (
    <div className="container h-100">
      <Head>
        <title>Catalog Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container my-sm-5 py-sm-5 my-3 py-3'>
        <h6 className='btn' onClick={checkLogined}>Go to Catalog Management  </h6>
        <h4>Products</h4>
        <div className='row'>
          {props?.products?.map((product: any) => {
            return (
              <div className='col-lg-4 col-md-6 col-12 mb-2'>
                <div className='card'>
                  <img src={product.image ? product.image : ""} className="card-img-top" alt="..."></img>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.category ? `Category: ${product.category}` : " "}</p>
                    <p className="card-text">Rs.{product.price}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {login_pop ? <div className='profile-box create-popup'>
        <div className='col-12'>
          <p className='d-flex justify-content-end btn' onClick={() => openLogin(false)}>x</p>
        </div>
        <h4>{login ? "Sign IN" : "Register"}</h4>
        <form onSubmit={userCheck} className='w-100'>
          {!login ? <>
            <label htmlFor="name" className='mb-2' >Name</label>
            <input type='text' id="name" value={name} onChange={e => setName(e.target.value)} className='form-control mb-3' placeholder='Enter Your Name' />
          </> : ""}

          <label htmlFor="username" className='mb-2' >User Name</label>
          <input type='text' id="username" value={user_name} onChange={e => setUserName(e.target.value)} className='form-control mb-3' placeholder='Enter a user name' />

          <label htmlFor="password" className='mb-2' >Password</label>
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} id='password' className='form-control mb-3' placeholder='Enter your password' />

          <input type='submit' className="btn btn-primary mt-2 mx-auto w-100" value={login ? "Sign In" : "Register"} />
        </form>
        <p className='btn' onClick={() => changeType(!login)}>{login ? "New User? Register Now" : "Already a user? Login"}</p>
      </div> : ""}
      <footer>
      </footer>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
