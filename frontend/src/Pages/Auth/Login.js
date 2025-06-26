import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({ email: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = values;
  setLoading(true);
  
  // Frontend validation
  if (!email || !password) {
    toast.error("Please fill in both fields", toastOptions);
    setLoading(false);
    return;
  }

  console.log("Sending request with email:", email, "and password:", password); // Log request data

  try {
    const { data } = await axios.post(loginAPI, { email, password });

    console.log("Response from server:", data); // Log response data

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user)); // Consider HTTPOnly cookie for security
      navigate("/"); // Direct to dashboard or home
      toast.success(data.message, toastOptions);
    } else {
      toast.error(data.message, toastOptions);
    }
  } catch (err) {
    console.error(err.response?.data?.message || "Something went wrong!"); // Log error message
    toast.error(err.response?.data?.message || "Something went wrong!", toastOptions); // Improved error handling
  } finally {
    setLoading(false);
  }
};

  return (
<div
  className="d-flex align-items-center justify-content-center vh-100"
  style={{ backgroundColor: "#f1f3f6" }}
>
    <Row className="justify-content-center w-100">
        <Card className="border-0 shadow-lg rounded-4">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <AccountBalanceWalletIcon sx={{ fontSize: 48, color: "#0d6efd" }} />
              <h2 className="mt-3" style={{ fontWeight: "600" }}>
                Welcome Back
              </h2>
              <p className="text-muted small">Login to your wallet account</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className="fw-semibold">Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={values.email}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={values.password}
                  required
                  className="py-2"
                />
              </Form.Group>

              <div className="text-end mb-3">
                <Link to="/forgotPassword" className="text-decoration-none text-primary">
                  Forgot Password?
                </Link>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account?</span>{" "}
              <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                Register
              </Link>
            </div>
          </Card.Body>
        </Card>
    </Row>
    <ToastContainer />
</div>

  );
};

export default Login;
