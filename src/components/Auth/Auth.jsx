
import React, { useState } from "react";
import "./Auth.css";

export default function Auth() {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Connect your Spring Boot authentication API here
        console.log("Form submitted");
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
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
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


                                    <button className="submit-btn" type="submit">
                                        Sign in <span>→</span>
                                    </button>
                                </form>

                                <div className="switch-auth">
                                    Don't have an account?
                                    <button onClick={() => setIsRegister(true)}>
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
                                    
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="password-input">
                                            <input
                                                type={showPassword ? "text" : "password"}
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


                                    <button className="submit-btn" type="submit">
                                        Create account <span>→</span>
                                    </button>
                                </form>

                                <div className="switch-auth">
                                    Already have an account?
                                    <button onClick={() => setIsRegister(false)}>
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
