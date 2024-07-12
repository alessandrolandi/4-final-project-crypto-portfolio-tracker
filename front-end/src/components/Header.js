import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import Hamburger from './Hamburger'
import '../css/styles.css'

const Header = () => {
    const jwtToken = localStorage.getItem('token')
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true) // if we have a JWT token, set this to true

    return (
        <header className="header w-full bg-white dark:bg-black">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
                <div className="flex items-center">
                    <div className="md:hidden">
                        <Hamburger />
                    </div>
                    <Link to="/" className="ml-4 text-xl">
                        CryptoTracker
                    </Link>
                </div>
                <ul className="hidden flex-1 justify-end space-x-4 md:flex">
                    <li>
                        <Link to="/" className="rounded-md px-3 py-2 text-sm">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={isLoggedIn ? '/profile' : '/login'}
                            className="rounded-md px-3 py-2 text-sm"
                        >
                            {isLoggedIn ? 'Profile':'Login'}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/portfolio"
                            className="rounded-md px-3 py-2 text-sm"
                        >
                            My Portfolio
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cryptolist"
                            className="rounded-md px-3 py-2 text-sm"
                        >
                            Cryptocurrencies
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
