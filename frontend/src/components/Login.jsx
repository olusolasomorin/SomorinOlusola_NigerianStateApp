import { useState } from "react";
// import '../App.css';
import { NavLink } from "react-router-dom";

function Login() {
    const [user_info, setUser_info] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");


    function validate() {
        const newErrors = {};

        if (!user_info.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(user_info.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!user_info.password) {
            newErrors.password = 'Password is required';
        } 
        
        return newErrors;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setUser_info({
            ...user_info,
            [name]: value
        });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
        setApiError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});
            setSuccess("");

            const response = await fetch("http://localhost:8000/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_info),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Invalid email or password");
            }

            setSuccess("Login successful!");

        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <div className="login-container">

            <form onSubmit={handleSubmit} className="input-container">
                <h1>Welcome back</h1>
                <h5>Please sigin to continue</h5>

                <div className="email-container">
                    <label>Email address</label>
                    <input 
                        type="email"
                        name="email"
                        value={user_info.email}
                        onChange={handleChange}
                        placeholder="Enter your email here"
                    />
                    {errors.email && <p style={{ color: 'red', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'left'}}>{errors.email}</p>}
                </div>

                <div className="password-container">
                    <label>Password</label>
                    <input 
                        type="password"
                        name="password"
                        value={user_info.password}
                        onChange={handleChange}
                        placeholder="Enter your password here"
                    />
                    {errors.password && <p style={{ color: 'red', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'left'}}>{errors.password}</p>}
                </div>

                <button className="sign-in" type="submit" disabled={loading}>
                    <NavLink to="/dashboard" className="nav-dash">
                        {loading ? "Signing in..." : "Sign in"}
                    </NavLink>
                </button>

                {apiError && <p style={{ color: 'green', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'center'}}>{apiError}</p>}
                {success && <p style={{ color: 'green', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'center'}}>{success}</p>}

                <p>Don't have an account? <span><NavLink to="/signup" className="navigate">Sign up</NavLink></span></p>
            </form>
            
        </div>
    )
}

export default Login;