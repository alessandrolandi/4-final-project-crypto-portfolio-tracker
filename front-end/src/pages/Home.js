import React, { useState, useEffect } from 'react'
import '../css/styles.css'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import Dashboard from '../components/Dashboard'
import News from './News'

const Home = (props) => {
    //User Authentication
    const jwtToken = localStorage.getItem('token') // the JWT token, if we have already received one and stored it in localStorage
    const [response, setResponse] = useState({}) // we expect the server to send us a simple object in this case
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true) // if we already have a JWT token in local storage, set this to true, otherwise false
    const user = isLoggedIn ? jwtDecode(jwtToken) : ' '

    const navigate = useNavigate()

    useEffect(() => {
        if (response.success && response.token) {
            console.log('User successfully logged in')
            localStorage.setItem('token', response.token)
        }
    }, [response])

    // try to load the protected data from the server when this component first renders

    if (isLoggedIn) {
        return (
            <div className="flex h-screen flex-col bg-white font-titillium font-extralight text-black dark:bg-black dark:text-white">
                <Header />
                <Dashboard />
            </div>
        )
    } else
        return (
            <div className="flex min-h-screen flex-col bg-white font-titillium font-extralight text-black dark:bg-black dark:text-white">
                <Header />
                <div className="mt-16 flex flex-col items-center px-6 py-12">
                    <h1 className="mb-4 text-4xl font-extralight">
                        Your Crypto Portfolio{' '}
                    </h1>
                    <h1 className="mb-4 text-2xl font-extralight">
                        All In One Place{' '}
                    </h1>
                    <button className="">

                    </button>
                    <p className="mb-8 py-2 text-sm">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        )
}

export default Home
