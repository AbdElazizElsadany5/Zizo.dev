document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const loginOverlay = document.getElementById('login-overlay');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const loginStatus = document.getElementById('login-status');
    const passwordInput = document.getElementById('admin-password');
    const logoutBtn = document.getElementById('logout-btn');

    // Projects CRUD selectors
    const projectForm = document.getElementById('project-crud-form');
    const projectIdInput = document.getElementById('project-id');
    const projectTitleInput = document.getElementById('project-title');
    const projectDescInput = document.getElementById('project-desc');
    const projectImageInput = document.getElementById('project-image');
    const projectTagsInput = document.getElementById('project-tags');
    const projectDemoInput = document.getElementById('project-demo');
    const projectGithubInput = document.getElementById('project-github');

    const toggleUploadFile = document.getElementById('toggle-upload-file');
    const toggleUploadUrl = document.getElementById('toggle-upload-url');
    const fileUploadContainer = document.getElementById('file-upload-container');
    const urlUploadContainer = document.getElementById('url-upload-container');
    const projectImageFileInput = document.getElementById('project-image-file');
    const imageDragZone = document.getElementById('image-drag-zone');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const projectImagePreview = document.getElementById('project-image-preview');
    const btnRemoveImage = document.getElementById('btn-remove-image');

    const formActionTitle = document.getElementById('form-action-title');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const crudStatus = document.getElementById('crud-status');
    const projectsListTable = document.getElementById('projects-list-table');

    // Profile selectors
    const profileForm = document.getElementById('profile-edit-form');
    const profileStatus = document.getElementById('profile-status');

    // Skills selectors
    const skillsJsonInput = document.getElementById('skills-json-input');
    const formatSkillsBtn = document.getElementById('format-skills-btn');
    const saveSkillsBtn = document.getElementById('save-skills-btn');
    const skillsStatus = document.getElementById('skills-status');

    // Messages selectors
    const messagesList = document.getElementById('messages-list');
    const refreshMessagesBtn = document.getElementById('refresh-messages-btn');

    let allProjects = [];

    // Tabs Switcher
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabPanels.forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(targetTab);
            if (panel) panel.classList.add('active');

            if (targetTab === 'analytics-tab') {
                loadAdminAnalytics();
            } else if (targetTab === 'settings-tab') {
                loadAdminSettings();
            }
        });
    });

    // Check Auth Status
    function checkAuth() {
        const token = localStorage.getItem('zizo_admin_token');
        if (token === "zizo_secret_session_token_12345") {
            loginOverlay.style.display = 'none';
            adminDashboard.style.display = 'block';
            loadAdminProjects();
            loadAdminProfile();
            loadAdminServices();
            loadAdminSkills();
            loadAdminMessages();
            loadAdminAnalytics();
            loadAdminSettings();
        } else {
            loginOverlay.style.display = 'flex';
            adminDashboard.style.display = 'none';
            if (passwordInput) passwordInput.focus();
        }
    }

    checkAuth();

    // Login Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = passwordInput.value;
            
            loginStatus.className = 'form-status';
            loginStatus.textContent = 'Authenticating...';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });

                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('zizo_admin_token', data.token);
                    loginStatus.className = 'form-status success';
                    loginStatus.textContent = 'Success! Accessing dashboard...';
                    setTimeout(() => {
                        passwordInput.value = '';
                        checkAuth();
                    }, 800);
                } else {
                    loginStatus.className = 'form-status error';
                    loginStatus.textContent = data.message || 'Incorrect password.';
                }
            } catch (err) {
                loginStatus.className = 'form-status error';
                loginStatus.textContent = 'Server connection error.';
            }
        });
    }

    // Logout Action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('zizo_admin_token');
            checkAuth();
        });
    }

    // --- Tab 1: Projects Portfolio Logic ---
    async function loadAdminProjects() {
        if (!projectsListTable) return;
        
        projectsListTable.innerHTML = `<div class="loading-state"><span class="pulse-dot"></span> Fetching projects...</div>`;

        try {
            const response = await fetch(`/api/projects?t=${Date.now()}`);
            allProjects = await response.json();
            
            renderAdminProjects(allProjects);
        } catch (err) {
            projectsListTable.innerHTML = `<div class="loading-state" style="color:#ef4444;">Failed to fetch database projects.</div>`;
        }
    }

    function renderAdminProjects(projects) {
        if (projects.length === 0) {
            projectsListTable.innerHTML = `
                <div class="loading-state">
                    <p>No projects found in database.</p>
                </div>
            `;
            return;
        }

        projectsListTable.innerHTML = projects.map((proj, idx) => `
            <div class="list-item-card" data-project-id="${proj.id}">
                <div class="project-order-control" title="Enter rank number (1 - ${projects.length}) and press Enter to reorder">
                    <span class="order-prefix">#</span>
                    <input type="number" 
                           class="project-order-input" 
                           data-index="${idx}" 
                           value="${idx + 1}" 
                           min="1" 
                           max="${projects.length}" 
                           title="Change order rank (1 - ${projects.length})">
                </div>
                <img src="${proj.image}" alt="${proj.title}" class="item-img-preview" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'">
                <div class="item-info">
                    <h4 class="item-title">${proj.title}</h4>
                    <div class="item-tags">
                        ${proj.tags.map(t => `<span class="item-tag-badge">${t}</span>`).join('')}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline btn-icon-only btn-edit-action" data-id="${proj.id}" title="Edit Project">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn btn-outline btn-icon-only btn-delete-action" data-id="${proj.id}" title="Delete Project">
                        <i data-lucide="trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        lucide.createIcons();

        // Direct numeric order change listener
        document.querySelectorAll('.project-order-input').forEach(input => {
            // Auto-select value on focus for instant typing
            input.addEventListener('focus', () => {
                input.select();
            });

            const applyOrderChange = () => {
                const currentIdx = parseInt(input.getAttribute('data-index'), 10);
                const rawVal = input.value.trim();
                let targetRank = parseInt(rawVal, 10);

                if (isNaN(targetRank)) {
                    input.value = currentIdx + 1;
                    return;
                }

                // Clamp between 1 and allProjects.length
                targetRank = Math.max(1, Math.min(allProjects.length, targetRank));
                const targetIdx = targetRank - 1;

                if (targetIdx !== currentIdx) {
                    reorderProjects(currentIdx, targetIdx);
                } else {
                    input.value = currentIdx + 1;
                }
            };

            input.addEventListener('change', applyOrderChange);

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    input.blur();
                }
            });
        });

        document.querySelectorAll('.btn-edit-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const project = allProjects.find(p => p.id === id);
                if (project) setupEditMode(project);
            });
        });

        document.querySelectorAll('.btn-delete-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteProject(id);
            });
        });
    }

    async function reorderProjects(fromIdx, toIdx) {
        const item = allProjects.splice(fromIdx, 1)[0];
        allProjects.splice(toIdx, 0, item);
        renderAdminProjects(allProjects);

        const token = localStorage.getItem('zizo_admin_token');
        try {
            const res = await fetch('/api/projects/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ projectIds: allProjects.map(p => p.id) })
            });
            const data = await res.json();
            if (!data.success) {
                alert('Failed to save project order.');
                loadAdminProjects();
            }
        } catch (err) {
            console.error('Reorder error:', err);
            loadAdminProjects();
        }
    }

    function updateProjectImagePreview(urlOrBase64) {
        if (urlOrBase64) {
            projectImagePreview.src = urlOrBase64;
            imagePreviewContainer.style.display = 'flex';
        } else {
            projectImagePreview.src = '';
            imagePreviewContainer.style.display = 'none';
        }
    }

    function resetImageUpload() {
        if (projectImageFileInput) projectImageFileInput.value = '';
        if (projectImageInput) projectImageInput.value = '';
        updateProjectImagePreview('');
    }

    async function uploadImageFile(file) {
        const token = localStorage.getItem('zizo_admin_token');
        const reader = new FileReader();
        
        imagePreviewContainer.style.display = 'flex';
        projectImagePreview.style.opacity = '0.5';
        
        reader.onload = async () => {
            const base64Data = reader.result;
            try {
                const response = await fetch('/api/projects/upload-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ fileData: base64Data })
                });
                
                const data = await response.json();
                if (data.success) {
                    projectImageInput.value = data.imageUrl;
                    projectImagePreview.src = data.imageUrl;
                    projectImagePreview.style.opacity = '1';
                } else {
                    alert('Image upload failed: ' + (data.message || 'Unknown error'));
                    resetImageUpload();
                }
            } catch (err) {
                alert('Image upload network error.');
                resetImageUpload();
            }
        };
        
        reader.onerror = () => {
            alert('Failed to read image file.');
            resetImageUpload();
        };
        
        reader.readAsDataURL(file);
    }

    // Set up project image upload event listeners
    if (toggleUploadFile && toggleUploadUrl) {
        toggleUploadFile.addEventListener('click', () => {
            toggleUploadFile.classList.add('active');
            toggleUploadUrl.classList.remove('active');
            fileUploadContainer.style.display = 'block';
            urlUploadContainer.style.display = 'none';
        });

        toggleUploadUrl.addEventListener('click', () => {
            toggleUploadUrl.classList.add('active');
            toggleUploadFile.classList.remove('active');
            urlUploadContainer.style.display = 'block';
            fileUploadContainer.style.display = 'none';
        });
    }

    if (projectImageInput) {
        projectImageInput.addEventListener('input', () => {
            const val = projectImageInput.value.trim();
            updateProjectImagePreview(val);
        });
    }

    if (projectImageFileInput) {
        projectImageFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                uploadImageFile(e.target.files[0]);
            }
        });
    }

    if (imageDragZone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            imageDragZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageDragZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageDragZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageDragZone.classList.remove('dragover');
            }, false);
        });

        imageDragZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files[0]) {
                uploadImageFile(files[0]);
            }
        }, false);
    }

    if (btnRemoveImage) {
        btnRemoveImage.addEventListener('click', () => {
            resetImageUpload();
        });
    }

    function setupEditMode(project) {
        projectIdInput.value = project.id;
        projectTitleInput.value = project.title;
        projectDescInput.value = project.description;
        projectImageInput.value = project.image;
        if (project.image) {
            updateProjectImagePreview(project.image);
        } else {
            updateProjectImagePreview('');
        }
        projectTagsInput.value = project.tags.join(', ');
        projectDemoInput.value = project.demoLink;
        projectGithubInput.value = project.githubLink;

        formActionTitle.innerHTML = `<i data-lucide="edit" class="text-gradient"></i> Edit Project`;
        saveBtn.innerHTML = `<i data-lucide="save"></i> Update Project`;
        cancelEditBtn.style.display = 'inline-flex';
        lucide.createIcons();
        
        projectTitleInput.scrollIntoView({ behavior: 'smooth' });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', resetForm);
    }

    function resetForm() {
        projectForm.reset();
        projectIdInput.value = '';
        updateProjectImagePreview('');
        if (toggleUploadFile && toggleUploadUrl) {
            toggleUploadFile.click();
        }
        formActionTitle.innerHTML = `<i data-lucide="plus-circle" class="text-gradient"></i> Add New Project`;
        saveBtn.innerHTML = `<i data-lucide="save"></i> Save Project`;
        cancelEditBtn.style.display = 'none';
        lucide.createIcons();
    }

    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const token = localStorage.getItem('zizo_admin_token');
            const id = projectIdInput.value;
            const title = projectTitleInput.value;
            const description = projectDescInput.value;
            const image = projectImageInput.value;
            const tags = projectTagsInput.value;
            const demoLink = projectDemoInput.value;
            const githubLink = projectGithubInput.value;

            const isEdit = id !== '';
            const url = isEdit ? `/api/projects/${id}` : '/api/projects';
            const method = isEdit ? 'PUT' : 'POST';

            crudStatus.className = 'form-status';
            crudStatus.textContent = isEdit ? 'Updating project...' : 'Creating project...';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ title, description, image, tags, demoLink, githubLink })
                });

                const data = await response.json();
                if (data.success) {
                    crudStatus.className = 'form-status success';
                    crudStatus.textContent = isEdit ? 'Project updated successfully!' : 'Project created successfully!';
                    
                    resetForm();
                    loadAdminProjects();

                    setTimeout(() => {
                        crudStatus.className = 'form-status';
                        crudStatus.textContent = '';
                    }, 4000);
                } else {
                    crudStatus.className = 'form-status error';
                    crudStatus.textContent = data.message || 'Database transaction failed.';
                }
            } catch (err) {
                crudStatus.className = 'form-status error';
                crudStatus.textContent = 'Server response error.';
            }
        });
    }

    async function deleteProject(id) {
        const confirmDelete = confirm("Are you sure you want to delete this project? This will sync immediately on all devices.");
        if (!confirmDelete) return;

        const token = localStorage.getItem('zizo_admin_token');
        crudStatus.className = 'form-status';
        crudStatus.textContent = 'Deleting project...';

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });

            const data = await response.json();
            if (data.success) {
                crudStatus.className = 'form-status success';
                crudStatus.textContent = 'Project deleted successfully.';
                loadAdminProjects();
                
                setTimeout(() => {
                    crudStatus.className = 'form-status';
                    crudStatus.textContent = '';
                }, 4000);
            } else {
                crudStatus.className = 'form-status error';
                crudStatus.textContent = data.message || 'Delete operation failed.';
            }
        } catch (err) {
            crudStatus.className = 'form-status error';
            crudStatus.textContent = 'Server response error.';
        }
    }

    // --- Tab 2: Profile Management Logic ---
    async function loadAdminProfile() {
        try {
            const response = await fetch(`/api/profile?t=${Date.now()}`);
            if (!response.ok) throw new Error("Failed to load profile details.");
            const profile = await response.json();

            document.getElementById('profile-logo-first').value = profile.logoFirstName || '';
            document.getElementById('profile-logo-last').value = profile.logoLastName || '';
            document.getElementById('profile-logo-sub').value = profile.logoSubtitle || '';
            document.getElementById('profile-name').value = profile.name || '';
            document.getElementById('profile-title').value = profile.title || '';
            document.getElementById('profile-desc').value = profile.description || '';
            document.getElementById('profile-biotitle').value = profile.bioTitle || '';
            document.getElementById('profile-biotext1').value = profile.bioText1 || '';
            document.getElementById('profile-biotext2').value = profile.bioText2 || '';
            document.getElementById('profile-location').value = profile.location || '';
            document.getElementById('profile-email').value = profile.email || '';
            document.getElementById('profile-experience').value = profile.experienceYears || '';
            document.getElementById('profile-clients').value = profile.happyClients || '';
            document.getElementById('profile-success').value = profile.successRate || '';
            document.getElementById('profile-github').value = profile.githubUrl || '';
            document.getElementById('profile-linkedin').value = profile.linkedinUrl || '';
            const fbInput = document.getElementById('profile-facebook') || document.getElementById('profile-twitter');
            if (fbInput) {
                fbInput.value = profile.facebookUrl || profile.twitterUrl || '';
            }
        } catch (err) {
            console.error("Error loading profile configuration:", err);
        }
    }

    function readCVFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('zizo_admin_token');
            const fbInput = document.getElementById('profile-facebook') || document.getElementById('profile-twitter');
            const fbVal = fbInput ? fbInput.value : '';

            const updatedProfile = {
                logoFirstName: document.getElementById('profile-logo-first').value,
                logoLastName: document.getElementById('profile-logo-last').value,
                logoSubtitle: document.getElementById('profile-logo-sub').value,
                name: document.getElementById('profile-name').value,
                title: document.getElementById('profile-title').value,
                description: document.getElementById('profile-desc').value,
                bioTitle: document.getElementById('profile-biotitle').value,
                bioText1: document.getElementById('profile-biotext1').value,
                bioText2: document.getElementById('profile-biotext2').value,
                location: document.getElementById('profile-location').value,
                email: document.getElementById('profile-email').value,
                experienceYears: document.getElementById('profile-experience').value,
                happyClients: document.getElementById('profile-clients').value,
                successRate: document.getElementById('profile-success').value,
                githubUrl: document.getElementById('profile-github').value,
                linkedinUrl: document.getElementById('profile-linkedin').value,
                facebookUrl: fbVal,
                twitterUrl: fbVal
            };

            profileStatus.className = 'form-status';
            profileStatus.textContent = 'Synchronizing profile details...';

            try {
                // 1. Update text profile info
                const response = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(updatedProfile)
                });
                const data = await response.json();
                
                if (!data.success) {
                    profileStatus.className = 'form-status error';
                    profileStatus.textContent = data.message || 'Profile save transaction failed.';
                    return;
                }

                // 2. Check if CV PDF file is selected to upload
                const cvFileInput = document.getElementById('profile-cv-upload');
                let uploadSuccess = true;
                let uploadErrorMsg = '';

                if (cvFileInput && cvFileInput.files.length > 0) {
                    profileStatus.textContent = 'Profile saved. Processing PDF CV upload...';
                    
                    const file = cvFileInput.files[0];
                    try {
                        const base64Data = await readCVFileAsBase64(file);
                        const uploadRes = await fetch('/api/profile/upload-cv', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            },
                            body: JSON.stringify({ fileData: base64Data })
                        });
                        const uploadData = await uploadRes.json();
                        if (!uploadData.success) {
                            uploadSuccess = false;
                            uploadErrorMsg = uploadData.message || 'Server failed to save CV.';
                        } else {
                            cvFileInput.value = ''; // Reset input field
                        }
                    } catch (uploadErr) {
                        uploadSuccess = false;
                        uploadErrorMsg = 'CV parsing or network connection error.';
                    }
                }

                // 3. Output final combined status
                if (uploadSuccess) {
                    profileStatus.className = 'form-status success';
                    profileStatus.textContent = 'Profile details and CV PDF updated and synced successfully!';
                } else {
                    profileStatus.className = 'form-status error';
                    profileStatus.textContent = 'Profile details saved, but CV upload failed: ' + uploadErrorMsg;
                }

                setTimeout(() => {
                    profileStatus.className = 'form-status';
                    profileStatus.textContent = '';
                }, 5000);

            } catch (err) {
                profileStatus.className = 'form-status error';
                profileStatus.textContent = 'Server response error.';
            }
        });
    }

    // --- Tab 3: Technical Skills Logic ---
    async function loadAdminSkills() {
        if (!skillsJsonInput) return;
        try {
            const response = await fetch(`/api/skills?t=${Date.now()}`);
            if (!response.ok) throw new Error("Failed to load skills list.");
            const skills = await response.json();
            skillsJsonInput.value = JSON.stringify(skills, null, 4);
        } catch (err) {
            console.error("Error loading technical skills configuration:", err);
        }
    }

    if (formatSkillsBtn && skillsJsonInput) {
        formatSkillsBtn.addEventListener('click', () => {
            try {
                const parsed = JSON.parse(skillsJsonInput.value);
                skillsJsonInput.value = JSON.stringify(parsed, null, 4);
                skillsStatus.className = 'form-status success';
                skillsStatus.textContent = 'JSON syntax formatted successfully!';
                setTimeout(() => {
                    skillsStatus.className = 'form-status';
                    skillsStatus.textContent = '';
                }, 3000);
            } catch (err) {
                skillsStatus.className = 'form-status error';
                skillsStatus.textContent = 'JSON Syntax Error: ' + err.message;
            }
        });
    }

    if (saveSkillsBtn && skillsJsonInput) {
        saveSkillsBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('zizo_admin_token');
            let skillsArray = [];
            
            skillsStatus.className = 'form-status';
            skillsStatus.textContent = 'Validating JSON array...';

            try {
                skillsArray = JSON.parse(skillsJsonInput.value);
                if (!Array.isArray(skillsArray)) {
                    throw new Error("Target root schema must be an array.");
                }
            } catch (err) {
                skillsStatus.className = 'form-status error';
                skillsStatus.textContent = 'Validation Error: ' + err.message;
                return;
            }

            skillsStatus.textContent = 'Saving skills configuration to database...';

            try {
                const response = await fetch('/api/skills', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(skillsArray)
                });
                const data = await response.json();
                if (data.success) {
                    skillsStatus.className = 'form-status success';
                    skillsStatus.textContent = 'Technical skills array synchronized successfully!';
                    setTimeout(() => {
                        skillsStatus.className = 'form-status';
                        skillsStatus.textContent = '';
                    }, 4000);
                } else {
                    skillsStatus.className = 'form-status error';
                    skillsStatus.textContent = data.message || 'Skills save transaction failed.';
                }
            } catch (err) {
                skillsStatus.className = 'form-status error';
                skillsStatus.textContent = 'Server response error.';
            }
        });
    }

    // --- Tab 4: Messages Inbox Logic ---
    async function loadAdminMessages() {
        if (!messagesList) return;
        
        messagesList.innerHTML = `<div class="loading-state"><span class="pulse-dot"></span> Fetching messages...</div>`;
        const token = localStorage.getItem('zizo_admin_token');

        try {
            const response = await fetch(`/api/messages?t=${Date.now()}`, {
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error("Failed to fetch messages.");
            const messages = await response.json();
            
            renderAdminMessages(messages);
        } catch (err) {
            messagesList.innerHTML = `<div class="loading-state" style="color:#ef4444;">Failed to fetch inbox messages.</div>`;
        }
    }

    function renderAdminMessages(messages) {
        if (!messagesList) return;
        if (messages.length === 0) {
            messagesList.innerHTML = `
                <div class="loading-state" style="padding: 60px 0;">
                    <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>Your inbox is empty. No messages received yet.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        messagesList.innerHTML = messages.map(msg => {
            const dateStr = new Date(msg.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
            return `
                <div class="message-card-item">
                    <div class="message-header">
                        <div class="sender-info">
                            <span class="sender-name">${escapeHTML(msg.name)}</span>
                            <span class="sender-email"><a href="mailto:${escapeHTML(msg.email)}">${escapeHTML(msg.email)}</a></span>
                        </div>
                        <div class="message-actions">
                            <span class="message-date">${dateStr}</span>
                            <button class="btn btn-outline btn-icon-only btn-delete-msg" data-id="${msg.id}" title="Delete Message">
                                <i data-lucide="trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="message-content">
                        ${escapeHTML(msg.message).replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Attach delete handlers
        document.querySelectorAll('.btn-delete-msg').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteMessage(id);
            });
        });
    }

    async function deleteMessage(id) {
        const confirmDelete = confirm("Are you sure you want to delete this message?");
        if (!confirmDelete) return;

        const token = localStorage.getItem('zizo_admin_token');

        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });

            const data = await response.json();
            if (data.success) {
                loadAdminMessages();
            } else {
                alert(data.message || 'Failed to delete message.');
            }
        } catch (err) {
            alert('Server connection error.');
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    if (refreshMessagesBtn) {
        refreshMessagesBtn.addEventListener('click', loadAdminMessages);
    }

    // --- Tab: Services & Engineering Philosophy Logic ---
    let allAdminServices = [];
    let allAdminPhilosophy = [];

    const saveServicesBtn = document.getElementById('save-services-btn');
    const savePhilosophyBtn = document.getElementById('save-philosophy-btn');
    const servicesStatus = document.getElementById('services-status');
    const philosophyStatus = document.getElementById('philosophy-status');

    async function loadAdminServices() {
        const servicesList = document.getElementById('services-editor-list');
        const philosophyList = document.getElementById('philosophy-editor-list');

        try {
            const [servRes, philRes] = await Promise.all([
                fetch(`/api/services?t=${Date.now()}`),
                fetch(`/api/philosophy?t=${Date.now()}`)
            ]);

            allAdminServices = await servRes.json();
            allAdminPhilosophy = await philRes.json();

            renderServicesEditor(allAdminServices);
            renderPhilosophyEditor(allAdminPhilosophy);
        } catch (err) {
            if (servicesList) servicesList.innerHTML = `<div class="loading-state" style="color:#ef4444;">Failed to load services data.</div>`;
            if (philosophyList) philosophyList.innerHTML = `<div class="loading-state" style="color:#ef4444;">Failed to load philosophy data.</div>`;
        }
    }

    function renderServicesEditor(services) {
        const container = document.getElementById('services-editor-list');
        if (!container) return;

        if (!Array.isArray(services) || services.length === 0) {
            container.innerHTML = `<div class="loading-state">No services configured.</div>`;
            return;
        }

        container.innerHTML = services.map((s, idx) => `
            <div class="editor-block-card" data-service-idx="${idx}">
                <div class="editor-block-header">
                    <span class="editor-block-title">
                        <i data-lucide="code-2"></i> Card ${idx + 1}: ${escapeHTML(s.title)}
                    </span>
                    <span class="badge" style="background: rgba(6,182,212,0.12); color:#06b6d4; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-family: var(--font-mono);">
                        ${escapeHTML(s.icon || 'code-2')}
                    </span>
                </div>
                <div class="editor-block-grid">
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label>Service Title</label>
                        <input type="text" class="service-title-input" value="${escapeHTML(s.title || '')}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label>Icon Name (e.g. code-2, palette, server, sparkles)</label>
                        <input type="text" class="service-icon-input" value="${escapeHTML(s.icon || 'code-2')}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label>Description</label>
                        <textarea class="service-desc-input" rows="3" required>${escapeHTML(s.desc || '')}</textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Tags (comma separated)</label>
                        <input type="text" class="service-tags-input" value="${escapeHTML(Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || ''))}">
                    </div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    function renderPhilosophyEditor(philosophy) {
        const container = document.getElementById('philosophy-editor-list');
        if (!container) return;

        if (!Array.isArray(philosophy) || philosophy.length === 0) {
            container.innerHTML = `<div class="loading-state">No philosophy principles configured.</div>`;
            return;
        }

        container.innerHTML = philosophy.map((p, idx) => `
            <div class="editor-block-card" data-phil-idx="${idx}">
                <div class="editor-block-header">
                    <span class="editor-block-title">
                        <i data-lucide="sparkles"></i> Principle 0${idx + 1}: ${escapeHTML(p.title)}
                    </span>
                    <span class="badge" style="background: rgba(6,182,212,0.12); color:#38bdf8; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-family: var(--font-mono);">
                        ID: ${escapeHTML(p.id)}
                    </span>
                </div>
                <div class="editor-block-grid">
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label>Principle Title</label>
                        <input type="text" class="phil-title-input" value="${escapeHTML(p.title || '')}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label>Tagline Subtitle</label>
                        <input type="text" class="phil-tagline-input" value="${escapeHTML(p.tagline || '')}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label>Detailed Architectural Description</label>
                        <textarea class="phil-desc-input" rows="3" required>${escapeHTML(p.desc || '')}</textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Key Architectural Points (one point per line)</label>
                        <textarea class="phil-points-input" rows="3">${escapeHTML(Array.isArray(p.points) ? p.points.join('\n') : '')}</textarea>
                    </div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    // Save Technical Services Handler
    if (saveServicesBtn) {
        saveServicesBtn.addEventListener('click', async () => {
            const cards = document.querySelectorAll('#services-editor-list .editor-block-card');
            const updated = [];

            cards.forEach((card, idx) => {
                const title = card.querySelector('.service-title-input').value.trim();
                const icon = card.querySelector('.service-icon-input').value.trim() || 'code-2';
                const desc = card.querySelector('.service-desc-input').value.trim();
                const rawTags = card.querySelector('.service-tags-input').value.trim();
                const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : [];

                updated.push({
                    id: String(idx + 1),
                    icon,
                    title,
                    desc,
                    tags
                });
            });

            const token = localStorage.getItem('zizo_admin_token');
            servicesStatus.className = 'form-status';
            servicesStatus.textContent = 'Saving services to database...';

            try {
                const response = await fetch('/api/services', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(updated)
                });

                const data = await response.json();
                if (data.success) {
                    servicesStatus.className = 'form-status success';
                    servicesStatus.textContent = 'Technical Services updated and synced successfully!';
                    setTimeout(() => {
                        servicesStatus.className = 'form-status';
                        servicesStatus.textContent = '';
                    }, 4000);
                } else {
                    servicesStatus.className = 'form-status error';
                    servicesStatus.textContent = data.message || 'Failed to update services.';
                }
            } catch (err) {
                servicesStatus.className = 'form-status error';
                servicesStatus.textContent = 'Server response error.';
            }
        });
    }

    // Save Engineering Philosophy Handler
    if (savePhilosophyBtn) {
        savePhilosophyBtn.addEventListener('click', async () => {
            const cards = document.querySelectorAll('#philosophy-editor-list .editor-block-card');
            const updated = [];

            cards.forEach((card, idx) => {
                const orig = allAdminPhilosophy[idx] || {};
                const title = card.querySelector('.phil-title-input').value.trim();
                const tagline = card.querySelector('.phil-tagline-input').value.trim();
                const desc = card.querySelector('.phil-desc-input').value.trim();
                const pointsRaw = card.querySelector('.phil-points-input').value.trim();
                const points = pointsRaw ? pointsRaw.split('\n').map(p => p.trim()).filter(Boolean) : (orig.points || []);

                updated.push({
                    ...orig,
                    title,
                    tagline,
                    desc,
                    points
                });
            });

            const token = localStorage.getItem('zizo_admin_token');
            philosophyStatus.className = 'form-status';
            philosophyStatus.textContent = 'Saving philosophy to database...';

            try {
                const response = await fetch('/api/philosophy', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(updated)
                });

                const data = await response.json();
                if (data.success) {
                    philosophyStatus.className = 'form-status success';
                    philosophyStatus.textContent = 'Engineering Philosophy updated and synced successfully!';
                    setTimeout(() => {
                        philosophyStatus.className = 'form-status';
                        philosophyStatus.textContent = '';
                    }, 4000);
                } else {
                    philosophyStatus.className = 'form-status error';
                    philosophyStatus.textContent = data.message || 'Failed to update philosophy.';
                }
            } catch (err) {
                philosophyStatus.className = 'form-status error';
                philosophyStatus.textContent = 'Server response error.';
            }
        });
    }

    // --- 5. VISITOR ANALYTICS & SEARCHES LOGIC ---
    const statTotalVisits = document.getElementById('stat-total-visits');
    const statUniqueVisitors = document.getElementById('stat-unique-visitors');
    const statSearchCount = document.getElementById('stat-search-count');
    const statDeviceRatio = document.getElementById('stat-device-ratio');
    const analyticsSearchesList = document.getElementById('analytics-searches-list');
    const analyticsReferrersList = document.getElementById('analytics-referrers-list');
    const analyticsVisitsTbody = document.getElementById('analytics-visits-tbody');
    const refreshAnalyticsBtn = document.getElementById('refresh-analytics-btn');
    const clearAnalyticsBtn = document.getElementById('clear-analytics-btn');

    async function loadAdminAnalytics() {
        const token = localStorage.getItem('zizo_admin_token');
        if (!token) return;

        try {
            const res = await fetch('/api/analytics/stats', {
                headers: { 'Authorization': token }
            });
            if (!res.ok) {
                console.warn("Analytics API returned HTTP status:", res.status);
                return;
            }
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                console.warn("Analytics API returned non-JSON content type:", contentType);
                return;
            }
            const data = await res.json();

            if (!data || !data.success) {
                console.warn("Analytics data not successful:", data);
                return;
            }

            // 1. Update Metrics Cards
            if (statTotalVisits) statTotalVisits.textContent = (data.totalVisits || 0).toLocaleString();
            if (statUniqueVisitors) statUniqueVisitors.textContent = (data.uniqueVisitors || 0).toLocaleString();
            if (statSearchCount) statSearchCount.textContent = (data.totalSearches || 0).toLocaleString();
            if (statDeviceRatio) {
                const desktop = data.deviceCounts?.Desktop || 0;
                const mobile = (data.deviceCounts?.Mobile || 0) + (data.deviceCounts?.Tablet || 0);
                statDeviceRatio.textContent = `${desktop} 💻 / ${mobile} 📱`;
            }

            // 2. Render Search Queries
            if (analyticsSearchesList) {
                if (!data.topSearches || data.topSearches.length === 0) {
                    analyticsSearchesList.innerHTML = `
                        <div style="padding: 16px; text-align: center; color: #64748b; font-size: 0.88rem;">
                            No visitor search keywords recorded yet.
                        </div>
                    `;
                } else {
                    analyticsSearchesList.innerHTML = data.topSearches.map(item => `
                        <div class="analytics-chip-item">
                            <span style="font-weight: 600; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="search" style="width: 14px; height: 14px; color: #38bdf8;"></i>
                                "${item.query}"
                            </span>
                            <span class="badge" style="background: rgba(6,182,212,0.15); color: #38bdf8; font-size: 0.75rem; padding: 2px 8px; border-radius: 9999px;">
                                ${item.count} ${item.count === 1 ? 'visit' : 'visits'}
                            </span>
                        </div>
                    `).join('');
                }
            }

            // 3. Render Referrers
            if (analyticsReferrersList) {
                if (!data.topReferrers || data.topReferrers.length === 0) {
                    analyticsReferrersList.innerHTML = `
                        <div style="padding: 16px; text-align: center; color: #64748b; font-size: 0.88rem;">
                            Direct traffic or no referrers recorded yet.
                        </div>
                    `;
                } else {
                    analyticsReferrersList.innerHTML = data.topReferrers.map(item => `
                        <div class="analytics-chip-item">
                            <span style="color: #cbd5e1; word-break: break-all; font-size: 0.82rem; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="external-link" style="width: 13px; height: 13px; color: #94a3b8; flex-shrink: 0;"></i>
                                ${item.referrer}
                            </span>
                            <span class="badge" style="background: rgba(56,189,248,0.12); color: #7dd3fc; font-size: 0.75rem; padding: 2px 8px; border-radius: 9999px; flex-shrink: 0;">
                                ${item.count}
                            </span>
                        </div>
                    `).join('');
                }
            }

            // 4. Render Table
            if (analyticsVisitsTbody) {
                if (!data.recentVisits || data.recentVisits.length === 0) {
                    analyticsVisitsTbody.innerHTML = `
                        <tr>
                            <td colspan="6" style="padding: 28px; text-align: center; color: #94a3b8;">
                                No visitor records in database yet. New visits will appear here automatically.
                            </td>
                        </tr>
                    `;
                } else {
                    analyticsVisitsTbody.innerHTML = data.recentVisits.map(v => {
                        const dateObj = new Date(v.createdAt || v.timestamp);
                        const formattedDate = !isNaN(dateObj) ? dateObj.toLocaleString('en-GB', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        }) : 'Recent';

                        const deviceIcon = v.device === 'Mobile' ? '📱' : (v.device === 'Tablet' ? '📟' : '💻');
                        const searchHighlight = v.searchQuery 
                            ? `<div style="color: #c084fc; font-weight: 600; font-size: 0.8rem; margin-top: 2px;">🔍 "${v.searchQuery}"</div>`
                            : '';
                        const referrerClean = (v.referrer && v.referrer !== 'Direct')
                            ? (v.referrer.length > 35 ? v.referrer.substring(0, 32) + '...' : v.referrer)
                            : '<span style="color: #64748b;">Direct</span>';

                        return `
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                                <td style="padding: 12px 14px; color: #cbd5e1; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;">${formattedDate}</td>
                                <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #38bdf8;">${v.ip || 'Unknown'}</td>
                                <td style="padding: 12px 14px; color: #f1f5f9;">${deviceIcon} ${v.os || 'OS'}</td>
                                <td style="padding: 12px 14px; color: #94a3b8;">${v.browser || 'Browser'}</td>
                                <td style="padding: 12px 14px;">
                                    <div>${referrerClean}</div>
                                    ${searchHighlight}
                                </td>
                                <td style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #94a3b8;">${v.path || '/'}</td>
                            </tr>
                        `;
                    }).join('');
                }
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
        } catch (err) {
            console.error("Error loading analytics:", err);
        }
    }

    if (refreshAnalyticsBtn) {
        refreshAnalyticsBtn.addEventListener('click', () => {
            loadAdminAnalytics();
        });
    }

    if (clearAnalyticsBtn) {
        clearAnalyticsBtn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to clear all visitor and search history logs?')) return;
            const token = localStorage.getItem('zizo_admin_token');
            try {
                const res = await fetch('/api/analytics/clear', {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
                if (!res.ok) {
                    alert('Failed to clear logs.');
                    return;
                }
                const data = await res.json();
                if (data.success) {
                    loadAdminAnalytics();
                } else {
                    alert('Failed to clear logs.');
                }
            } catch (e) {
                alert('Server response error.');
            }
        });
    }

    // --- 6. SMOOTH SCROLL & ANIMATION SETTINGS LOGIC ---
    const settingsForm = document.getElementById('settings-form');
    const settingAboutSmooth = document.getElementById('setting-about-smooth');
    const settingProjectsSmooth = document.getElementById('setting-projects-smooth');
    const settingServicesSmooth = document.getElementById('setting-services-smooth');
    const settingSkillsSmooth = document.getElementById('setting-skills-smooth');
    const settingsStatus = document.getElementById('settings-status');

    async function loadAdminSettings() {
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) {
                console.warn("Settings API returned HTTP status:", res.status);
                return;
            }
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                console.warn("Settings API returned non-JSON content type:", contentType);
                return;
            }
            const data = await res.json();
            if (!data) return;

            if (settingAboutSmooth) settingAboutSmooth.checked = data.smoothScrollAbout !== false;
            if (settingProjectsSmooth) settingProjectsSmooth.checked = data.smoothScrollProjects !== false;
            if (settingServicesSmooth) settingServicesSmooth.checked = data.smoothScrollServices === true;
            if (settingSkillsSmooth) settingSkillsSmooth.checked = data.smoothScrollSkills === true;
        } catch (err) {
            console.error("Error loading settings:", err);
        }
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('zizo_admin_token');
            if (!token) return;

            settingsStatus.className = 'form-status';
            settingsStatus.textContent = 'Saving animation preferences to database...';

            const payload = {
                smoothScrollAbout: settingAboutSmooth ? settingAboutSmooth.checked : true,
                smoothScrollProjects: settingProjectsSmooth ? settingProjectsSmooth.checked : true,
                smoothScrollServices: settingServicesSmooth ? settingServicesSmooth.checked : false,
                smoothScrollSkills: settingSkillsSmooth ? settingSkillsSmooth.checked : false
            };

            try {
                const response = await fetch('/api/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (data.success) {
                    settingsStatus.className = 'form-status success';
                    settingsStatus.textContent = 'Animation & smooth scroll preferences saved and active immediately!';
                    setTimeout(() => {
                        settingsStatus.className = 'form-status';
                        settingsStatus.textContent = '';
                    }, 4000);
                } else {
                    settingsStatus.className = 'form-status error';
                    settingsStatus.textContent = data.message || 'Failed to save settings.';
                }
            } catch (err) {
                settingsStatus.className = 'form-status error';
                settingsStatus.textContent = 'Server response error.';
            }
        });
    }
});
