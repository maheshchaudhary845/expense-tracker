"use client"
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [form, setForm] = useState({ description: "", category: "", transactionType: "", amount: "" })
  const [transactions, setTransactions] = useState([])
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/")
    const [dayB, monthB, yearB] = b.date.split("/")

    const dateA = new Date(yearA, monthA - 1, dayA)
    const dateB = new Date(yearB, monthB - 1, dayB)
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const transactionData = localStorage.getItem("transactions");
    if (transactionData) {
      setTransactions(JSON.parse(transactionData));
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !form.description || !form.category || !form.amount) {
      alert("Please fill all fields")
      return;
    }

    const newTransaction = {
      id: Date.now(),
      date: date.toLocaleDateString("en-IN"),
      month: MONTHS[date.getMonth()],
      year: date.getFullYear(),
      description: form.description,
      category: form.category,
      transactionType: form.transactionType,
      amount: Number(form.transactionType === "income" ? form.amount : -form.amount),
    }
    setTransactions([...transactions, newTransaction])
    if (transactions) {
      toast.success("Transaction added successfully!")
    }

    setForm({ description: "", category: "", transactionType: "", amount: "" })
    setDate(new Date())
    return;
  }

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const pieData = transactions.map((e, index) => {
    return { name: e.category, value: Math.abs(e.amount) }
  })

  const COLORS = ["#FF5733", "#33B5FF", "#8E44AD", "#2ECC71", "#F1C40F", "#E67E22", "#34495E"];


  function monthlyExpenses() {
    const totals = {}
    transactions.map((transaction) => {
      const key = `${transaction.month}-${transaction.transactionType}`;
      totals[key] = (totals[key] || 0) + transaction.amount;
    })
    return totals;
  }
  const totals = monthlyExpenses();
  const months = MONTHS;

  const bardata = months.map(month => {
    return {
      month,
      income: totals[`${month}-income`],
      expense: totals[`${month}-expense`]
    }
  })

  const balance = transactions.reduce((sum, e) => sum + e.amount, 0)
  const income = transactions.filter(transaction => transaction.transactionType == "income").reduce((sum, e) => sum + e.amount, 0)
  const expense = transactions.filter(transaction => transaction.transactionType == "expense").reduce((sum, e) => sum + e.amount, 0)

  return (
    <main className="min-h-[calc(100vh-60px)] mt-[80px] sm:mt-[70px]">
      <ToastContainer />
      <section className="max-w-7xl mx-auto mb-10">
        <div id="home">
          <h1 className="text-3xl sm:text-4xl text-center font-bold text-gray-900 my-4 mb-8 ">Expense Tracker</h1>
        </div>
        <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full">
          <div className="flex flex-col border border-gray-200 py-6 pt-4 px-8 gap-4 shadow-md bg-white">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">Balance <span className="text-green-700">₹{balance}</span></h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <h3 className="text-lg sm:text-xl text-gray-800 font-semibold">INCOME</h3>
                <div className="text-xl font-medium text-green-700">₹{income}</div>
              </div>
              <div className="verticalLine h-14 w-0.5 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg sm:text-xl text-gray-800 font-semibold">EXPENSE</h3>
                <div className="text-xl font-medium text-red-700">₹{expense}</div>
              </div>
            </div>
          </div>
          <div id="add-transaction" className="flex flex-col border border-gray-200 py-6 px-2 bg-white shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center my-2">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="flex flex-col  gap-3 max-w-lg mx-auto w-full">
              <div className="flex flex-col">
                <label htmlFor="date" className="text-gray-800 font-medium">Choose a Date</label>
                <DatePicker
                  id="date"
                  selected={date}
                  onChange={(newDate) => setDate(newDate)}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  className="my-date-input w-full border border-gray-400 p-1 rounded-sm cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="text-gray-800 font-medium">Description</label>
                <input value={form.description} onChange={handleChange} className="border border-gray-400 rounded-sm p-1" id="description" name="description" type="text" placeholder="Enter a Description (e.g., “Bought groceries”, “Salary”)" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category" className="text-gray-800 font-medium">Choose a Category</label>
                <select value={form.category} onChange={handleChange} name="category" id="category" className="p-1 border border-gray-400 rounded-sm">
                  <option value="">Select Category</option>
                  <option value="Salary/Income">Salary / Income</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills &amp; Utilities">Bills &amp; Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <div className="text-gray-800 font-medium">Transaction Type</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <input type="radio" name="transactionType" id="income" required value="income" checked={form.transactionType === "income"} onChange={handleChange} />
                    <label htmlFor="income" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#454545" fill="none">
                        <path d="M12.001 5.00003V19.002" stroke="#454545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M19.002 12.002L4.99998 12.002" stroke="#454545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg><span>Income</span></label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input type="radio" name="transactionType" id="expense" value="expense" checked={form.transactionType === "expense"} onChange={handleChange} />
                    <label htmlFor="expense" className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#454545" fill="none">
                        <path d="M20 12L4 12" stroke="#454545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <span>Expense</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="amount" className="text-gray-800 font-medium">Amount</label>
                <input value={form.amount} onChange={handleChange} className="border border-gray-400 rounded-sm p-1" id="amount" name="amount" type="text" placeholder="Enter Amount" />
              </div>
              <input type="submit" className="p-1 bg-green-700 rounded-lg cursor-pointer text-white hover:bg-green-800" value="Add Transaction" />
            </form>
          </div>
          <div id="history" className="flex flex-col border border-gray-200 py-6 bg-white shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">Transaction History</h2>
            {transactions.length !== 0 ? <>
              <div className="flex justify-end px-4 mb-4">
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  Sort: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </button>
              </div>
              <div className="flex sm:hidden flex-col gap-4">
                {sortedTransactions.map((item, index) => {
                  return <div key={item.id} className="flex flex-col justify-center gap-1 bg-slate-100 border-1 mx-4 rounded-lg border-gray-500 p-4">
                    <div className="font-bold">Date: <span className="text-gray-900 font-normal">{item.date}</span></div>
                    <div className="font-bold">Description: <span className="text-gray-900 font-normal">{item.description}</span></div>
                    <div className="font-bold">Category: <span className="text-gray-900 font-normal">{item.category}</span></div>
                    <div className="font-bold">Amount: <span className="text-gray-900 font-normal">{item.amount}</span></div>
                    <div className="font-bold flex justify-center"><span className="flex justify-center items-center gap-4">
                      <span className="flex items-center justify-center gap-1 p-1 px-3 bg-gray-200 rounded-full cursor-pointer text-gray-800"
                        onClick={() => {
                          setForm({ description: item.description, category: item.category, transactionType: item.transactionType, amount: Math.abs(item.amount) });
                          // Converting to date object
                          const [day, month, year] = item.date.split("/");
                          setDate(new Date(year, month - 1, day));
                          setTransactions(transactions.filter((e, i) => i !== index))
                          // Scroll Effect
                          document.getElementById("add-transaction").scrollIntoView({ behavior: "smooth", block: "end" })
                        }}>
                        Edit
                        <lord-icon
                          src="https://cdn.lordicon.com/exymduqj.json"
                          trigger="hover"
                          state="hover-line"
                          title="Edit"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </span>
                      <span className="flex items-center justify-center gap-1 p-1 px-3 bg-red-400 rounded-full cursor-pointer text-gray-800"
                        onClick={() => {
                          const verify = confirm("Are you sure to delete the transaction?")
                          if (verify) {
                            setTransactions(transactions.filter((e, i) => i !== index))
                            toast.success("Deleted successfully!")
                          }
                        }
                        }
                      >
                        Delete
                        <lord-icon
                          src="https://cdn.lordicon.com/jzinekkv.json"
                          trigger="hover"
                          title="Delete"
                          style={{ width: "25px", height: "25px" }}>
                        </lord-icon>
                      </span>
                    </span></div>
                  </div>
                })
                }
              </div>
              <table className="hidden sm:block border-collapse border border-gray-300 mx-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Description</th>
                    <th className="border border-gray-300 px-4 py-2">Category</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction, index) => {
                    return (
                      <tr key={transaction.id}>
                        <td className="text-center border border-gray-300 px-2 py-1">{transaction.date}</td>
                        <td className="text-center border border-gray-300 px-2 py-1">{transaction.description}</td>
                        <td className="text-center border border-gray-300 px-2 py-1">{transaction.category}</td>
                        <td className="text-center border border-gray-300 px-2 py-1">{transaction.amount}</td>
                        <td className="text-center border border-gray-300 px-2 py-1">
                          <span className="flex justify-center items-center gap-2">
                            <span onClick={() => {
                              // Scroll Effect
                              document.getElementById("add-transaction")?.scrollIntoView({ behavior: "smooth", block: "center" })

                              setForm({ description: transaction.description, category: transaction.category, transactionType: transaction.transactionType, amount: Math.abs(transaction.amount) });
                              // Converting to date object
                              const [day, month, year] = transaction.date.split("/");
                              setDate(new Date(year, month - 1, day));
                              setTransactions(transactions.filter((e, i) => i !== index))
                            }}>
                              <lord-icon
                                src="https://cdn.lordicon.com/exymduqj.json"
                                trigger="hover"
                                state="hover-line"
                                className="cursor-pointer"
                                title="Edit"
                                style={{ width: "25px", height: "25px" }}>
                              </lord-icon>
                            </span>
                            <span onClick={() => {
                              const verify = confirm("Are you sure to delete the transaction?")
                              if (verify) {
                                setTransactions(transactions.filter((e, i) => i !== index))
                                toast.success("Deleted successfully!")
                              }
                            }
                            }
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/jzinekkv.json"
                                trigger="hover"
                                className="cursor-pointer"
                                title="Delete"
                                style={{ width: "25px", height: "25px" }}>
                              </lord-icon>
                            </span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}

                </tbody>
              </table>
            </>
              :
              <div className="text-gray-800 text-center">No data to show!</div>
            }
          </div>
          <div id="chart" className="flex flex-col border border-gray-200 py-6 bg-white shadow-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center my-2">Chart</h2>
            {transactions.length !== 0 ? <div className="charts flex flex-col gap-10 justify-center items-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart data={pieData}>
                  <Pie
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={bardata}>
                  <CartesianGrid strokeDasharray="2" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" tick={{ fontSize: 14 }} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#4CAF50" />
                  <Bar dataKey="expense" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
              :
              <div className="text-gray-800 text-center">No data to show!</div>
            }
          </div>
        </div>
      </section>
    </main>
  );
}