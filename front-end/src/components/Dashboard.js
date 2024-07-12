import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from './Header'
import '../css/styles.css'

import { jwtDecode } from 'jwt-decode'

const Dashboard = (props) => {
    //User Authentication
    const jwtToken = localStorage.getItem('token') // the JWT token, if we have already received one and stored it in localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true) // if we already have a JWT token in local storage, set this to true, otherwise false

    const user = isLoggedIn ? jwtDecode(jwtToken) : ' '

    const navigate = useNavigate()

    const [totalWorth, setTotalWorth] = useState('0')

    const fetchPortfolios = async () => {
        if (!jwtToken || !isLoggedIn) {
            navigate('/login') // Redirect if no token is found
            return
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/portfolios/${user.email}`
            )
            const data = await response.json()
            if (Array.isArray(data.portfolios)) {
                setTotalWorth(data.totalWorth)
            } else {
                console.error('Received data is not an array:', data)
                setTotalWorth('0')
            }
        } catch (error) {
            console.error('Error fetching portfolio data:', error)
            setTotalWorth('0')
        }
    }

    useEffect(() => {
        fetchPortfolios()
    }, [isLoggedIn]) // Dependency on isLoggedIn to ensure user is logged in

    return (
        <div className="mx-3 mt-24 flex flex-col items-center rounded-2xl p-8 font-titillium font-extralight">
            <h1 className="my-5 mb-8 text-3xl leading-none md:text-5xl lg:text-3xl">
                Dashboard
            </h1>

            <h2 className="my-2 text-2xl">Total Worth</h2>

            <h2 className="my-2 text-xl text-green-400">
                ${Number(totalWorth).toLocaleString()}
            </h2>

            <div className="flex flex-row space-x-3">
                <Link to="/portfolio">
                    <button className=" mt-8 border-2 px-10 py-3  text-white hover:opacity-50 dark:border-white dark:text-white">
                        View Portfolio
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard
