
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useAuthStore } from "../../stores/auth/useAuthStore";

export default function Auth() {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const isLoading = useAuthStore(state => state.isLoading);
    const error = useAuthStore(state => state.error);
    const success = useAuthStore(state => state.success);
    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);
    const clearMessages = useAuthStore(state => state.clearMessages);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const credentials = {
            username: formData.get("username").trim(),
            password: formData.get("password"),
        };

        const authenticated = isRegister
            ? await register(credentials)
            : await login(credentials);
        if (authenticated) navigate("/profile");
    };

    const switchMode = registerMode => {
        clearMessages();
        setIsRegister(registerMode);
    };

    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="glow glow-one"></div>
                <div className="glow glow-two"></div>
            </div>

            <div className="auth-container">

                {/* Left branding section */}
                <div className="auth-brand">
                    <div className="brand-logo">
                        <span className="logo-icon">J</span>
                        <span>jobmate</span>
                    </div>

                    <div className="brand-content">
                        <span className="brand-tag">YOUR CAREER, REIMAGINED</span>

                        <h1>
                            Find the work
                            <br />
                            <span>you deserve.</span>
                        </h1>

                        <p>
                            Discover opportunities, connect with the right people,
                            and take the next step in your career.
                        </p>

                        <div className="brand-features">
                            <div>✦ Discover relevant opportunities</div>
                            <div>✦ Build your professional profile</div>
                            <div>✦ Get closer to your dream job</div>
                        </div>
                    </div>

                    <div className="brand-footer">
                        © 2026 Jobmate. All rights reserved.
                    </div>
                </div>

                {/* Flip card section */}
                <div className="auth-form-section">
                    <div className={`flip-card ${isRegister ? "flipped" : ""}`}>
                        <div className="flip-card-inner">

                            {/* LOGIN */}
                            <div className="flip-card-front">
                                <div className="form-header">
                                    <span className="form-label">WELCOME BACK</span>
                                    <h2>Sign in</h2>
                                    <p>Enter your credentials to access your account.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {error && <p className="auth-message error-message" role="alert">{error}</p>}
                                    {success && <p className="auth-message success-message" role="status">{success}</p>}
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <div className="password-label">
                                            <label>Password</label>
                                            <a href="#">Forgot password?</a>
                                        </div>

                                        <div className="password-input">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>


                                    <button className="submit-btn" type="submit" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : <>Sign in <span>→</span></>}
                                    </button>
                                </form>

                                <div className="switch-auth">
                                    Don't have an account?
                                    <button type="button" onClick={() => switchMode(true)}>
                                        Create account
                                    </button>
                                </div>
                            </div>

                            {/* REGISTER */}
                            <div className="flip-card-back">
                                <div className="form-header">
                                    <span className="form-label">GET STARTED</span>
                                    <h2>Create account</h2>
                                    <p>Join Jobmate and start your career journey.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {error && <p className="auth-message error-message" role="alert">{error}</p>}
                                    {success && <p className="auth-message success-message" role="status">{success}</p>}
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="password-input">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Create a password"
                                                minLength={8}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>


                                    <button className="submit-btn" type="submit" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : <>Create account <span>→</span></>}
                                    </button>
                                </form>

                                <div className="switch-auth">
                                    Already have an account?
                                    <button type="button" onClick={() => switchMode(false)}>
                                        Sign in
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
