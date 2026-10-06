const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env from both backend and project root
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });

// Cloudinary Configuration
let cloudinary = null;
try {
    cloudinary = require('cloudinary').v2;
    if (process.env.CLOUDINARY_URL) {
        cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
        console.log("Cloudinary initialized via CLOUDINARY_URL!");
    } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log("Cloudinary initialized via credentials!");
    }
} catch (e) {
    console.warn("Cloudinary initialization skipped:", e.message);
}

// Nodemailer Configuration (Instant Email Notifications)
let nodemailer = null;
try {
    nodemailer = require('nodemailer');
} catch (e) {
    console.warn("Nodemailer initialization skipped:", e.message);
}

const sendContactNotificationEmail = async ({ name, email, message }) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || emailUser;

    if (!nodemailer || !emailUser || !emailPass) {
        console.log("ℹ️  Email notification skipped: nodemailer or EMAIL_USER/EMAIL_PASS not configured.");
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        const formattedTime = new Date().toLocaleString('ar-EG', {
            timeZone: 'Africa/Cairo',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const mailOptions = {
            from: `"Zizo.dev Portfolio" <${emailUser}>`,
            to: emailTo,
            replyTo: email,
            subject: `🚀 رسالة جديدة في الموقع من: ${name}`,
            text: `تم استلام رسالة جديدة في موقعك zizo.dev:\n\nالاسم: ${name}\nالبريد: ${email}\nالوقت: ${formattedTime}\n\nنص الرسالة:\n${message}`,
            html: `
            <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #f1f5f9; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="border-bottom: 1px solid #1e293b; padding-bottom: 18px; margin-bottom: 22px;">
                    <span style="display: inline-block; background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-bottom: 10px;">إشعار رسالة جديدة</span>
                    <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">📬 وصلتك رسالة تواصل جديدة!</h2>
                    <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">قام زائر بإرسال استفسار عبر نموذج التواصل في موقعك الشخصي zizo.dev</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; font-size: 14px;">
                    <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="padding: 10px 0; color: #94a3b8; width: 110px;">👤 <strong>الاسم:</strong></td>
                        <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #1e293b;">
                        <td style="padding: 10px 0; color: #94a3b8;">📧 <strong>البريد:</strong></td>
                        <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #94a3b8;">🕒 <strong>الوقت (مصر):</strong></td>
                        <td style="padding: 10px 0; color: #cbd5e1;">${formattedTime}</td>
                    </tr>
                </table>

                <div style="background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 26px;">
                    <div style="color: #38bdf8; font-size: 12px; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">💬 نص الرسالة:</div>
                    <div style="color: #e2e8f0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
                </div>

                <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 20px;">
                    <a href="mailto:${email}?subject=رد بخصوص تواصلك عبر Zizo.dev" style="display: inline-block; background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 4px;">الرد المباشر على المرسل</a>
                    <a href="${process.env.APP_URL || 'https://zizo-dev.vercel.app'}/admin.html" style="display: inline-block; background-color: #1e293b; color: #cbd5e1; text-decoration: none; padding: 12px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; margin: 4px;">فتح لوحة التحكم (Inbox)</a>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email notification successfully sent to ${emailTo}! ID: ${info.messageId}`);
    } catch (err) {
        console.error("❌ Failed to send email notification:", err.message);
    }
};

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zizo123';

// Database Connection Helper
let dbConnection = null;
const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.log("ℹ️  MongoDB Atlas: Not configured. Using local JSON storage (data/*.json).");
        return;
    }
    if (process.env.MONGODB_URI.includes('<db_username>') || process.env.MONGODB_URI.includes('<db_password>')) {
        console.log("⚠️  MongoDB Atlas: Found placeholder '<db_username>' or '<db_password>' in .env!");
        console.log("👉 Please replace <db_username> and <db_password> in .env with your Atlas database user credentials.");
        console.log("📁 Currently using local JSON storage (data/*.json).");
        return;
    }
    if (dbConnection && mongoose.connection.readyState === 1) return;
    try {
        console.log("🔄 Connecting to MongoDB Atlas...");
        dbConnection = await mongoose.connect(process.env.MONGODB_URI);
        const dbName = mongoose.connection.name || 'test';
        console.log(`✅ MongoDB Atlas Connected Successfully! (Database: ${dbName})`);
    } catch (err) {
        console.error("❌ MongoDB Atlas Connection Error:", err.message);
        console.log("📁 Falling back to local JSON storage (data/*.json).");
    }
};

// Database Schemas & Models
const ProfileSchema = new mongoose.Schema({
    logoFirstName: String,
    logoLastName: String,
    logoSubtitle: String,
    name: String,
    title: String,
    description: String,
    bioTitle: String,
    bioText1: String,
    bioText2: String,
    location: String,
    email: String,
    experienceYears: String,
    happyClients: String,
    successRate: String,
    cvBase64: String,
    githubUrl: String,
    linkedinUrl: String,
    twitterUrl: String
});
const Profile = mongoose.model('Profile', ProfileSchema);

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    tags: [String],
    demoLink: String,
    githubLink: String,
    order: { type: Number, default: 0 }
}, { strict: false });
const Project = mongoose.model('Project', ProjectSchema);

const SkillSchema = new mongoose.Schema({
    category: String,
    icon: String,
    skills: [{
        name: String,
        level: Number
    }]
});
const Skill = mongoose.model('Skill', SkillSchema);

const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

const ServiceSchema = new mongoose.Schema({
    id: String,
    title: String,
    desc: String,
    icon: String,
    tags: [String]
}, { strict: false });
const Service = mongoose.model('Service', ServiceSchema);

const PhilosophySchema = new mongoose.Schema({
    id: String,
    icon: String,
    title: String,
    tagline: String,
    desc: String,
    points: [String],
    metrics: [{ label: String, val: String }],
    highlight: String
}, { strict: false });
const Philosophy = mongoose.model('Philosophy', PhilosophySchema);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Disable caching for API calls to support real-time sync across multiple devices
app.use('/api', (req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    next();
});

// Static file serving: React frontend dist & Frontend public assets/admin
const FRONTEND_DIST = path.join(__dirname, 'frontend/dist');
const FRONTEND_PUBLIC = path.join(__dirname, 'frontend/public');

if (fs.existsSync(FRONTEND_DIST)) {
    app.use(express.static(FRONTEND_DIST));
}
if (fs.existsSync(FRONTEND_PUBLIC)) {
    app.use(express.static(FRONTEND_PUBLIC));
}

// Serve assets folder
const ASSETS_DIR = fs.existsSync(path.join(FRONTEND_PUBLIC, 'assets'))
    ? path.join(FRONTEND_PUBLIC, 'assets')
    : path.join(__dirname, 'assets');
app.use('/assets', express.static(ASSETS_DIR));

// Ensure data folder exists (Local fallback)
const DATA_DIR = fs.existsSync(path.join(__dirname, 'data'))
    ? path.join(__dirname, 'data')
    : (fs.existsSync(path.join(__dirname, 'backend/data')) ? path.join(__dirname, 'backend/data') : path.join(__dirname, '../data'));
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const PHILOSOPHY_FILE = path.join(DATA_DIR, 'philosophy.json');

// --- SEED SECTIONS ---
const initialProjects = [
    {
        id: "1",
        title: "AI SaaS Analytics Dashboard",
        description: "A real-time data analysis software incorporating OpenAI API for smart content generation, predictive graphs, and multi-tenant user billing integration.",
        image: "assets/project_saas.png",
        tags: ["Next.js", "TypeScript", "OpenAI"],
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: "2",
        title: "Sleek Headless E-Commerce",
        description: "A lightning-fast modern online store featuring modular item grids, search filtering, user profile carts, and a highly secure checkout flow with Stripe.",
        image: "assets/project_ecommerce.png",
        tags: ["React.js", "Node.js", "Stripe"],
        demoLink: "#",
        githubLink: "#"
    },
    {
        id: "3",
        title: "Interactive Kanban Board",
        description: "A highly interactive productivity software with drag-and-drop capability, user workspaces, customizable color themes, and automatic browser storage persistence.",
        image: "assets/project_dashboard.png",
        tags: ["HTML5", "CSS3", "JavaScript"],
        demoLink: "#",
        githubLink: "#"
    }
];

if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2));
}

const initialProfile = {
    logoFirstName: "AbdElaziz",
    logoLastName: "Elsadany",
    logoSubtitle: "PORTFOLIO",
    name: "AbdElaziz Elsadany",
    title: "Senior Full-Stack Developer",
    description: "I build premium, high-performance web applications with a focus on animation, responsive UI architecture, and robust database logic.",
    bioTitle: "I engineer digital solutions that load fast and look premium.",
    bioText1: "I am a passionate Full-Stack developer with a knack for building sleek user interfaces and solid backends. I love staying at the forefront of web technologies and creating highly optimized web systems.",
    bioText2: "Whether it's a high-concurrency SaaS dashboard, a fast-loading landing page, or a dynamic application, I focus on clean architecture, beautiful animations, and ultimate mobile responsiveness.",
    location: "Cairo, Egypt",
    email: "zizoelsadany5@gmail.com",
    experienceYears: "3+",
    happyClients: "15+",
    successRate: "99%",
    githubUrl: "https://github.com/zizoelsadany",
    linkedinUrl: "https://linkedin.com/in/abd-elaziz-elsadany",
    twitterUrl: "https://twitter.com"
};

if (!fs.existsSync(PROFILE_FILE)) {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(initialProfile, null, 2));
}

const initialSkills = [
    {
        category: "Languages & Core",
        icon: "code-2",
        skills: [
            { name: "JavaScript (ES6+)", level: 95 },
            { name: "TypeScript", level: 85 },
            { name: "HTML5 & CSS3", level: 95 },
            { name: "PHP / Python", level: 75 }
        ]
    },
    {
        category: "Frontend Frameworks",
        icon: "layout",
        skills: [
            { name: "React.js", level: 92 },
            { name: "Next.js (App Router)", level: 90 },
            { name: "TailwindCSS", level: 95 },
            { name: "Redux / Zustand", level: 85 }
        ]
    },
    {
        category: "Backend & Databases",
        icon: "server",
        skills: [
            { name: "Node.js / Express", level: 90 },
            { name: "MongoDB", level: 88 },
            { name: "PostgreSQL / MySQL", level: 85 },
            { name: "RESTful & GraphQL APIs", level: 90 }
        ]
    },
    {
        category: "Tools & DevOps",
        icon: "terminal",
        skills: [
            { name: "Git & GitHub", level: 95 },
            { name: "Docker", level: 70 },
            { name: "Linux / Bash", level: 80 },
            { name: "Vercel / Netlify / AWS", level: 90 }
        ]
    }
];

if (!fs.existsSync(SKILLS_FILE)) {
    fs.writeFileSync(SKILLS_FILE, JSON.stringify(initialSkills, null, 2));
}

// --- FILE HELPER FUNCTIONS ---
function readJSON(file) {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading database file: ${file}`, err);
        return [];
    }
}

function writeJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(`Error writing database file: ${file}`, err);
        return false;
    }
}

// --- API ENDPOINTS ---

// 1. Auth Login Route
app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: "zizo_secret_session_token_12345" });
    } else {
        res.status(401).json({ success: false, message: "Incorrect password." });
    }
});

// 2. Profile Details Routes
app.get('/api/profile', async (req, res) => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            let profile = await Profile.findOne();
            if (!profile) {
                profile = new Profile(initialProfile);
                await profile.save();
            }
            return res.json(profile);
        }
        
        const profile = readJSON(PROFILE_FILE);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/profile', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const updatedProfile = req.body;
    if (!updatedProfile.name || !updatedProfile.title) {
        return res.status(400).json({ success: false, message: "Name and title are required fields." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            let profile = await Profile.findOne();
            if (!profile) {
                profile = new Profile(updatedProfile);
            } else {
                // Merge text inputs (exclude cvBase64 to not wipe it)
                const cvBase64 = profile.cvBase64;
                Object.assign(profile, updatedProfile);
                if (!updatedProfile.cvBase64 && cvBase64) {
                    profile.cvBase64 = cvBase64;
                }
            }
            await profile.save();
            return res.json({ success: true, profile });
        }

        const currentProfile = readJSON(PROFILE_FILE);
        const mergedProfile = { ...currentProfile, ...updatedProfile };
        if (writeJSON(PROFILE_FILE, mergedProfile)) {
            res.json({ success: true, profile: mergedProfile });
        } else {
            res.status(500).json({ success: false, message: "Failed to write profile updates." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CV File Processing Routes
app.post('/api/profile/upload-cv', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { fileData } = req.body;
    if (!fileData) {
        return res.status(400).json({ success: false, message: "No file data provided." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            let profile = await Profile.findOne();
            if (!profile) {
                profile = new Profile(initialProfile);
            }
            profile.cvBase64 = fileData;
            await profile.save();
            return res.json({ success: true, message: "CV uploaded to database successfully." });
        }

        // Local filesystem fallback
        const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ success: false, message: "Invalid base64 PDF format." });
        }

        const buffer = Buffer.from(matches[2], 'base64');
        if (!fs.existsSync(ASSETS_DIR)) {
            fs.mkdirSync(ASSETS_DIR, { recursive: true });
        }

        fs.writeFileSync(path.join(ASSETS_DIR, 'resume.pdf'), buffer);
        res.json({ success: true, message: "CV uploaded to storage successfully." });
    } catch (err) {
        console.error("Error saving CV file:", err);
        res.status(500).json({ success: false, message: "Failed to write PDF file." });
    }
});

app.get('/api/profile/download-cv', async (req, res) => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const profile = await Profile.findOne();
            if (profile && profile.cvBase64) {
                const matches = profile.cvBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const buffer = Buffer.from(matches[2], 'base64');
                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="resume.pdf"'
                    });
                    return res.send(buffer);
                }
            }
        }

        const localPath = path.join(ASSETS_DIR, 'resume.pdf');
        if (fs.existsSync(localPath)) {
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="resume.pdf"'
            });
            return res.sendFile(localPath);
        }

        res.status(404).send("CV File not found.");
    } catch (err) {
        console.error("Error serving CV file:", err);
        res.status(500).send("Error streaming CV file.");
    }
});

// 3. Technical Skills Routes
app.get('/api/skills', async (req, res) => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            let skills = await Skill.find();
            if (skills.length === 0) {
                const defaultSkills = readJSON(SKILLS_FILE) || [];
                if (defaultSkills.length > 0) {
                    await Skill.insertMany(defaultSkills);
                    skills = await Skill.find();
                }
            }
            return res.json(skills);
        }

        const skills = readJSON(SKILLS_FILE);
        res.json(skills);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/skills', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const updatedSkills = req.body;
    if (!Array.isArray(updatedSkills)) {
        return res.status(400).json({ success: false, message: "Skills payload must be an array." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            await Skill.deleteMany({});
            await Skill.insertMany(updatedSkills);
            return res.json({ success: true, skills: updatedSkills });
        }

        if (writeJSON(SKILLS_FILE, updatedSkills)) {
            res.json({ success: true, skills: updatedSkills });
        } else {
            res.status(500).json({ success: false, message: "Failed to write skills updates." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. Projects Routes (CRUD)
app.get('/api/projects', async (req, res) => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            let projects = await Project.find().sort({ order: 1, _id: 1 });
            if (projects.length === 0) {
                const defaultProjects = readJSON(PROJECTS_FILE) || [];
                if (defaultProjects.length > 0) {
                    await Project.insertMany(defaultProjects.map((p, idx) => ({ ...p, order: idx })));
                    projects = await Project.find().sort({ order: 1, _id: 1 });
                }
            }
            // Map _id to id
            const mapped = projects.map(p => {
                const o = p.toObject();
                o.id = o._id.toString();
                return o;
            });
            return res.json(mapped);
        }

        const projects = readJSON(PROJECTS_FILE);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Project Image Upload Route
app.post('/api/projects/upload-image', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { fileData } = req.body;
    if (!fileData) {
        return res.status(400).json({ success: false, message: "No file data provided." });
    }

    try {
        // 1. Cloudinary upload if configured
        if (cloudinary && (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME)) {
            try {
                const uploadRes = await cloudinary.uploader.upload(fileData, {
                    folder: 'zizo_portfolio',
                    resource_type: 'auto'
                });
                console.log("Image uploaded to Cloudinary:", uploadRes.secure_url);
                return res.json({ success: true, imageUrl: uploadRes.secure_url });
            } catch (cloudErr) {
                console.error("Cloudinary upload failed, falling back to database/local:", cloudErr.message);
            }
        }

        // 2. MongoDB storage if connected
        if (process.env.MONGODB_URI) {
            // Under MongoDB, return the base64 string directly so it is stored in the Project document
            return res.json({ success: true, imageUrl: fileData });
        }

        // 3. Local filesystem fallback
        const matches = fileData.match(/^data:image\/([A-Za-z0-9-+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            // If it's already a URL or doesn't match base64 format, return it back
            return res.json({ success: true, imageUrl: fileData });
        }

        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        
        // Ensure assets/uploads directory exists
        const uploadsDir = path.join(ASSETS_DIR, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const uniqueName = `project_${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, uniqueName);
        
        fs.writeFileSync(filePath, buffer);
        
        const relativeUrl = `/assets/uploads/${uniqueName}`;
        res.json({ success: true, imageUrl: relativeUrl });
    } catch (err) {
        console.error("Error saving uploaded image:", err);
        res.status(500).json({ success: false, message: "Failed to save uploaded image." });
    }
});

app.post('/api/projects', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { title, description, image, tags, demoLink, githubLink } = req.body;
    if (!title || !description) {
        return res.status(400).json({ success: false, message: "Title and description are required." });
    }

    const newProjectData = {
        title,
        description,
        image: image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
        demoLink: demoLink || "#",
        githubLink: githubLink || "#"
    };

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const count = await Project.countDocuments();
            newProjectData.order = count;
            const project = new Project(newProjectData);
            await project.save();
            const o = project.toObject();
            o.id = o._id.toString();
            return res.status(201).json({ success: true, project: o });
        }

        const projects = readJSON(PROJECTS_FILE);
        const newProject = {
            id: Date.now().toString(),
            order: projects.length,
            ...newProjectData
        };
        projects.push(newProject);
        if (writeJSON(PROJECTS_FILE, projects)) {
            res.status(201).json({ success: true, project: newProject });
        } else {
            res.status(500).json({ success: false, message: "Failed to save project." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Reorder Projects Route (Controls which project appears first, second, etc.)
app.put('/api/projects/reorder', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { projectIds } = req.body;
    if (!Array.isArray(projectIds)) {
        return res.status(400).json({ success: false, message: "projectIds array is required." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const bulkOps = projectIds.map((id, index) => {
                const isObjectId = mongoose.Types.ObjectId.isValid(id);
                return {
                    updateOne: {
                        filter: isObjectId ? { _id: id } : { id: id },
                        update: { $set: { order: index } }
                    }
                };
            });

            if (bulkOps.length > 0) {
                await Project.bulkWrite(bulkOps);
            }

            const updatedProjects = await Project.find().sort({ order: 1, _id: 1 });
            const mapped = updatedProjects.map(p => {
                const o = p.toObject();
                o.id = o._id.toString();
                return o;
            });
            return res.json({ success: true, projects: mapped });
        }

        let projects = readJSON(PROJECTS_FILE) || [];
        const projectMap = new Map(projects.map(p => [p.id, p]));
        const reordered = [];

        for (const id of projectIds) {
            if (projectMap.has(id)) {
                reordered.push(projectMap.get(id));
                projectMap.delete(id);
            }
        }
        for (const p of projectMap.values()) {
            reordered.push(p);
        }

        if (writeJSON(PROJECTS_FILE, reordered)) {
            res.json({ success: true, projects: reordered });
        } else {
            res.status(500).json({ success: false, message: "Failed to save project reordering." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { id } = req.params;
    const { title, description, image, tags, demoLink, githubLink } = req.body;
    const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : undefined;

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const project = await Project.findById(id);
            if (!project) return res.status(404).json({ success: false, message: "Project not found." });

            if (title !== undefined) project.title = title;
            if (description !== undefined) project.description = description;
            if (image !== undefined) project.image = image;
            if (tagsArray !== undefined) project.tags = tagsArray;
            if (demoLink !== undefined) project.demoLink = demoLink;
            if (githubLink !== undefined) project.githubLink = githubLink;

            await project.save();
            const o = project.toObject();
            o.id = o._id.toString();
            return res.json({ success: true, project: o });
        }

        const projects = readJSON(PROJECTS_FILE);
        const projectIndex = projects.findIndex(p => p.id === id);
        if (projectIndex === -1) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        const updatedProject = {
            ...projects[projectIndex],
            title: title !== undefined ? title : projects[projectIndex].title,
            description: description !== undefined ? description : projects[projectIndex].description,
            image: image !== undefined ? image : projects[projectIndex].image,
            tags: tagsArray !== undefined ? tagsArray : projects[projectIndex].tags,
            demoLink: demoLink !== undefined ? demoLink : projects[projectIndex].demoLink,
            githubLink: githubLink !== undefined ? githubLink : projects[projectIndex].githubLink
        };

        projects[projectIndex] = updatedProject;
        if (writeJSON(PROJECTS_FILE, projects)) {
            res.json({ success: true, project: updatedProject });
        } else {
            res.status(500).json({ success: false, message: "Failed to update project." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { id } = req.params;

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const project = await Project.findByIdAndDelete(id);
            if (!project) return res.status(404).json({ success: false, message: "Project not found." });
            return res.json({ success: true, message: "Project deleted successfully." });
        }

        let projects = readJSON(PROJECTS_FILE);
        const initialLength = projects.length;
        projects = projects.filter(p => p.id !== id);

        if (projects.length === initialLength) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        if (writeJSON(PROJECTS_FILE, projects)) {
            res.json({ success: true, message: "Project deleted successfully." });
        } else {
            res.status(500).json({ success: false, message: "Failed to delete project." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. Technical Services Routes
app.get('/api/services', async (req, res) => {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            let services = await Service.find();
            if (services.length === 0) {
                const defaultServices = readJSON(SERVICES_FILE) || [];
                if (defaultServices.length > 0) {
                    await Service.insertMany(defaultServices);
                    services = await Service.find();
                }
            }
            const mapped = services.map(s => {
                const o = s.toObject();
                o.id = o.id || o._id.toString();
                return o;
            });
            return res.json(mapped);
        }

        const services = readJSON(SERVICES_FILE) || [];
        res.json(services);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/services', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const updatedServices = req.body;
    if (!Array.isArray(updatedServices)) {
        return res.status(400).json({ success: false, message: "Services payload must be an array." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            await Service.deleteMany({});
            await Service.insertMany(updatedServices);
            writeJSON(SERVICES_FILE, updatedServices);
            return res.json({ success: true, services: updatedServices });
        }

        if (writeJSON(SERVICES_FILE, updatedServices)) {
            res.json({ success: true, services: updatedServices });
        } else {
            res.status(500).json({ success: false, message: "Failed to write services updates." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. Engineering Philosophy Routes
app.get('/api/philosophy', async (req, res) => {
    try {
        const defaultPhilosophy = readJSON(PHILOSOPHY_FILE) || [];
        const defaultPhilMap = new Map(defaultPhilosophy.map(p => [p.id, p]));

        if (process.env.MONGODB_URI) {
            await connectDB();
            let philosophy = await Philosophy.find();
            if (philosophy.length === 0) {
                if (defaultPhilosophy.length > 0) {
                    await Philosophy.insertMany(defaultPhilosophy);
                    philosophy = await Philosophy.find();
                }
            }
            const mapped = philosophy.map(p => {
                const o = p.toObject();
                o.id = o.id || o._id.toString();
                const fallback = defaultPhilMap.get(o.id) || {};
                if (!o.points || !o.points.length) o.points = fallback.points || [];
                if (!o.metrics || !o.metrics.length) o.metrics = fallback.metrics || [];
                if (!o.tagline) o.tagline = fallback.tagline || '';
                return o;
            });
            return res.json(mapped);
        }

        res.json(defaultPhilosophy);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/philosophy', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const updatedPhilosophy = req.body;
    if (!Array.isArray(updatedPhilosophy)) {
        return res.status(400).json({ success: false, message: "Philosophy payload must be an array." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            await Philosophy.deleteMany({});
            await Philosophy.insertMany(updatedPhilosophy);
            writeJSON(PHILOSOPHY_FILE, updatedPhilosophy);
            return res.json({ success: true, philosophy: updatedPhilosophy });
        }

        if (writeJSON(PHILOSOPHY_FILE, updatedPhilosophy)) {
            res.json({ success: true, philosophy: updatedPhilosophy });
        } else {
            res.status(500).json({ success: false, message: "Failed to write philosophy updates." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 7. Messages Routes (Contact Form)
app.post('/api/messages', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newMessageData = {
        name,
        email,
        message,
        createdAt: new Date()
    };

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const msg = new Message(newMessageData);
            await msg.save();
            const o = msg.toObject();
            o.id = o._id.toString();

            // Send instant email notification to personal inbox
            sendContactNotificationEmail(newMessageData).catch(err => {
                console.error("Async email notification error:", err.message);
            });

            return res.status(201).json({ success: true, message: o });
        }

        // Local fallback
        const messages = fs.existsSync(MESSAGES_FILE) ? readJSON(MESSAGES_FILE) : [];
        const newMessage = {
            id: Date.now().toString(),
            ...newMessageData
        };
        messages.push(newMessage);
        if (writeJSON(MESSAGES_FILE, messages)) {
            // Send instant email notification to personal inbox
            sendContactNotificationEmail(newMessageData).catch(err => {
                console.error("Async email notification error:", err.message);
            });

            res.status(201).json({ success: true, message: newMessage });
        } else {
            res.status(500).json({ success: false, message: "Failed to save message." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/messages', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const messages = await Message.find().sort({ createdAt: -1 });
            const mapped = messages.map(m => {
                const o = m.toObject();
                o.id = o._id.toString();
                return o;
            });
            return res.json(mapped);
        }

        // Local fallback
        const messages = fs.existsSync(MESSAGES_FILE) ? readJSON(MESSAGES_FILE) : [];
        const sorted = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sorted);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/messages/:id', async (req, res) => {
    const token = req.headers.authorization;
    if (token !== "zizo_secret_session_token_12345") {
        return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const { id } = req.params;

    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
            const msg = await Message.findByIdAndDelete(id);
            if (!msg) return res.status(404).json({ success: false, message: "Message not found." });
            return res.json({ success: true, message: "Message deleted successfully." });
        }

        // Local fallback
        let messages = fs.existsSync(MESSAGES_FILE) ? readJSON(MESSAGES_FILE) : [];
        const initialLength = messages.length;
        messages = messages.filter(m => m.id !== id);

        if (messages.length === initialLength) {
            return res.status(404).json({ success: false, message: "Message not found." });
        }

        if (writeJSON(MESSAGES_FILE, messages)) {
            res.json({ success: true, message: "Message deleted successfully." });
        } else {
            res.status(500).json({ success: false, message: "Failed to delete message." });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Health check API endpoint
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        service: 'AbdElaziz Portfolio API (Zizo.dev)',
        version: '1.0.0',
        database: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local JSON'
    });
});

app.get('*', (req, res) => {
    if (req.path === '/admin' || req.path === '/admin.html') {
        const adminPath = fs.existsSync(path.join(FRONTEND_DIST, 'admin.html'))
            ? path.join(FRONTEND_DIST, 'admin.html')
            : (fs.existsSync(path.join(FRONTEND_PUBLIC, 'admin.html'))
                ? path.join(FRONTEND_PUBLIC, 'admin.html')
                : path.join(__dirname, 'admin.html'));
        if (fs.existsSync(adminPath)) {
            return res.sendFile(adminPath);
        }
        return res.status(404).send('Admin panel not found.');
    }
    if (req.path.includes('.') || req.path.startsWith('/assets/') || req.path.startsWith('/data/')) {
        return res.status(404).send('Not Found');
    }
    if (fs.existsSync(path.join(FRONTEND_DIST, 'index.html'))) {
        return res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
    }
    if (fs.existsSync(path.join(FRONTEND_PUBLIC, 'index.html'))) {
        return res.sendFile(path.join(FRONTEND_PUBLIC, 'index.html'));
    }
    res.status(404).send('Application build not found. Run npm run build.');
});

// Start Server
if (!process.env.VERCEL && require.main === module) {
    app.listen(PORT, '0.0.0.0', async () => {
        console.log(`=================================================`);
        console.log(`  AbdElaziz's Portfolio Server Running!`);
        console.log(`  Local Address:   http://localhost:${PORT}`);
        console.log(`  Admin Panel:     http://localhost:${PORT}/admin.html`);
        console.log(`  Access from LAN: http://<your-ip>:${PORT}`);
        console.log(`=================================================`);
        await connectDB();
    });
}

module.exports = app;
