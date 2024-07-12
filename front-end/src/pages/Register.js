import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import '../css/styles.css'

const Register = (props) => {
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

    const handleRegistration = async (e) => {
        e.preventDefault()

        const registerInput = {
            email: emailInput,
            password: passwordInput,
        }

        try {
            // POST request to the back-end with the Registration
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerInput),
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
            <div className="flex min-h-screen flex-col bg-white font-titillium font-extralight text-black dark:bg-[#111111] dark:text-white">
                <Header />
                <div class="mx-auto mt-32 flex w-full flex-col items-center justify-center px-8 py-8 md:mt-0 md:h-screen md:w-[500px] lg:py-0">
                    <div class="w-full bg-white shadow sm:max-w-md md:mt-0 md:h-[400px] xl:p-0 dark:border dark:border-white dark:bg-transparent">
                        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
                            <h1 class="text-xl leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Register an account
                            </h1>
                            <form
                                class="space-y-4 md:space-y-6"
                                onSubmit={handleRegistration}
                            >
                                <div>
                                    <label
                                        for="email"
                                        class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
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
                                        class=" block w-full border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="name@email.com"
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label
                                        for="password"
                                        class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        value={passwordInput}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        class="block w-full border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        required=""
                                    />
                                </div>
                                <div class="flex items-start">
                                    <div class="flex h-5 items-center">
                                        <input
                                            id="terms"
                                            aria-describedby="terms"
                                            type="checkbox"
                                            class="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                                            required=""
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label
                                            for="terms"
                                            class="font-light text-gray-500 dark:text-gray-300"
                                        >
                                            I accept the{' '}
                                            <a
                                                class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                                                href="#"
                                            >
                                                Terms and Conditions
                                            </a>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    class="w-full border-2 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 dark:border-white dark:bg-transparent dark:hover:opacity-50 dark:focus:ring-white"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 
                <div className="flex flex-col items-center py-32">
                    <h1 className="my-5 mb-8 flex justify-center text-4xl font-extrabold leading-none md:text-5xl lg:text-6xl">
                        Register
                    </h1>
                    <form
                        className="flex flex-col items-center"
                        onSubmit={handleRegistration}
                    >
                        <input
                            className="my-4 rounded-md border-b-4 p-4 dark:text-black"
                            type="text"
                            name="name"
                            value={nameInput}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />
                        <input
                            className="my-4 rounded-md border-b-4 p-4 dark:text-black"
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={emailInput}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="my-4 rounded-md border-b-4 p-4 dark:text-black"
                            type="text"
                            name="username"
                            value={usernameInput}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input
                            className="my-4 rounded-md border-b-4 p-4 dark:text-black"
                            type="text"
                            name="password"
                            value={passwordInput}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />

                        <button
                            type="submit"
                            className="bg-secondary hover:bg-oragne-dark mt-8 rounded bg-orange-light px-12 py-3 font-bold text-white"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            */}
            </div>
        )
    else return navigate('/')
}

export default Register
