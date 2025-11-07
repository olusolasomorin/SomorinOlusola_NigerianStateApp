import { useState } from "react";
// import '../App.css';
import { NavLink } from "react-router-dom";

function SignUp() {
    const [user_info, setUser_info] = useState({
        full_name: "",
        email: "",
        password_hash: ""
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [submit, setSubmit] = useState(false);


    function validate() {
        const newErrors = {};

        if (!user_info.full_name.trim()) {
            newErrors.full_name = "Name is required";
        } else if (user_info.full_name.length < 2) {
            newErrors.name = "Name must have at least 2 characters";
        }

        if (!user_info.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(user_info.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!user_info.password_hash) {
            newErrors.password_hash = 'Password is required';
        } else if (user_info.password_hash.length < 6) {
            newErrors.password_hash = "Password must have at least 6 characters";
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

            const response = await fetch("http://localhost:8000/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_info),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Signup failed. Please try again!");
            }

            setSubmit(true);
            setSuccess("Registration successful!");
            setUser_info({ full_name: "", email: "", password_hash: "" });

        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="input-container">
                <h1>Create an account</h1>
                <h5>Please sigup to continue</h5>

                <div className="email-container">
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={user_info.name}
                        onChange={handleChange}
                        placeholder="Enter your name here"
                    />
                    {errors.full_name && <p style={{ color: 'red', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'left'}}>{errors.full_name}</p>}
                </div>

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
                    {errors.password_hash && <p style={{ color: 'red', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'left'}}>{errors.password_hash}</p>}
                </div>

                <button className="sign-in" type="submit" disabled={loading}>
                    <NavLink to="/" className="nav-dash">
                        {loading ? "Signing up..." : "Sign up"}
                    </NavLink>
                </button>

                {apiError && <p style={{ color: 'green', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'center'}}>{apiError}</p>}
                {success && <p style={{ color: 'green', margin: 0, marginTop: 6, fontSize: 14, textAlign: 'center'}}>{success}</p>}

                <p>Already have an account? <span><NavLink to="/" className="navigate">Sign in</NavLink></span></p>
            </form>
        </div>
    )
}

export default SignUp;