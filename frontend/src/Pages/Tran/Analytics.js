import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);



const categories = [
  "Groceries", "Rent", "Salary", "Tip", "Food", "Medical",
  "Utilities", "Entertainment", "Transportation", "Other"
];

const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#8AC926', '#6A4C93', '#1982C4', '#F45B69'
];

const Analytics = () => {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");

  // Set cUser from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setcUser(user);
    else navigate("/login");
  }, [navigate]);

  // Fetch transactions when dependencies change
  useEffect(() => {
    if (!cUser || !cUser._id) return;
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency,
          type,
        });
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, [cUser, frequency, type]);

  // Calculations
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(t => t.transactionType === "credit");
  const totalExpenseTransactions = transactions.filter(t => t.transactionType === "expense");
  const totalIncome = totalIncomeTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalExpense = totalExpenseTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  // Pie Chart Data
  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [totalIncome, totalExpense],
      backgroundColor: ["#4BC0C0", "#FF6384"],
      hoverBackgroundColor: ["#36A2EB", "#FF6384"]
    }]
  };

  // Bar Chart Data (Categorywise Expense)
  const categoryExpense = categories.map((cat, i) =>
    transactions.filter(t => t.transactionType === "expense" && t.category === cat)
      .reduce((acc, t) => acc + (t.amount || 0), 0)
  );
  const barData = {
    labels: categories,
    datasets: [{
      label: "Expense by Category",
      data: categoryExpense,
      backgroundColor: colors
    }]
  };

  // Line Chart Data (Monthly Trend)
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('default', { month: 'short' })
  );
  const incomeByMonth = Array(12).fill(0);
  const expenseByMonth = Array(12).fill(0);
  transactions.forEach(tx => {
    const month = new Date(tx.date).getMonth();
    if (tx.transactionType === "credit") incomeByMonth[month] += tx.amount || 0;
    if (tx.transactionType === "expense") expenseByMonth[month] += tx.amount || 0;
  });
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: incomeByMonth,
        borderColor: '#4BC0C0',
        backgroundColor: '#4BC0C0',
        fill: false,
        tension: 0.2
      },
      {
        label: 'Expense',
        data: expenseByMonth,
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        fill: false,
        tension: 0.2
      }
    ]
  };

  // Quick Stats
  const highestExpense = Math.max(...totalExpenseTransactions.map(tx => tx.amount || 0), 0);
  const highestIncome = Math.max(...totalIncomeTransactions.map(tx => tx.amount || 0), 0);

  // Filters
  const handleFrequencyChange = (e) => setFrequency(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);

  return (
    <div className="m-0 p-0">
      <Header />
      <Container className="mt-4 mb-4">
        <Row className="mb-3 m-3">
          <Col xs={12} md={6} lg={4} className="mb-2">
            <Form.Select value={frequency} onChange={handleFrequencyChange}>
              <option value="7">Last 1 week</option>
              <option value="30">Last 1 month</option>
              <option value="365">Last 1 year</option>
              <option value="custom">Custom</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={6} lg={4} className="mb-2">
            <Form.Select value={type} onChange={handleTypeChange}>
              <option value="all">All</option>
              <option value="credit">Income</option>
              <option value="expense">Expense</option>
            </Form.Select>
          </Col>
        </Row>
        <div className="m-2">
          <div className=" justify-content-center " style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <h4 className="text-center mt-4 mb-4">Analytics Overview</h4>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <Row className="mb-4 g-4" xs={1} md={3}>
                <Col>
                  <div className="card p-3 text-center h-100 w-100">
                    <h6>Total Transactions</h6>
                    <h3>{TotalTransactions}</h3>
                    <div className="d-flex justify-content-between mt-3 w-100">
                      <span className="text-success">
                        <ArrowDropUpIcon /> {totalIncomeTransactions.length}
                      </span>
                      <span className="text-danger">
                        <ArrowDropDownIcon /> {totalExpenseTransactions.length}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="card p-3 text-center h-100 w-100">
                    <h6>Highest Income</h6>
                    <h3 className="text-success">₹{highestIncome}</h3>
                  </div>
                </Col>
                <Col>
                  <div className="card p-3 text-center h-100 w-100">
                    <h6>Highest Expense</h6>
                    <h3 className="text-danger">₹{highestExpense}</h3>
                  </div>
                </Col>
              </Row>
              {/* Charts */}
              <Row className="mb-4 g-4" xs={1} md={2}>
                <Col>
                  <div className="card p-3 h-100 w-100">
                    <h6 className="text-center">Income vs Expense</h6>
                    <Pie data={pieData} />
                  </div>
                </Col>
                <Col>
                  <div className="card p-3 h-100 w-100">
                    <h6 className="text-center">Expense by Category</h6>
                    <Bar className="h-100" data={barData} options={{ plugins: { legend: { display: false } } }} />
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <div className="card p-3 h-100 w-100">
                    <h6 className="text-center">Monthly Trend</h6>
                    <Line data={lineData} />
                  </div>
                </Col>
              </Row>
              {/* Recent Transactions Table */}
              <Row>
                <Col>
                  <div className="card p-3 h-100 w-100">
                    <h6 className="text-center">Recent Transactions</h6>
                    <div className="table-responsive" style={{ maxHeight: 300, overflowY: "auto" }}>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice(0, 10).map(tx => (
                            <tr key={tx._id}>
                              <td>{new Date(tx.date).toLocaleDateString()}</td>
                              <td>{tx.title}</td>
                              <td>{tx.category}</td>
                              <td>{tx.transactionType}</td>
                              <td>₹{tx.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Analytics;