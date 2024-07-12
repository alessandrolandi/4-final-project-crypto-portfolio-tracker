import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import '../css/styles.css'
import '../css/Portfolio.css'
import HistoricalPortfolioGraph from '../components/HistoricalPortfolioGraph'
import DropdownMenu from '../components/DropdownMenu'
import AddressModal from '../components/AddressModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'

// REQUIRES INSTALLATION OF Recharts Library.
// Use command 'npm install recharts' for use
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'

const Portfolio = () => {
    //User Authentication
    const jwtToken = localStorage.getItem('token') // the JWT token, if we have already received one and stored it in localStorage
    const [response, setResponse] = useState({}) // we expect the server to send us a simple object in this case
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true) // if we already have a JWT token in local storage, set this to true, otherwise false
    const navigate = useNavigate()
    const user = isLoggedIn ? jwtDecode(jwtToken) : ' '

    //Portfolio List Table
    const [editingPortfolioId, setEditingPortfolioId] = useState(null)
    const [newPortfolioName, setNewPortfolioName] = useState('')
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [fullAddress, setFullAddress] = useState('')

    // Histograph
    const [totalWorth, setTotalWorth] = useState('0')
    const [timeRange, setTimeRange] = useState('30days') // default range for histograph

    //Portfolio Add Wallet Modal
    const [showAddModal, setShowAddModal] = useState(false)
    const [address, setAddress] = useState('')
    const [walletName, setWalletName] = useState('')
    const [portfolios, setPortfolios] = useState([])
    const [selectedCurrency, setSelectedCurrency] = useState('bitcoin') // btc as default
    const [chartData, setChartData] = useState([])

    const toggleAddModal = () => setShowAddModal(!showAddModal)

    //NFT 
    const [showNFTModal, setShowNFTModal] = useState(false)
    const toggleNFTModal = () => setShowNFTModal(!showNFTModal)

    // make platform IDs to abbreviations
    const cryptoAbbreviations = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        cardano: 'ADA',
        // add more mappings as we go
    }

    // Fetch and refresh portfolios
    const fetchPortfolios = async () => {
        if (!jwtToken || !isLoggedIn) {
            navigate('/login') // Redirect if no token is found
            return
        }

        try {
            console.log(`${user.id}`)
            const response = await fetch(
                `http://localhost:5000/api/portfolios/${user.email}`
            )
            const data = await response.json()
            if (Array.isArray(data.portfolios)) {
                setPortfolios(data.portfolios)
                setTotalWorth(data.totalWorth)
                aggregateData(data.portfolios)
            } else {
                console.error('Received data is not an array:', data)
                setPortfolios([])
                setTotalWorth('0')
            }
        } catch (error) {
            console.error('Error fetching portfolio data:', error)
            setPortfolios([])
            setTotalWorth('0')
        }
    }

    // Aggregate data for the pie chart
    const aggregateData = (portfolios) => {
        const dataMap = portfolios.reduce((acc, portfolio) => {
            const balanceUSD = parseFloat(
                portfolio.balance.replace(/[^\d.-]/g, '')
            )
            const abbreviation =
                cryptoAbbreviations[portfolio.platformId] ||
                portfolio.platformId.toUpperCase()
            acc[abbreviation] = (acc[abbreviation] || 0) + balanceUSD
            return acc
        }, {})

        const newData = Object.keys(dataMap).map((key) => ({
            name: key,
            value: dataMap[key],
        }))

        setChartData(newData)
    }

    // Initial data fetch
    useEffect(() => {
        fetchPortfolios()
    }, [isLoggedIn]) // Dependency on isLoggedIn to ensure user is logged in

    function generateUniqueID() {
        const timestamp = new Date().getTime() // get current time in milliseconds
        const randomPart = Math.random().toString(36).substring(2, 15) // create a random string
        const uniqueID = `${timestamp}-${randomPart}`
        return uniqueID
    }

    // Function to handle adding new wallet or exchange
    const handleAddWallet = async (e) => {
        e.preventDefault()

        const newPortfolio = {
            portfolioId: generateUniqueID(),
            email: user.email,
            name: walletName,
            platformId: selectedCurrency,
            address: address,
            balance: '$0', // default value for now
        }
        try {
            // POST request to the back-end with the Bitcoin address
            const response = await fetch(
                `http://localhost:5000/api/addWallet`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPortfolio),
                }
            )

            const responseData = await response.json()
            console.log(responseData)

            // update front end portfolio list
            setPortfolios([...portfolios, newPortfolio])
        } catch (error) {
            console.error('Error posting wallet data:', error)
        }
        setAddress('') // reset the address
        setWalletName('')
        setSelectedCurrency('bitcoin')
        setShowAddModal(false)
        fetchPortfolios()
    }

    const handleDeletePortfolio = async (portfolioId) => {
        console.log('Deleting portfolio with ID:', portfolioId)

        if (!portfolioId) {
            return alert('No Portfolio ID provided.')
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/deleteWallet/${user.email}/${portfolioId}`,
                {
                    method: 'DELETE',
                }
            )
            const responseData = await response.json()
            console.log(responseData)

            if (response.ok) {
                setPortfolios(
                    portfolios.filter(
                        (portfolio) => portfolio.portfolioId !== portfolioId
                    )
                )
            } else {
                throw new Error(responseData.message || 'Deletion failed')
            }
        } catch (error) {
            console.error('Error deleting wallet data:', error)
            alert(error.message)
        }
        fetchPortfolios()
    }

    const handleRenamePortfolio = async (portfolioId, newName) => {
        if (!newName.trim()) {
            alert('Portfolio name cannot be empty!')
            return
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/renamePortfolio/${user.email}/${portfolioId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${jwtToken}`,
                    },
                    body: JSON.stringify({ newName }),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to rename portfolio')
            }

            const updatedPortfolio = await response.json()
            console.log('Rename successful:', updatedPortfolio)

            setPortfolios(
                portfolios.map((portfolio) =>
                    portfolio.portfolioId === portfolioId
                        ? { ...portfolio, name: newName }
                        : portfolio
                )
            )
            setEditingPortfolioId(null) // reset editing state
        } catch (error) {
            console.error('Error renaming portfolio:', error)
            alert('Failed to rename portfolio')
        }
    }

    // handle range change for histograph
    const handleRangeChange = (e) => {
        setTimeRange(e.target.value)
    }

    const handleAddNFT = async (e) => {
        e.preventDefault()

        const newPortfolio = {
            email: user.email,
            address: address,
        }
        try {
            // POST request to the back-end with the Bitcoin address
            const response = await fetch(
                `http://localhost:5000/api/addNft`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPortfolio),
                }
            )

            const responseData = await response.json()
            console.log(responseData)

            // update front end portfolio list
            setPortfolios([...portfolios, newPortfolio])
        } catch (error) {
            console.error('Error posting wallet data:', error)
        }
        setAddress('') // reset the address
        setShowNFTModal(false)
    }

    // Define colors for the pie chart
    const COLORS = ['#9B5DE5', '#00F5D4', '#00BBF9', '#21FA90 ', '#F2DD6E']

    if (isLoggedIn)
        return (
            <div className="overflow-auto bg-white font-titillium font-extralight text-black dark:bg-black dark:text-white">
                <Header />

                <div
                    id="CONTAINER!!"
                    className="mt-16 w-full p-5 md:grid md:h-screen md:grid-cols-6 md:grid-rows-12 md:gap-3"
                >
                    <div
                        id="TotalWorth"
                        className="flex flex-col items-center justify-center border md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-4"
                    >
                        <h2 className="my-2 text-lg">Total Value</h2>
                        <h2 className="my-2 text-xl text-green-400">
                            ${Number(totalWorth).toLocaleString()}
                        </h2>
                    </div>
                    {/*
                    <div
                        id="PieChart"
                        className="flex flex-col items-center justify-center md:col-span-1 md:row-start-1 md:row-end-4 "
                    >
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
*/}
                    <div
                        id="LineGraph"
                        className="flex flex-col items-center justify-center space-y-2 border md:col-start-3 md:col-end-7 md:row-start-1 md:row-end-7"
                    >
                        <HistoricalPortfolioGraph
                            email={user.email}
                            range={timeRange}
                            className="z-10"
                        />
                        <div>
                            <select
                                className="text-black"
                                value={timeRange}
                                onChange={handleRangeChange}
                            >
                                <option className="text-black" value="24hours">
                                    Last 24 Hours
                                </option>
                                <option className="text-black" value="30days">
                                    Last 30 Days
                                </option>
                            </select>
                        </div>
                    </div>

                    <div
                        id="PortfolioList"
                        className="flex w-full flex-col items-center border md:col-start-3 md:col-end-7 md:row-start-7 md:row-end-12"
                    >
                        <table className="w-full text-left">
                            <thead className="text-black dark:text-white">
                                <tr>
                                    <th className="p-3 font-extralight">
                                        Name
                                    </th>
                                    <th className="p-3 font-extralight">
                                        Address
                                    </th>
                                    <th className="p-3 font-extralight">
                                        Balance
                                    </th>
                                    <th className="p-3 font-extralight"></th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {portfolios.map((portfolio) => (
                                    <tr
                                        key={portfolio.portfolioId}
                                        className="border-b border-gray-700"
                                    >
                                        <td className="p-3">
                                            {editingPortfolioId ===
                                            portfolio.portfolioId ? (
                                                <input
                                                    type="text"
                                                    value={newPortfolioName}
                                                    onChange={(e) =>
                                                        setNewPortfolioName(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setEditingPortfolioId(
                                                            null
                                                        )
                                                    }
                                                    onKeyDown={(event) => {
                                                        if (
                                                            event.key ===
                                                            'Enter'
                                                        ) {
                                                            handleRenamePortfolio(
                                                                portfolio.portfolioId,
                                                                newPortfolioName
                                                            )
                                                            setEditingPortfolioId(
                                                                null
                                                            )
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '200px',
                                                        color: 'black',
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        setEditingPortfolioId(
                                                            portfolio.portfolioId
                                                        )
                                                        setNewPortfolioName(
                                                            portfolio.name
                                                        )
                                                    }}
                                                >
                                                    {portfolio.name}
                                                </div>
                                            )}
                                        </td>{' '}
                                        <td className="p-3">
                                            <span
                                                onClick={() => {
                                                    setFullAddress(
                                                        portfolio.address
                                                    )
                                                    setAddressModalOpen(true)
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {`${portfolio.address.substring(0, 5)}...${portfolio.address.substring(portfolio.address.length - 4)}`}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {portfolio.balance}
                                        </td>
                                        <td className="p-3">
                                            <DropdownMenu
                                                onRenameClick={() => {
                                                    setEditingPortfolioId(
                                                        portfolio.portfolioId
                                                    )
                                                    setNewPortfolioName(
                                                        portfolio.name
                                                    )
                                                }}
                                                onDeleteClick={() =>
                                                    handleDeletePortfolio(
                                                        portfolio.portfolioId
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex items-center space-x-4 overflow-auto">
                            <button
                                className="mt-4 border px-4 py-2 text-white hover:opacity-50"
                                onClick={toggleAddModal}
                            >
                                Add Wallet
                            </button>
                            <button
                                onClick={fetchPortfolios}
                                className="mt-4 border px-4 py-2 text-white hover:opacity-50"
                            >
                                <FontAwesomeIcon icon={faRotate} />
                            </button>
                        </div>
                    </div>

                    <div className="border md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-12">
                        <div className="mt-5 flex flex-col items-center justify-center">
                            <button
                                className="border px-5 py-2 font-extralight text-white hover:opacity-50"
                                onClick={toggleNFTModal}
                            >
                                <h2 className="text-md">Add NFT</h2>
                            </button>
                            <NFTs />
                        </div>
                    </div>
                </div>

                {addressModalOpen && (
                    <AddressModal
                        isOpen={addressModalOpen}
                        onClose={() => setAddressModalOpen(false)}
                        address={fullAddress}
                    />
                )}

                {/* Add Wallet/Exchange Modal */}
                {showAddModal && (
                    <div className="modal">
                        <div className="modal-background">
                            <div className="modal-content">
                                <span
                                    className="modal-close-button"
                                    onClick={toggleAddModal}
                                >
                                    &times;
                                </span>
                                <h2>Add Wallet Address</h2>
                                <form onSubmit={handleAddWallet}>
                                    <input
                                        type="text"
                                        name="walletName"
                                        placeholder="Portfolio Name"
                                        value={walletName}
                                        onChange={(e) =>
                                            setWalletName(e.target.value)
                                        }
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder={`${selectedCurrency.charAt(0).toUpperCase() + selectedCurrency.slice(1)} Wallet Address`} // dynamically update placeholder text based off crypto type
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        required
                                    />
                                    <div className="mt-4">
                                        <select
                                            className="block w-11/12 rounded-md border border-gray-300 bg-white px-4 py-2 text-black shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                                            value={selectedCurrency}
                                            onChange={(e) =>
                                                setSelectedCurrency(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="bitcoin">
                                                Bitcoin (BTC)
                                            </option>
                                            <option value="ethereum">
                                                Ethereum (ETH)
                                            </option>
                                            <option value="cardano">
                                                Cardano (ADA)
                                            </option>
                                            {/* we can add more options here*/}
                                        </select>
                                    </div>
                                    <div className="py-2">
                                        <button type="submit">
                                            Add Wallet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showNFTModal && (
                    <div className="modal">
                        <div className="modal-background">
                            <div className="modal-content">
                                <span
                                    className="modal-close-button"
                                    onClick={toggleNFTModal}
                                >
                                    &times;
                                </span>
                                <h2>Add NFT</h2>
                                <form onSubmit={handleAddNFT}>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder={`${selectedCurrency.charAt(0).toUpperCase() + selectedCurrency.slice(1)} Wallet Address`} // dynamically update placeholder text based off crypto type
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        required
                                    />
                                    <div className="py-2">
                                        <button type="submit">Add NFT</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    else return navigate('/login')
}

const NFTs = (props) => {
    const [nfts, setNFTs] = useState([])
    const jwtToken = localStorage.getItem('token') // the JWT token, if we have already received one and stored it in localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(jwtToken && true) // if we already have a JWT token in local storage, set this to true, otherwise false
    const user = isLoggedIn ? jwtDecode(jwtToken) : ' '

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/nfts/${user.email}`
                )
                const data = await response.json()
                if (Array.isArray(data)) {
                    setNFTs(data)
                } else {
                    console.error('Received data is not an array:', data)
                    setNFTs([])
                }
            } catch (error) {
                console.error('Error fetching nfts', error)
                setNFTs([])
            }
        }

        fetchNFTs()
    }, [])

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="mt-6 h-[20rem] overflow-y-auto px-4">
                <div className="overflow-y-auto">
                    {nfts.map((nft) => (
                        <ListItem image={nft.image} name={nft.name} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const ListItem = ({ image, name }) => (
        <button className="my-1 border-gray-300 block w-full rounded-lg bg-white from-pink-500 to-orange-500 p-5 text-black shadow-2xl hover:bg-gradient-to-r hover:text-white dark:bg-alt-blue dark:text-white ">
            {/* Content goes here */}

            <div className="flex flex-row">
                <div className="flex flex-col space-y-4">
                    <img src={image} />
                    <p className="font-bold">{name}</p>
                </div>
            </div>
        </button>
)


// Needed for charting
const RADIAN = Math.PI / 180
const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    name,
}) => {
    const radius = outerRadius + 10 // Label position outside the outerRadius
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <g>
            <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {name}
            </text>
            <text
                x={x}
                y={y + 20}
                fill="#fff"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(2)}%`}
            </text>
        </g>
    )
}

export default Portfolio
