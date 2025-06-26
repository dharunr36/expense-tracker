// SignupPage.js
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button ,Card} from 'react-bootstrap';
import "./auth.css";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";
const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('user')){
      navigate('/');
    }
  }, [navigate]);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = values;
    setLoading(false);

    const { data } = await axios.post(registerAPI, {
      name,
      email,
      password,
    });

    if (data.success === true) {
      delete data.user.password;
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message, toastOptions);
      setLoading(true);
      navigate("/");
    } else {
      toast.error(data.message, toastOptions);
      setLoading(false);
    }
  };

  return (
<div
  className="d-flex align-items-center justify-content-center vh-100"
  style={{ backgroundColor: "#f1f3f6" }}
>
    <Row className="justify-content-center w-100">
        <Card className="border-0 shadow-lg rounded-4 mx-auto" style={{ maxWidth: "450px" }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <AccountBalanceWalletIcon sx={{ fontSize: 48, color: "#0d6efd" }} />
              <h2 className="mt-3 fw-semibold">Create Account</h2>
              <p className="text-muted small">Register to manage your expenses</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicName" className="mb-3">
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={values.name}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className="fw-semibold">Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={values.password}
                  onChange={handleChange}
                  required
                  className="py-2"
                />
              </Form.Group>

              <div className="text-end mb-3 ">
                <Link to="/forgotPassword" className="text-decoration-none text-primary fa-1x">
                  Forgot Password?
                </Link>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? "Registering..." : "Signup"}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">Already have an account?</span>{" "}
              <Link to="/login" className="text-decoration-none fw-semibold text-primary">
                Login
              </Link>
            </div>
          </Card.Body>
        </Card>
    </Row>
    <ToastContainer />
    
</div>

  );
};

export default Register;