import { asNumber, asText, joinList, splitList } from "./profileApi";

export const fromPersonal = value => ({
    id: value.id,
    fullName: value.fullName || "",
    email: value.email || "",
    phone: value.phone || "",
    location: value.location || "",
    linkedInUrl: value.linkedInUrl || "",
    githubUrl: value.githubUrl || "",
    portfolio: value.portfolio || "",
    profileSummary: value.profileSummary || "",
});

export const toPersonal = value => ({
    fullName: value.fullName,
    email: value.email,
    phone: value.phone || null,
    location: value.location || null,
    linkedInUrl: value.linkedInUrl || null,
    githubUrl: value.githubUrl || null,
    portfolio: value.portfolio || null,
    profileSummary: value.profileSummary || null,
});

export const fromEducation = value => ({
    id: value.id,
    degree: value.degree || "",
    specialization: value.specialization || "",
    college: value.college || "",
    location: asText(value.location),
    startYear: asText(value.startYear),
    endYear: asText(value.endYear),
    cgpa: asText(value.cgpa),
    pursuing: Boolean(value.pursuing),
});

export const toEducation = value => ({
    degree: value.degree,
    specialization: value.specialization || null,
    college: value.college,
    location: asNumber(value.location),
    startYear: asNumber(value.startYear),
    endYear: value.endYear || null,
    cgpa: asNumber(value.cgpa),
    pursuing: Boolean(value.pursuing),
});

const formatMonth = value => value ? value.slice(0, 7) : "";
const formatApiDate = value => (
    value && /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value || null
);

export const fromExperience = value => ({
    id: value.id,
    company: value.company || "",
    designation: value.designation || "",
    employmentType: value.employmentType || "",
    location: value.location || "",
    startDate: formatMonth(value.startDate),
    endDate: formatMonth(value.endDate),
    current: Boolean(value.currentlyWorking),
    responsibilities: value.achievements || (value.highlights || []).join("\n"),
    technologies: joinList(value.technologiesUsed),
});

export const toExperience = value => ({
    company: value.company,
    designation: value.designation,
    employmentType: value.employmentType,
    location: value.location || null,
    startDate: formatApiDate(value.startDate),
    endDate: value.current ? null : formatApiDate(value.endDate),
    currentlyWorking: Boolean(value.current),
    highlights: [],
    achievements: value.responsibilities || null,
    technologiesUsed: splitList(value.technologies),
});

export const fromSkill = value => ({
    id: value.id,
    name: value.name || "",
    proficiency: value.proficiency
        ? value.proficiency.charAt(0) + value.proficiency.slice(1).toLowerCase()
        : "Intermediate",
    years: asText(value.yearExperience),
});

export const toSkill = value => ({
    name: value.name,
    proficiency: value.proficiency.toUpperCase(),
    yearExperience: asNumber(value.years),
});

export const fromProject = value => ({
    id: value.id,
    name: value.name || "",
    description: value.description || "",
    technologies: joinList(value.technologiesUsed),
    githubUrl: value.githubUrl || "",
    liveUrl: value.liveUrl || "",
    contributions: (value.contributions || []).join("\n"),
});

export const toProject = value => ({
    name: value.name,
    description: value.description,
    technologiesUsed: splitList(value.technologies),
    githubUrl: value.githubUrl || null,
    liveUrl: value.liveUrl || null,
    contributions: splitList(value.contributions, /\n/),
});

export const fromJobPreferences = value => ({
    id: value.id,
    jobTitle: value.jobTitle || "",
    preferredLocations: joinList(value.preferredLocations),
    employmentType: value.employmentType || "Full-time",
    noticePeriod: asText(value.noticePeriod),
    relocate: Boolean(value.relocate),
    preferredExperienceLevel: asText(value.preferredExperienceLevel),
});

export const toJobPreferences = value => ({
    jobTitle: value.jobTitle,
    preferredLocations: splitList(value.preferredLocations),
    employmentType: value.employmentType,
    noticePeriod: asNumber(value.noticePeriod),
    relocate: Boolean(value.relocate),
    preferredExperienceLevel: asNumber(value.preferredExperienceLevel),
});

export const fromAdditionalInfo = value => ({
    id: value.id,
    yearsOfExperience: asText(value.yearsOfExperience),
    currentCTC: asText(value.currentCTC),
    expectedCTC: asText(value.expectedCTC),
    noticePeriod: asText(value.noticePeriod),
    certifications: (value.certifications || []).join("\n"),
});

export const toAdditionalInfo = value => ({
    yearsOfExperience: asNumber(value.yearsOfExperience),
    currentCTC: asNumber(value.currentCTC),
    expectedCTC: asNumber(value.expectedCTC),
    noticePeriod: asNumber(value.noticePeriod),
    certifications: splitList(value.certifications, /\n/),
});
