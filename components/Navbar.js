"use client"

import Image from "next/image";

const Navbar = () => {
    return (
        <header className="fixed top-0 w-full z-10">
            <nav className="flex sm:flex-row flex-col justify-center gap-2 sm:gap-0 items-center sm:justify-between bg-slate-800 text-white px-8 p-2 sm:p-4">
                <div className="logo text-xl font-bold flex items-center justify-center gap-1"><Image width={25} height={25} src="/money.png" alt="money-icon" /> Expense Tracker</div>
                <ul className="flex gap-4 font-semibold">
                    <li><button className="cursor-pointer" onClick={() => document.getElementById("home").scrollIntoView({ behavior: "smooth", block: "end" })}>Home</button></li>
                    <li className="whitespace-nowrap"><button className="cursor-pointer" onClick={() => document.getElementById("add-transaction").scrollIntoView({ behavior: "smooth", block: "center" })}>Add Transaction</button></li>
                    <li><button className="cursor-pointer" onClick={() => document.getElementById("history").scrollIntoView({ behavior: "smooth", block: "start" })}>History</button></li>
                    <li><button className="cursor-pointer" onClick={() => document.getElementById("chart").scrollIntoView({ behavior: "smooth", block: "start" })}>Chart</button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;