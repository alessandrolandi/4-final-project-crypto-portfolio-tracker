import React from 'react'

const AddressModal = ({ isOpen, onClose, address }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="relative mx-2 w-full max-w-lg rounded-lg bg-white p-4 shadow-lg md:mx-0">
                <button
                    className="absolute right-0 top-0 border-none bg-transparent p-1 text-xl font-bold leading-none text-black"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h3 className="text-lg font-semibold">Address Details</h3>
                <p className="mt-2 text-sm text-gray-600">{address}</p>
            </div>
        </div>
    )
}

export default AddressModal
