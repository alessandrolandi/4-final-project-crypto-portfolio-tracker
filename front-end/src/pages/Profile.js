import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import '../css/styles.css'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const Profile = (props) => {
    //User Authentication
    const jwtToken = localStorage.getItem('token') // the JWT token, if we have already received one and stored it in localStorage
    const [response, setResponse] = useState({}) // we expect the server to send us a simple object in this case
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true) // if we already have a JWT token in local storage, set this to true, otherwise false

    const user = isLoggedIn ? jwtDecode(jwtToken) : ' '

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        navigate('/')
    }

    // try to load the protected data from the server when this component first renders
    useEffect(() => {
        // send the request to the server api, including the Authorization header with our JWT token in it
        axios
            .get(`http://localhost:5000/api/protected/`, {
                headers: { Authorization: `JWT ${jwtToken}` }, // pass the token, if any, to the server
            })
            .then((res) => {
                setResponse(res.data) // store the response data
                console.log(response)
            })
            .catch((err) => {
                console.log(
                    'The server rejected the request for this protected resource... we probably do not have a valid JWT token.'
                )
                setIsLoggedIn(false) // update this state variable, so the component re-renders
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoggedIn && response.success)
        return (
            <div className="h-screen bg-white font-titillium font-extralight text-black dark:bg-black dark:text-white">
                <Header />
                <div className="flex flex-col items-center justify-center pt-36">
                    <form
                        className="flex flex-col items-center border p-10 py-16 mx-auto md:w-[400px]"
                        onSubmit=""
                    >
                        <h1 className="my-5 mb-8 text-2xl leading-none">
                            {user.email}
                        </h1>

                        <input
                            className="my-2 border w-full border-gray-600 p-3 px-5 dark:border-gray-600 dark:bg-black dark:text-black"
                            type="email"
                            name="email"
                            placeholder="Email address"
                        />
                        <input
                            className="my-2 border w-full p-3 px-5 dark:border-gray-600 dark:bg-black dark:text-black"
                            type="text"
                            name="password"
                            placeholder="Password"
                        />

                        <div className="flex w-full flex-row gap-4 relative bottom-0">
                            <button
                                type="submit"
                                className="mt-8 w-full border px-10 py-3 text-white hover:opacity-50"
                            >
                                Submit
                            </button>
                            <button
                                className="mt-8 w-full border px-10 py-3 text-white hover:opacity-50"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    else return navigate('/login')
}

export default Profile
