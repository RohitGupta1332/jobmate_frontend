
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import {
    initialEducationData,
    initialExperienceData,
    initialProjectData,
} from "../../stores/profile/profileDefaults";
import { usePersonalStore } from "../../stores/profile/usePersonalStore";
import { useEducationStore } from "../../stores/profile/useEducationStore";
import { useExperienceStore } from "../../stores/profile/useExperienceStore";
import { useSkillsStore } from "../../stores/profile/useSkillsStore";
import { useProjectsStore } from "../../stores/profile/useProjectsStore";
import { useJobPreferencesStore } from "../../stores/profile/useJobPreferencesStore";
import { useAdditionalInfoStore } from "../../stores/profile/useAdditionalInfoStore";
import { useResumeStore } from "../../stores/profile/useResumeStore";
import { useAuthStore } from "../../stores/auth/useAuthStore";

const sections = [
    { id: "overview", label: "Overview", icon: "⌂" },
    { id: "personal", label: "Personal Information", icon: "◉" },
    { id: "education", label: "Education", icon: "▤" },
    { id: "experience", label: "Experience", icon: "▣" },
    { id: "skills", label: "Skills", icon: "✳" },
    { id: "projects", label: "Projects", icon: "▧" },
    { id: "preferences", label: "Job Preferences", icon: "◎" },
    { id: "additional", label: "Additional Information", icon: "✦" },
    { id: "resume", label: "Resume", icon: "▤" },
];

function Profile() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("overview");
    const [skillInput, setSkillInput] = useState("");
    const personalStore = usePersonalStore();
    const educationStore = useEducationStore();
    const experienceStore = useExperienceStore();
    const skillsStore = useSkillsStore();
    const projectsStore = useProjectsStore();
    const preferencesStore = useJobPreferencesStore();
    const additionalStore = useAdditionalInfoStore();
    const resumeStore = useResumeStore();
    const logout = useAuthStore(state => state.logout);

    const personal = personalStore.data;
    const education = educationStore.data;
    const experience = experienceStore.data;
    const skills = skillsStore.data;
    const projects = projectsStore.data;
    const preferences = preferencesStore.data;
    const additional = additionalStore.data;
    const data = {
        personal, education, experience, skills, projects, preferences, additional,
    };
    const stores = {
        personal: personalStore,
        education: educationStore,
        experience: experienceStore,
        skills: skillsStore,
        projects: projectsStore,
        preferences: preferencesStore,
        additional: additionalStore,
        resume: resumeStore,
    };
    const isLoading = [
        personalStore.isLoading,
        educationStore.isLoading,
        experienceStore.isLoading,
        skillsStore.isLoading,
        projectsStore.isLoading,
        preferencesStore.isLoading,
        additionalStore.isLoading,
    ].some(Boolean);
    const activeStore = stores[activeSection] || null;
    const error = activeStore?.error || (
        activeSection === "overview"
            ? [
                personalStore.error,
                educationStore.error,
                experienceStore.error,
                skillsStore.error,
                projectsStore.error,
                preferencesStore.error,
                additionalStore.error,
            ].find(Boolean)
            : ""
    );
    const success = activeStore?.success || "";
    const isSaving = activeStore?.isSaving || false;

    useEffect(() => {
        Promise.all([
            usePersonalStore.getState().load(),
            useEducationStore.getState().load(),
            useExperienceStore.getState().load(),
            useSkillsStore.getState().load(),
            useProjectsStore.getState().load(),
            useJobPreferencesStore.getState().load(),
            useAdditionalInfoStore.getState().load(),
        ]);
    }, []);

    const updateField = (section, field, value) => {
        stores[section]?.setField(field, value);
    };

    const updateArray = (section, index, field, value) => {
        stores[section]?.updateItem(index, field, value);
    };

    const addEntry = (section, template) => {
        stores[section]?.addItem(template);
    };

    const removeEntry = (section, index) => {
        stores[section]?.removeItem(index);
    };

    const addSkill = (e) => {
        e.preventDefault();
        const value = skillInput.trim();

        if (value && !skills.some(skill => (
            skill.name.toLowerCase() === value.toLowerCase()
        ))) {
            skillsStore.addItem({
                name: value,
                proficiency: "Intermediate",
                years: "",
            });
        }
        setSkillInput("");
    };

    const saveProfile = async () => {
        await stores[activeSection]?.save();
    };

    const updateSkill = (index, field, value) => {
        skillsStore.updateItem(index, field, value);
    };

    const removeSkill = index => skillsStore.removeItem(index);

    const calculateProgress = () => {
        const fields = [
            data.personal.fullName,
            data.personal.email,
            data.personal.phone,
            data.personal.profileSummary,
            data.personal.location,
            data.education[0]?.degree,
            data.education[0]?.college,
            data.experience[0]?.company,
            data.experience[0]?.designation,
            data.skills.length > 0,
            data.projects[0]?.name,
            data.preferences.jobTitle,
            resumeStore.resumes.length > 0,
        ];

        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    };

    const progress = calculateProgress();

    const currentSection = sections.find(
        item => item.id === activeSection
    );

    const goTo = (section) => {
        setActiveSection(section);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderField = (
        label,
        value,
        onChange,
        placeholder = "",
        type = "text"
    ) => (
        <div className="profile-field">
            <label>{label}</label>
            <input
                type={type}
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    const renderTextarea = (label, value, onChange, placeholder) => (
        <div className="profile-field full-width">
            <label>{label}</label>
            <textarea
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
            />
        </div>
    );

    const renderSelect = (label, value, onChange, options) => (
        <div className="profile-field">
            <label>{label}</label>
            <select
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
            >
                <option value="">Select {label}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );

    const renderHeading = (title, description) => (
        <div className="section-heading">
            <div>
                <span className="section-eyebrow">YOUR PROFILE</span>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );

    const renderPersonal = () => (
        <>
            {renderHeading("Personal information",
                "Tell us a little about yourself.")}

            <div className="profile-card">
                <h3>Basic details</h3>
                <p className="card-description">
                    Your contact information and professional identity.
                </p>

                <div className="profile-grid">
                    {renderField("Full name", data.personal.fullName,
                        v => updateField("personal", "fullName", v),
                        "Enter your full name")}

                    {renderField("Email address", data.personal.email,
                        v => updateField("personal", "email", v),
                        "you@example.com", "email")}

                    {renderField("Phone number", data.personal.phone,
                        v => updateField("personal", "phone", v),
                        "+91 98765 43210", "tel")}

                    {renderField("Location", data.personal.location,
                        v => updateField("personal", "location", v),
                        "City, State, Country")}
                </div>
            </div>

            <div className="profile-card">
                <h3>Professional presence</h3>
                <p className="card-description">
                    Add links to your professional profiles.
                </p>

                <div className="profile-grid">
                    {renderField("LinkedIn URL", data.personal.linkedInUrl,
                        v => updateField("personal", "linkedInUrl", v),
                        "https://linkedin.com/in/username")}

                    {renderField("GitHub URL", data.personal.githubUrl,
                        v => updateField("personal", "githubUrl", v),
                        "https://github.com/username")}

                    {renderField("Portfolio URL", data.personal.portfolio,
                        v => updateField("personal", "portfolio", v),
                        "https://yourportfolio.com")}
                </div>

                {renderTextarea("Professional summary",
                data.personal.profileSummary,
                v => updateField("personal", "profileSummary", v),
                    "Write a brief introduction about your experience, skills and career goals...")}
            </div>
        </>
    );

    const renderEducation = () => (
        <>
            {renderHeading("Education",
                "Add your academic qualifications.")}

            {data.education.map((edu, index) => (
                <div className="profile-card" key={index}>
                    <div className="card-top">
                        <div>
                            <h3>Education #{index + 1}</h3>
                            <p className="card-description">
                                Academic qualification details
                            </p>
                        </div>

                        {(data.education.length > 1 || edu.id != null) && (
                            <button className="remove-btn"
                                onClick={() => removeEntry("education", index)}>
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="profile-grid">
                        {renderSelect("Degree", edu.degree,
                            v => updateArray("education", index, "degree", v),
                            ["BCA", "B.Tech", "B.E.", "MCA", "M.Tech",
                                "B.Sc", "M.Sc", "MBA", "Other"])}

                        {renderField("Specialization", edu.specialization,
                            v => updateArray("education", index, "specialization", v),
                            "e.g. Computer Science")}

                        {renderField("College / University", edu.college,
                            v => updateArray("education", index, "college", v),
                            "Institution name")}

                        {renderField("Location", edu.location,
                            v => updateArray("education", index, "location", v),
                            "City, State, Country", "text")}

                        {renderField("Start year", edu.startYear,
                            v => updateArray("education", index, "startYear", v),
                            "2022", "number")}

                        {renderField("End year", edu.endYear,
                            v => updateArray("education", index, "endYear", v),
                            "2025", "number")}

                        {renderField("CGPA", edu.cgpa,
                            v => updateArray("education", index, "cgpa", v),
                            "e.g. 8.5", "number")}
                    </div>

                    <label className="profile-checkbox">
                        <input type="checkbox"
                            checked={edu.pursuing}
                            onChange={e => updateArray(
                                "education", index, "pursuing", e.target.checked
                            )} />
                        Currently pursuing this degree
                    </label>
                </div>
            ))}

            <button className="add-entry-btn"
                onClick={() => addEntry("education", initialEducationData[0])}>
                + Add another education
            </button>
        </>
    );

    const renderExperience = () => (
        <>
            {renderHeading("Work experience",
                "Showcase your professional journey and achievements.")}

            {data.experience.map((exp, index) => (
                <div className="profile-card" key={index}>
                    <div className="card-top">
                        <div>
                            <h3>Experience #{index + 1}</h3>
                            <p className="card-description">
                                Your employment details
                            </p>
                        </div>
                        {(data.experience.length > 1 || exp.id != null) && (
                            <button className="remove-btn"
                                onClick={() => removeEntry("experience", index)}>
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="profile-grid">
                        {renderField("Company name", exp.company,
                            v => updateArray("experience", index, "company", v),
                            "Company name")}

                        {renderField("Job title / Designation", exp.designation,
                            v => updateArray("experience", index, "designation", v),
                            "e.g. Software Engineer")}

                        {renderSelect("Employment type", exp.employmentType,
                            v => updateArray("experience", index, "employmentType", v),
                            ["Full-time", "Part-time", "Internship", "Contract",
                                "Freelance"])}

                        {renderField("Location", exp.location,
                            v => updateArray("experience", index, "location", v),
                            "City, Country")}

                        {renderField("Start date", exp.startDate,
                            v => updateArray("experience", index, "startDate", v),
                            "", "month")}

                        {!exp.current && renderField("End date", exp.endDate,
                            v => updateArray("experience", index, "endDate", v),
                            "", "month")}
                    </div>

                    <label className="profile-checkbox">
                        <input type="checkbox"
                            checked={exp.current}
                            onChange={e => updateArray(
                                "experience", index, "current", e.target.checked
                            )} />
                        I currently work here
                    </label>

                    {renderTextarea("Responsibilities & achievements",
                        exp.responsibilities,
                        v => updateArray("experience", index, "responsibilities", v),
                        "Describe your responsibilities, contributions and measurable achievements...")}

                    {renderField("Technologies used", exp.technologies,
                        v => updateArray("experience", index, "technologies", v),
                        "Java, Spring Boot, React, PostgreSQL")}
                </div>
            ))}

            <button className="add-entry-btn"
                onClick={() => addEntry("experience", initialExperienceData[0])}>
                + Add another experience
            </button>
        </>
    );

    const renderSkills = () => (
        <>
            {renderHeading("Skills",
                "Add the technologies and skills you work with.")}

            <div className="profile-card">
                <h3>Your technical skills</h3>
                <p className="card-description">
                    Add individual skills and specify your proficiency.
                </p>

                <form className="skill-add-form" onSubmit={addSkill}>
                    <input
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        placeholder="e.g. Java, Spring Boot, React..."
                    />
                    <button type="submit" className="submit-btn">
                        + Add skill
                    </button>
                </form>

                {data.skills.length === 0 ? (
                    <div className="empty-state">
                        No skills added yet. Start adding your skills above.
                    </div>
                ) : (
                    <div className="skill-list">
                        {data.skills.map((skill, index) => (
                            <div className="skill-item" key={index}>
                                <div className="skill-name">{skill.name}</div>

                                <select
                                    value={skill.proficiency}
                                    onChange={e => updateSkill(
                                        index, "proficiency", e.target.value
                                    )}
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Expert</option>
                                </select>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    placeholder="Years"
                                    value={skill.years}
                                    onChange={e => updateSkill(
                                        index, "years", e.target.value
                                    )}
                                />

                                <button className="remove-btn"
                                    onClick={() => removeSkill(index)}>
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    const renderProjects = () => (
        <>
            {renderHeading("Projects",
                "Highlight projects that demonstrate your abilities.")}

            {data.projects.map((project, index) => (
                <div className="profile-card" key={index}>
                    <div className="card-top">
                        <div>
                            <h3>Project #{index + 1}</h3>
                            <p className="card-description">
                                Project overview and contributions
                            </p>
                        </div>

                        {(data.projects.length > 1 || project.id != null) && (
                            <button className="remove-btn"
                                onClick={() => removeEntry("projects", index)}>
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="profile-grid">
                        {renderField("Project name", project.name,
                            v => updateArray("projects", index, "name", v),
                            "Project name")}

                        {renderField("Technologies", project.technologies,
                            v => updateArray("projects", index, "technologies", v),
                            "React, Django, PostgreSQL")}

                        {renderField("GitHub URL", project.githubUrl,
                            v => updateArray("projects", index, "githubUrl", v),
                            "GitHub repository URL")}

                        {renderField("Live URL", project.liveUrl,
                            v => updateArray("projects", index, "liveUrl", v),
                            "Deployed project URL")}
                    </div>

                    {renderTextarea("Project description", project.description,
                        v => updateArray("projects", index, "description", v),
                        "What does this project do? What problem does it solve?")}

                    {renderTextarea("Your contributions", project.contributions,
                        v => updateArray("projects", index, "contributions", v),
                        "Describe your role, implementation and key contributions...")}
                </div>
            ))}

            <button className="add-entry-btn"
                onClick={() => addEntry("projects", initialProjectData[0])}>
                + Add another project
            </button>
        </>
    );

    const renderPreferences = () => (
        <>
            {renderHeading("Job preferences",
                "Help us find opportunities that match your goals.")}

            <div className="profile-card">
                <h3>Career preferences</h3>
                <p className="card-description">
                    What kind of opportunity are you looking for?
                </p>

                <div className="profile-grid">
                    {renderField("Preferred job roles",
                        data.preferences.jobTitle,
                        v => updateField("preferences", "jobTitle", v),
                        "Backend Developer, SDE 1")}

                    {renderField("Preferred locations",
                        data.preferences.preferredLocations,
                        v => updateField("preferences", "preferredLocations", v),
                        "Bangalore, Chennai, Remote")}

                    {renderSelect("Employment type",
                        data.preferences.employmentType,
                        v => updateField("preferences", "employmentType", v),
                        ["Full-time", "Part-time", "Contract", "Internship"])}

                    {renderField("Notice period (days)",
                        data.preferences.noticePeriod,
                        v => updateField("preferences", "noticePeriod", v),
                        "e.g. 30", "number")}

                    {renderField("Preferred experience level (years)",
                        data.preferences.preferredExperienceLevel,
                        v => updateField(
                            "preferences", "preferredExperienceLevel", v
                        ),
                        "e.g. 2", "number")}
                </div>

                <label className="profile-checkbox">
                    <input type="checkbox"
                        checked={data.preferences.relocate}
                        onChange={e => updateField(
                            "preferences", "relocate", e.target.checked
                        )} />
                    Willing to relocate
                </label>
            </div>
        </>
    );

    const renderAdditional = () => (
        <>
            {renderHeading("Additional information",
                "A few more details to complete your professional profile.")}

            <div className="profile-card">
                <h3>Professional details</h3>

                <div className="profile-grid">
                    {renderField("Total experience (years)",
                        data.additional.yearsOfExperience,
                        v => updateField("additional", "yearsOfExperience", v),
                        "e.g. 1.5", "number")}

                    {renderField("Current CTC (LPA)",
                        data.additional.currentCTC,
                        v => updateField("additional", "currentCTC", v),
                        "e.g. 4.5", "number")}

                    {renderField("Expected CTC (LPA)",
                        data.additional.expectedCTC,
                        v => updateField("additional", "expectedCTC", v),
                        "e.g. 8", "number")}
                </div>
            </div>

            <div className="profile-card">
                <h3>Certifications</h3>
                {renderTextarea("Certifications",
                    data.additional.certifications,
                    v => updateField("additional", "certifications", v),
                    "Add one certification per line.")}
            </div>
        </>
    );

    const renderResume = () => (
        <>
            {renderHeading("Resume",
                "Upload your latest resume to get started with relevant jobs.")}

            <div className="profile-card">
                <h3>Your primary resume</h3>
                <p className="card-description">
                    Upload a PDF file. Maximum 5 MB.
                </p>

                <label className="resume-upload">
                    <div className="upload-icon">↑</div>
                    <h3>{resumeStore.isUploading ? "Uploading..." : "Upload your resume"}</h3>
                    <p>Drag and drop or click to browse</p>
                    <span>PDF · Maximum 5 MB</span>
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={resumeStore.isUploading}
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.type !== "application/pdf" &&
                                !file.name.toLowerCase().endsWith(".pdf")) {
                                resumeStore.setError("Please select a PDF file.");
                                e.target.value = "";
                                return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                                resumeStore.setError("File must be smaller than 5 MB.");
                                e.target.value = "";
                                return;
                            }
                            resumeStore.upload(file);
                            e.target.value = "";
                        }}
                    />
                </label>

                {resumeStore.resumes.map(resume => (
                    <div className="uploaded-file" key={resume.id}>
                        <span>▤</span>
                        <div>
                            <strong>{resume.fileName}</strong>
                            {resume.fileUrl && (
                                <p>
                                    <a href={resume.fileUrl} target="_blank" rel="noreferrer">
                                        View resume
                                    </a>
                                </p>
                            )}
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => resumeStore.remove(resume.id)}
                            disabled={resumeStore.deletingId === resume.id}
                        >
                            {resumeStore.deletingId === resume.id ? "Deleting..." : "Remove"}
                        </button>
                    </div>
                ))}

                {resumeStore.resumes.length === 0 && (
                    <p className="card-description">
                        No resumes uploaded during this session.
                    </p>
                )}
            </div>
        </>
    );

    const renderOverview = () => (
        <>
            {renderHeading("Your profile",
                "Manage your professional identity in one place.")}

            <div className="profile-welcome">
                <div>
                    <span className="section-eyebrow">JOBMATE PROFILE</span>
                    <h2>Build your professional story.</h2>
                    <p>
                        Complete your profile to help us find opportunities
                        that match your skills and experience.
                    </p>
                    <button className="submit-btn"
                        onClick={() => goTo("personal")}>
                        Complete profile →
                    </button>
                </div>
                <div className="welcome-decoration">J</div>
            </div>

            <div className="profile-card progress-card">
                <div className="card-top">
                    <div>
                        <h3>Profile completion</h3>
                        <p className="card-description">
                            Complete more sections to build a stronger profile.
                        </p>
                    </div>
                    <strong className="progress-number">{progress}%</strong>
                </div>
                <div className="progress-track">
                    <div style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="overview-grid">
                {sections.slice(1).map((section, index) => (
                    <button className="overview-item"
                        key={section.id}
                        onClick={() => goTo(section.id)}>
                        <span className="overview-icon">{section.icon}</span>
                        <div>
                            <h3>{section.label}</h3>
                            <p>{index === 0 ? "Your basic details and links" :
                                index === 1 ? "Academic qualifications" :
                                    index === 2 ? "Professional journey" :
                                        index === 3 ? "Technical expertise" :
                                            index === 4 ? "Your best work" :
                                                index === 5 ? "Your career goals" :
                                                    index === 6 ? "Other professional details" :
                                                        "Upload your latest resume"}</p>
                        </div>
                        <span className="overview-arrow">→</span>
                    </button>
                ))}
            </div>
        </>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "overview": return renderOverview();
            case "personal": return renderPersonal();
            case "education": return renderEducation();
            case "experience": return renderExperience();
            case "skills": return renderSkills();
            case "projects": return renderProjects();
            case "preferences": return renderPreferences();
            case "additional": return renderAdditional();
            case "resume": return renderResume();
            default: return renderOverview();
        }
    };

    return (
        <div className="profile-page">
            <aside className="profile-sidebar">
                <div className="profile-brand">
                    <span className="logo-icon">J</span>
                    <span>jobmate</span>
                </div>

                <div className="sidebar-profile">
                    <div className="avatar">
                        {data.personal.fullName
                            ? data.personal.fullName.charAt(0).toUpperCase()
                            : "U"}
                    </div>
                    <div>
                        <h3>{data.personal.fullName || "Your profile"}</h3>
                        <p>Job seeker</p>
                    </div>
                </div>

                <span className="sidebar-label">WORKSPACE</span>

                <nav className="sidebar-nav">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            className={activeSection === section.id ? "active" : ""}
                            onClick={() => goTo(section.id)}
                        >
                            <span className="nav-icon">{section.icon}</span>
                            {section.label}
                            {activeSection === section.id &&
                                <span className="active-dot" />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="sidebar-progress">
                        <div className="card-top">
                            <span>Profile strength</span>
                            <strong>{progress}%</strong>
                        </div>
                        <div className="progress-track">
                            <div style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <button className="sidebar-logout"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}>
                        ↗ Sign out
                    </button>
                </div>
            </aside>

            <main className="profile-main">
                <header className="profile-topbar">
                    <div>
                        <span>Workspace / </span>
                        <strong>{currentSection?.label}</strong>
                    </div>

                    <div className="topbar-right">
                        <span className="profile-status">
                            <span /> Profile setup
                        </span>
                        <div className="avatar small-avatar">
                            {data.personal.fullName
                                ? data.personal.fullName.charAt(0).toUpperCase()
                                : "U"}
                        </div>
                    </div>
                </header>

                <div className="profile-content">
                    {isLoading && (
                        <p className="profile-message" role="status">
                            Loading your profile...
                        </p>
                    )}
                    {error && (
                        <p className="profile-message error-message" role="alert">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="profile-message success-message" role="status">
                            {success}
                        </p>
                    )}
                    {renderContent()}

                    {activeSection !== "overview" && (
                        <div className="profile-actions">
                            <button className="back-btn"
                                onClick={() => goTo("overview")}>
                                ← Back to overview
                            </button>

                            {activeSection !== "resume" && (
                                <button
                                    className="submit-btn save-profile-btn"
                                    onClick={saveProfile}
                                    disabled={isLoading || isSaving || resumeStore.isUploading}
                                >
                                    {isSaving ? "Saving..." : "Save changes →"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Profile;
