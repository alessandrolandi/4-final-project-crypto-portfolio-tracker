import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link, useLocation } from 'react-router-dom'
import Header from './Header'
import './styles.css'

const Register = (props) => {
    const [nameInput, setName] = useState('')
    const [emailInput, setEmail] = useState('')
    const [usernameInput, setUsername] = useState('')
    const [passwordInput, setPassword] = useState('')

    const handleRegistration = async (e) => {
        e.preventDefault()

        const registerInput = {
            name: nameInput,
            username: usernameInput,
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
        } catch (error) {
            console.error('Error posting login data:', error)
        }
        setName('')
        setEmail('')
        setUsername('')
        setPassword('')
    }
    return (
        <div className="flex min-h-screen flex-col bg-white text-black dark:bg-dark-blue dark:text-white">
            <Header />
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
                        placeholder="name"
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
                        placeholder="username"
                    />
                    <input
                        className="my-4 rounded-md border-b-4 p-4 dark:text-black"
                        type="text"
                        name="password"
                        value={passwordInput}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                    />

                    <button
                        type="submit"
                        className="bg-secondary hover:bg-oragne-dark mt-8 rounded bg-orange-light px-12 py-3 font-bold text-white"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
