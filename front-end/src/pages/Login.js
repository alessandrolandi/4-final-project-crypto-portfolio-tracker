import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import '../css/styles.css'

const Login = (props) => {
    const [emailInput, setEmail] = useState('')
    const [passwordInput, setPassword] = useState('')

    const [response, setResponse] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if (response.success && response.token) {
            console.log('User successfully logged in')
            localStorage.setItem('token', response.token)
        }
    }, [response])

    const handleLogin = async (e) => {
        e.preventDefault()

        const loginInput = {
            email: emailInput,
            password: passwordInput,
        }

        try {
            // POST request to the back-end with the Login
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInput),
            })

            const responseData = await response.json()

            console.log(responseData)
            setResponse(responseData)
        } catch (error) {
            console.error('Error posting login data:', error)
        }
    }

    if (!response.success)
        return (
            <div className="flex min-h-screen flex-col bg-white font-titillium font-extralight text-black dark:bg-black dark:text-white">
                <Header />
                <div className="mx-auto mt-32 flex w-full flex-col items-center justify-center px-8 py-8 md:mt-0 md:h-screen md:w-[500px] lg:py-0">
                    <div className="w-full bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-white dark:bg-transparent">
                        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                            <h1 className="text-xl leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Login to your account
                            </h1>
                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleLogin}
                            >
                                <div>
                                    <label
                                        for="email"
                                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={emailInput}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className=" block w-full border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="name@email.com"
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label
                                        for="password"
                                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={passwordInput}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="focus:ring-primary-600 block w-full border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        required=""
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Link to="/forgot_password">
                                        <p className="dark:text-primary-500 text-sm font-medium hover:underline">
                                            Forgot password?
                                        </p>
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full border-2 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 dark:border-white dark:bg-transparent dark:hover:opacity-50 dark:focus:ring-white"
                                >
                                    Sign in
                                </button>
                                <div className="flex flex-row">
                                    <Link to="/register">
                                        <p classname="ml-2 text-sm font-light hover:underline dark:text-white">
                                            Don’t have an account yet? Sign up
                                        </p>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    else return navigate('/')
}

export default Login
