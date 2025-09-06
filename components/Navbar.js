"use client"
const Navbar = ()=>{
    return(
        <header className="fixed top-0 w-full z-10">
            <nav className="flex sm:flex-row flex-col justify-center gap-2 sm:gap-0 items-center sm:justify-between bg-slate-800 text-white px-8 p-2 sm:p-4">
                <div className="logo text-xl font-bold">💰Expense Tracker</div>
                <ul className="flex gap-4 font-semibold">
                    <li className="cursor-pointer"><button onClick={()=>document.getElementById("home").scrollIntoView({behavior: "smooth"})}>Home</button></li>
                    <li className="cursor-pointer whitespace-nowrap"><button onClick={()=>document.getElementById("add-transaction").scrollIntoView({behavior: "smooth"})}>Add Transaction</button></li>
                    <li className="cursor-pointer"><button onClick={()=>document.getElementById("history").scrollIntoView({behavior: "smooth"})}>History</button></li>
                    <li className="cursor-pointer"><button onClick={()=>document.getElementById("chart").scrollIntoView({behavior: "smooth"})}>Chart</button></li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;