/* IN-MEMORY DATA STORAGE & STATE MANAGEMENT */
let activeSportContext = "Field Demo";
let currentLoggedUser = null; // { type: 'student'|'facilitator'|'admin', name: '', sport: '', avatar: '' }

// Overall Admin Credentials & Profile Image Updated
const OVERALL_ADMIN = {
  username: "overall_admin",
  pass: "AdminMaster#2026",
  name: "SIR JAY CANTONJOS",
  image: "image/FB_IMG_1792398035694.jpg"
};

// Facilitator Accounts updated to match index.html names and images
const FACILITATOR_ACCOUNTS = [
  { username: "fielddemo_fac", pass: "FieldDemo@2026", name: "JEWELLA VALERA", sport: "Field Demo", image: "image/FB_IMG_1792398104851.jpg" },
  { username: "trackfield_fac", pass: "TrackField#2026", name: "ASHLEY MELLA", sport: "Track & Field", image: "image/FB_IMG_1792398123876.jpg" },
  { username: "badminton_fac", pass: "Badminton#2026", name: "NYLNIER LEU TAN", sport: "Badminton", image: "image/FB_IMG_1792398094588.jpg" },
  { username: "volleyball_fac", pass: "Volleyball#2026", name: "JAYSON HARE", sport: "Volleyball", image: "image/FB_IMG_1792398098506.jpg" },
  { username: "billiards_fac", pass: "Billiards#2026", name: "LINDSAY MALINIS", sport: "Billiards", image: "image/FB_IMG_1792398108333.jpg" },
  { username: "basketball_fac", pass: "Basketball#2026", name: "LESTER BALAGUER", sport: "Basketball", image: "image/FB_IMG_1792398111201.jpg" },
  { username: "darts_fac", pass: "Darts#2026", name: "RODENELLE HITOSIS", sport: "Darts", image: "image/FB_IMG_1792398117882.jpg" },
  { username: "sepak_fac", pass: "TakrawKing#2026", name: "CHARLENE GALLOSO", sport: "Sepak Takraw", image: "image/FB_IMG_1792398147374.jpg" },
  { username: "tabletennis_fac", pass: "TableTennis#2026", name: "WARREN JIONCO", sport: "Table Tennis", image: "image/FB_IMG_1792398139538.jpg" },
  { username: "chess_fac", pass: "Chess#2026", name: "EDZEL BALES", sport: "Chess", image: "image/FB_IMG_1792398114413.jpg" },
  { username: "quizscrabble_fac", pass: "IntellectQuiz!26", name: "MARY ALEXA BELASON", sport: "Quiz Bee & Scrabble", image: "image/FB_IMG_1792398147374.jpg" },
  { username: "dancevocal_fac", pass: "ArtisticTalent#26", name: "OLIVER MIGUEL GONZALES", sport: "Dance Sport & Vocal", image: "image/FB_IMG_1792398143966.jpg" }
];

// Initial Dynamic Registered Players Store
let playersDatabase = [
  { id: 1, firstName: "Juan", lastName: "Dela Cruz", yrBlock: "3A", age: 20, sex: "Male", contactNo: "09123456789", email: "juan@omg.com", sport: "Field Demo", status: "Active" },
  { id: 2, firstName: "Maria", lastName: "Santos", yrBlock: "2B", age: 19, sex: "Female", contactNo: "09987654321", email: "maria@omg.com", sport: "Volleyball", status: "Active" }
];

// Published Posts Database for Marquee & Home Display
let publishedPostsDatabase = [
  { id: 1, title: "Official Try-out Kickoff", sportCategory: "Field Demo", officialPlayer: "All Aspirants", content: "Welcome to BSIT Intramurals 2026 try-outs! Report to main grounds.", time: "Oct 19, 2026" },
  { id: 2, title: "Track & Field Sprints Prelims", sportCategory: "Track & Field", officialPlayer: "Registered Athletes", content: "100m and 400m dash heats commence at the oval starting 8:00 AM.", time: "Oct 19, 2026" }
];

// Event Group Chats Store
let chatDatabase = {
  "Field Demo": [
    { sender: "JEWELLA VALERA", text: "Welcome athletes! Practice starts this Friday at 4 PM.", time: "10:00 AM" }
  ],
  "Track & Field": [
    { sender: "ASHLEY MELLA", text: "Welcome to Track & Field! Bring running shoes and water bottles.", time: "08:30 AM" }
  ],
  "Badminton": [
    { sender: "NYLNIER LEU TAN", text: "Badminton court assignments for Men and Women are posted.", time: "09:00 AM" }
  ],
  "Volleyball": [
    { sender: "JAYSON HARE", text: "Volleyball orientation starts tomorrow.", time: "09:30 AM" }
  ]
};

// Staff Chat Store (Admin + Facilitators Only)
let staffChatDatabase = [
  { sender: OVERALL_ADMIN.name, text: "Welcome facilitators to the official staff command channel.", time: "08:00 AM" }
];

/* INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
  navigateTo('homeSection');
  renderPublishedMarquee();
  attachRealTimeValidations();
});

/* SIDEBAR CONTROLS */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("sidebarOverlay").classList.remove("active");
}

/* NAVIGATION ROUTER */
function navigateTo(sectionId) {
  closeSidebar();

  if (sectionId === 'staffChatSection') {
    if (!currentLoggedUser || (currentLoggedUser.type !== 'admin' && currentLoggedUser.type !== 'facilitator')) {
      alert("Restricted Access! The Staff Command Chat is accessible exclusively by the Overall Admin and authorized Facilitators.");
      navigateTo('loginSection');
      return;
    }
  }

  const sections = document.querySelectorAll(".view-section");
  sections.forEach(sec => sec.classList.remove("active"));
  
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (sectionId === 'homeSection') {
    renderPublishedMarquee();
  } else if (sectionId === 'chatSection') {
    renderGroupChat();
  } else if (sectionId === 'staffChatSection') {
    renderStaffChat();
  } else if (sectionId === 'facilitatorDashboardSection') {
    renderFacilitatorDashboard();
  } else if (sectionId === 'overallAdminDashboardSection') {
    renderOverallAdminDashboard();
  }
}

/* REAL-TIME VALIDATIONS */
function showErrorMsg(inputElem, message) {
  alert("Error! " + message);
  inputElem.focus();
  inputElem.style.borderColor = "#FF0000";
}

function resetFieldStyle(inputElem) {
  inputElem.style.borderColor = "#E2E8F0";
}

function attachRealTimeValidations() {
  const nameInputIds = ["firstName", "lastName", "middleName", "mFirstName", "mLastName"];
  nameInputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", function() {
        const val = this.value;
        if (val && !/^[a-zA-Z\s]*$/.test(val)) {
          showErrorMsg(this, "invalid input");
          this.value = val.replace(/[^a-zA-Z\s]/g, "");
        } else {
          resetFieldStyle(this);
        }
      });
    }
  });

  const numberInputIds = ["age", "contactNo", "mAge", "mContact"];
  numberInputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", function() {
        const val = this.value;
        if (val && !/^\d*$/.test(val)) {
          showErrorMsg(this, "invalid input");
          this.value = val.replace(/\D/g, "");
        } else {
          resetFieldStyle(this);
        }
      });
    }
  });
}

function validateName(input) {
  const value = input.value.trim();
  if (value && !/^[a-zA-Z\s]+$/.test(value)) {
    showErrorMsg(input, "invalid input");
    return false;
  }
  resetFieldStyle(input);
  return true;
}

function validateAge(input) {
  const value = input.value.trim();
  if (value && !/^\d+$/.test(value)) {
    showErrorMsg(input, "invalid input");
    return false;
  }
  resetFieldStyle(input);
  return true;
}

function validateContact(input) {
  const value = input.value.trim();
  if (value && (!/^\d+$/.test(value) || value.length > 11)) {
    showErrorMsg(input, "invalid input");
    return false;
  }
  resetFieldStyle(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();
  if (value && !value.includes("@omg.com")) {
    showErrorMsg(input, "invalid input");
    return false;
  }
  resetFieldStyle(input);
  return true;
}

function validatePassword(input) {
  const value = input.value;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
  if (value && !regex.test(value)) {
    showErrorMsg(input, "invalid input");
    return false;
  }
  resetFieldStyle(input);
  return true;
}

function togglePasswordVisibility(inputId, iconElem) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    iconElem.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    iconElem.classList.replace("fa-eye-slash", "fa-eye");
  }
}

/* REGISTRATION PROCESS */
function openRegistration(sportName) {
  activeSportContext = sportName;
  document.getElementById("selectedSportNameDisplay").innerText = sportName.toUpperCase();
  
  const iconElem = document.getElementById("sportHeaderIcon");
  if (sportName.includes("Track & Field")) iconElem.className = "fa-solid fa-person-running";
  else if (sportName.includes("Badminton")) iconElem.className = "fa-solid fa-feather";
  else if (sportName.includes("Volleyball")) iconElem.className = "fa-solid fa-volleyball";
  else if (sportName.includes("Basketball")) iconElem.className = "fa-solid fa-basketball";
  else if (sportName.includes("Chess")) iconElem.className = "fa-solid fa-chess";
  else iconElem.className = "fa-solid fa-trophy";

  document.getElementById("tryoutForm").reset();
  navigateTo("registrationSection");
}

function handleRegistrationSubmit(event) {
  event.preventDefault();

  const fn = document.getElementById("firstName");
  const ln = document.getElementById("lastName");
  const mn = document.getElementById("middleName");
  const age = document.getElementById("age");
  const contact = document.getElementById("contactNo");
  const email = document.getElementById("regEmail");
  const pass = document.getElementById("regPassword");

  if (!validateName(fn) || !validateName(ln) || !validateName(mn)) return;
  if (!validateAge(age)) return;
  if (!validateContact(contact)) return;
  if (!validateEmail(email)) return;
  if (!validatePassword(pass)) return;

  const newPlayer = {
    id: Date.now(),
    firstName: fn.value.trim(),
    lastName: ln.value.trim(),
    yrBlock: document.getElementById("yrBlock").value,
    age: age.value.trim(),
    sex: document.getElementById("sex").value,
    contactNo: contact.value.trim(),
    email: email.value.trim(),
    sport: activeSportContext,
    status: "Active"
  };

  playersDatabase.push(newPlayer);

  currentLoggedUser = {
    type: "student",
    name: `${newPlayer.firstName} ${newPlayer.lastName}`,
    sport: activeSportContext,
    avatar: "image/23456777.jpg",
    details: newPlayer
  };

  document.getElementById("profileBtn").classList.remove("hidden");
  document.getElementById("headerAvatarImg").src = currentLoggedUser.avatar;
  navigateTo("chatSection");
}

/* PUBLISHED POSTS MARQUEE */
function renderPublishedMarquee() {
  const box = document.getElementById("publishedMarqueeBox");
  if (!box) return;
  box.innerHTML = "";

  if (publishedPostsDatabase.length === 0) {
    box.innerHTML = `<div class="marquee-item"><span>No published announcements yet.</span></div>`;
    return;
  }

  publishedPostsDatabase.forEach(post => {
    box.innerHTML += `
      <div class="marquee-item">
        <div class="marquee-badge"><i class="fa-solid fa-trophy"></i> ${post.sportCategory}</div>
        <h4>${post.title}</h4>
        <p><strong>Official Player / Honoree:</strong> ${post.officialPlayer}</p>
        <p>${post.content}</p>
        <span class="marquee-time">${post.time}</span>
      </div>
    `;
  });
}

/* MESSENGER GROUP CHAT SYSTEM */
function renderGroupChat() {
  document.getElementById("chatTitleDisplay").innerText = `${activeSportContext.toUpperCase()} GROUP CHAT`;
  
  const memberList = document.getElementById("chatMemberList");
  memberList.innerHTML = "";

  const facObj = FACILITATOR_ACCOUNTS.find(f => f.sport === activeSportContext);
  if (facObj) {
    memberList.innerHTML += `
      <li class="member-item">
        <img src="${facObj.image}" alt="Fac" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80'">
        <div class="member-info">
          <h5>${facObj.name}</h5>
          <span>Facilitator</span>
        </div>
      </li>
    `;
  }

  const teamAthletes = playersDatabase.filter(p => p.sport === activeSportContext);
  teamAthletes.forEach(a => {
    memberList.innerHTML += `
      <li class="member-item">
        <img src="image/23456777.jpg" alt="User" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'">
        <div class="member-info">
          <h5>${a.firstName} ${a.lastName}</h5>
          <span>Athlete (${a.yrBlock} - ${a.sex})</span>
        </div>
      </li>
    `;
  });

  renderChatMessages();
}

function renderChatMessages() {
  const box = document.getElementById("chatMessagesBox");
  box.innerHTML = "";
  const msgs = chatDatabase[activeSportContext] || [];

  msgs.forEach(m => {
    const isSelf = currentLoggedUser && m.sender === currentLoggedUser.name;
    box.innerHTML += `
      <div class="message-bubble ${isSelf ? 'outgoing' : 'incoming'}">
        <div class="msg-sender">${m.sender}</div>
        <div>${m.text}</div>
        <span class="msg-time">${m.time}</span>
      </div>
    `;
  });

  box.scrollTop = box.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const msgText = input.value.trim();
  if (!msgText) return;

  const senderName = currentLoggedUser ? currentLoggedUser.name : "Guest Athlete";
  if (!chatDatabase[activeSportContext]) chatDatabase[activeSportContext] = [];

  chatDatabase[activeSportContext].push({
    sender: senderName,
    text: msgText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  input.value = "";
  renderChatMessages();
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') sendMessage();
}

/* STAFF CHAT */
function renderStaffChat() {
  if (!currentLoggedUser || (currentLoggedUser.type !== 'admin' && currentLoggedUser.type !== 'facilitator')) {
    alert("Unauthorized access denied.");
    navigateTo('loginSection');
    return;
  }

  const memberList = document.getElementById("staffMemberList");
  memberList.innerHTML = "";

  memberList.innerHTML += `
    <li class="member-item">
      <img src="${OVERALL_ADMIN.image}" alt="Admin" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'">
      <div class="member-info">
        <h5>${OVERALL_ADMIN.name}</h5>
        <span style="color:var(--primary-red); font-weight:700;">Overall Admin</span>
      </div>
    </li>
  `;

  FACILITATOR_ACCOUNTS.forEach(f => {
    memberList.innerHTML += `
      <li class="member-item">
        <img src="${f.image}" alt="Fac" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80'">
        <div class="member-info">
          <h5>${f.name}</h5>
          <span>${f.sport} Facilitator</span>
        </div>
      </li>
    `;
  });

  renderStaffChatMessages();
}

function renderStaffChatMessages() {
  const box = document.getElementById("staffChatMessagesBox");
  box.innerHTML = "";

  staffChatDatabase.forEach(m => {
    const isSelf = currentLoggedUser && m.sender === currentLoggedUser.name;
    box.innerHTML += `
      <div class="message-bubble ${isSelf ? 'outgoing' : 'incoming'}">
        <div class="msg-sender">${m.sender}</div>
        <div>${m.text}</div>
        <span class="msg-time">${m.time}</span>
      </div>
    `;
  });

  box.scrollTop = box.scrollHeight;
}

function sendStaffMessage() {
  const input = document.getElementById("staffChatInput");
  const msgText = input.value.trim();
  if (!msgText) return;

  const senderName = currentLoggedUser ? currentLoggedUser.name : "Staff Member";

  staffChatDatabase.push({
    sender: senderName,
    text: msgText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  input.value = "";
  renderStaffChatMessages();
}

function handleStaffChatKeyPress(e) {
  if (e.key === 'Enter') sendStaffMessage();
}

/* LOGIN SYSTEM */
function handleLoginSubmit(event) {
  event.preventDefault();
  const un = document.getElementById("loginUsername").value.trim();
  const pw = document.getElementById("loginPassword").value;

  if (un === OVERALL_ADMIN.username && pw === OVERALL_ADMIN.pass) {
    currentLoggedUser = {
      type: "admin",
      name: OVERALL_ADMIN.name,
      sport: "OVERALL ADMIN",
      avatar: OVERALL_ADMIN.image
    };
    document.getElementById("profileBtn").classList.remove("hidden");
    document.getElementById("headerAvatarImg").src = OVERALL_ADMIN.image;
    document.getElementById("modalAvatarPreview").src = OVERALL_ADMIN.image;
    navigateTo("overallAdminDashboardSection");
    return;
  }

  const facMatch = FACILITATOR_ACCOUNTS.find(f => f.username === un && f.pass === pw);
  if (facMatch) {
    currentLoggedUser = {
      type: "facilitator",
      name: facMatch.name,
      sport: facMatch.sport,
      avatar: facMatch.image
    };
    activeSportContext = facMatch.sport;
    document.getElementById("profileBtn").classList.remove("hidden");
    document.getElementById("headerAvatarImg").src = facMatch.image;
    document.getElementById("modalAvatarPreview").src = facMatch.image;
    navigateTo("facilitatorDashboardSection");
    return;
  }

  const studentMatch = playersDatabase.find(p => p.email === un);
  if (studentMatch) {
    currentLoggedUser = {
      type: "student",
      name: `${studentMatch.firstName} ${studentMatch.lastName}`,
      sport: studentMatch.sport,
      avatar: "image/23456777.jpg",
      details: studentMatch
    };
    activeSportContext = studentMatch.sport;
    document.getElementById("profileBtn").classList.remove("hidden");
    document.getElementById("headerAvatarImg").src = currentLoggedUser.avatar;
    document.getElementById("modalAvatarPreview").src = currentLoggedUser.avatar;
    navigateTo("chatSection");
    return;
  }

  alert("Error! Invalid Username or Password.");
}

/* FORGOT PASSWORD MODAL CONTROLS */
function openForgotPasswordModal() {
  document.getElementById("forgotPasswordForm").reset();
  document.getElementById("forgotPasswordModal").classList.add("active");
}

function closeForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").classList.remove("active");
}

function handleForgotPasswordSubmit(event) {
  event.preventDefault();
  const inputVal = document.getElementById("recoveryEmailInput").value.trim();
  
  if (!inputVal) {
    alert("Please enter a valid username or email.");
    return;
  }

  let found = false;
  if (inputVal === OVERALL_ADMIN.username) {
    found = true;
  } else if (FACILITATOR_ACCOUNTS.some(f => f.username === inputVal)) {
    found = true;
  } else if (playersDatabase.some(p => p.email === inputVal)) {
    found = true;
  }

  if (found || inputVal.includes("@omg.com") || inputVal === "overall_admin") {
    alert("Password reset instructions have been sent to your email / account records.");
    closeForgotPasswordModal();
  } else {
    alert("Account not found in the database. Please check your username or email.");
  }
}

/* OVERALL ADMIN DASHBOARD & POST CRUD */
function renderOverallAdminDashboard() {
  if (!currentLoggedUser || currentLoggedUser.type !== 'admin') {
    alert("Restricted Access! Overall Admin privileges required.");
    navigateTo("loginSection");
    return;
  }

  const tableBody = document.getElementById("adminPostsTableBody");
  tableBody.innerHTML = "";

  if (publishedPostsDatabase.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 1.5rem;">No published posts available.</td></tr>`;
    return;
  }

  publishedPostsDatabase.forEach(post => {
    tableBody.innerHTML += `
      <tr>
        <td><strong>${post.title}</strong></td>
        <td><span class="status-badge status-Qualified">${post.sportCategory}</span></td>
        <td>${post.officialPlayer}</td>
        <td>${post.content.substring(0, 50)}...</td>
        <td>
          <button class="action-btn edit-action" onclick="openEditPostModal(${post.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn delete-action" onclick="deletePost(${post.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

function openCreatePostModal() {
  document.getElementById("postModalTitle").innerText = "CREATE POST & ANNOUNCEMENT";
  document.getElementById("editPostId").value = "";
  document.getElementById("postManageForm").reset();
  document.getElementById("postModal").classList.add("active");
}

function openEditPostModal(id) {
  const post = publishedPostsDatabase.find(p => p.id === id);
  if (!post) return;

  document.getElementById("postModalTitle").innerText = "EDIT POST & ANNOUNCEMENT";
  document.getElementById("editPostId").value = post.id;
  document.getElementById("postTitleInput").value = post.title;
  document.getElementById("postSportCategory").value = post.sportCategory;
  document.getElementById("postOfficialPlayer").value = post.officialPlayer;
  document.getElementById("postContentInput").value = post.content;

  document.getElementById("postModal").classList.add("active");
}

function closePostModal() {
  document.getElementById("postModal").classList.remove("active");
}

function handlePostModalSave(e) {
  e.preventDefault();
  const idVal = document.getElementById("editPostId").value;
  const title = document.getElementById("postTitleInput").value;
  const sportCategory = document.getElementById("postSportCategory").value;
  const officialPlayer = document.getElementById("postOfficialPlayer").value;
  const content = document.getElementById("postContentInput").value;

  if (idVal) {
    const post = publishedPostsDatabase.find(p => p.id == idVal);
    if (post) {
      post.title = title;
      post.sportCategory = sportCategory;
      post.officialPlayer = officialPlayer;
      post.content = content;
    }
  } else {
    const newPost = {
      id: Date.now(),
      title: title,
      sportCategory: sportCategory,
      officialPlayer: officialPlayer,
      content: content,
      time: new Date().toLocaleDateString()
    };
    publishedPostsDatabase.push(newPost);
  }

  closePostModal();
  renderOverallAdminDashboard();
  renderPublishedMarquee();
  alert("Post published successfully and updated on home marquee!");
}

function deletePost(id) {
  if (confirm("Are you sure you want to delete this published post?")) {
    publishedPostsDatabase = publishedPostsDatabase.filter(p => p.id !== id);
    renderOverallAdminDashboard();
    renderPublishedMarquee();
  }
}

/* FACILITATOR DASHBOARD CRUD */
function renderFacilitatorDashboard() {
  if (!currentLoggedUser || currentLoggedUser.type !== 'facilitator') {
    alert("Restricted Access! Facilitator privileges required.");
    navigateTo("loginSection");
    return;
  }

  document.getElementById("dashFacilitatorTitle").innerText = `${currentLoggedUser.sport.toUpperCase()} FACILITATOR DASHBOARD`;
  document.getElementById("dashFacilitatorSub").innerText = `Managing Coordinator: ${currentLoggedUser.name}`;

  const tableBody = document.getElementById("playerTableBody");
  tableBody.innerHTML = "";

  const sportPlayers = playersDatabase.filter(p => p.sport === currentLoggedUser.sport);

  if (sportPlayers.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 1.5rem;">No players registered for this sport yet.</td></tr>`;
  } else {
    sportPlayers.forEach(p => {
      tableBody.innerHTML += `
        <tr>
          <td><strong>${p.firstName} ${p.lastName}</strong></td>
          <td>${p.yrBlock}</td>
          <td>${p.age} / ${p.sex}</td>
          <td>${p.contactNo}</td>
          <td>${p.email}</td>
          <td><span class="status-badge status-${p.status}">${p.status}</span></td>
          <td>
            <button class="action-btn edit-action" onclick="openEditPlayerModal(${p.id})" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete-action" onclick="deletePlayer(${p.id})" title="Delete/Terminate"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
  }

  renderDashChatMessages();
}

function renderDashChatMessages() {
  const box = document.getElementById("dashChatMessagesBox");
  box.innerHTML = "";
  const msgs = chatDatabase[currentLoggedUser.sport] || [];

  msgs.forEach(m => {
    const isSelf = m.sender === currentLoggedUser.name;
    box.innerHTML += `
      <div class="message-bubble ${isSelf ? 'outgoing' : 'incoming'}">
        <div class="msg-sender">${m.sender}</div>
        <div>${m.text}</div>
        <span class="msg-time">${m.time}</span>
      </div>
    `;
  });

  box.scrollTop = box.scrollHeight;
}

function sendDashMessage() {
  const input = document.getElementById("dashChatInput");
  const msgText = input.value.trim();
  if (!msgText) return;

  if (!chatDatabase[currentLoggedUser.sport]) chatDatabase[currentLoggedUser.sport] = [];

  chatDatabase[currentLoggedUser.sport].push({
    sender: currentLoggedUser.name,
    text: msgText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  input.value = "";
  renderDashChatMessages();
}

function handleDashChatKeyPress(e) {
  if (e.key === 'Enter') sendDashMessage();
}

/* PLAYER CRUD MODAL ACTIONS */
function openAddPlayerModal() {
  document.getElementById("playerModalTitle").innerText = "ADD NEW PLAYER";
  document.getElementById("editPlayerIndex").value = "";
  document.getElementById("playerManageForm").reset();
  document.getElementById("playerModal").classList.add("active");
}

function openEditPlayerModal(id) {
  const p = playersDatabase.find(player => player.id === id);
  if (!p) return;

  document.getElementById("playerModalTitle").innerText = "EDIT PLAYER DETAILS";
  document.getElementById("editPlayerIndex").value = p.id;
  document.getElementById("mFirstName").value = p.firstName;
  document.getElementById("mLastName").value = p.lastName;
  document.getElementById("mYrBlock").value = p.yrBlock;
  document.getElementById("mAge").value = p.age;
  document.getElementById("mSex").value = p.sex;
  document.getElementById("mContact").value = p.contactNo;
  document.getElementById("mStatus").value = p.status;

  document.getElementById("playerModal").classList.add("active");
}

function closePlayerModal() {
  document.getElementById("playerModal").classList.remove("active");
}

function handlePlayerModalSave(e) {
  e.preventDefault();
  const idVal = document.getElementById("editPlayerIndex").value;

  if (idVal) {
    const p = playersDatabase.find(player => player.id == idVal);
    if (p) {
      p.firstName = document.getElementById("mFirstName").value;
      p.lastName = document.getElementById("mLastName").value;
      p.yrBlock = document.getElementById("mYrBlock").value;
      p.age = document.getElementById("mAge").value;
      p.sex = document.getElementById("mSex").value;
      p.contactNo = document.getElementById("mContact").value;
      p.status = document.getElementById("mStatus").value;
    }
  } else {
    const newP = {
      id: Date.now(),
      firstName: document.getElementById("mFirstName").value,
      lastName: document.getElementById("mLastName").value,
      yrBlock: document.getElementById("mYrBlock").value,
      age: document.getElementById("mAge").value,
      sex: document.getElementById("mSex").value,
      contactNo: document.getElementById("mContact").value,
      email: `${document.getElementById("mFirstName").value.toLowerCase()}@omg.com`,
      sport: currentLoggedUser.sport,
      status: document.getElementById("mStatus").value
    };
    playersDatabase.push(newP);
  }

  closePlayerModal();
  renderFacilitatorDashboard();
}

function deletePlayer(id) {
  if (confirm("Are you sure you want to remove/terminate this player from the roster?")) {
    playersDatabase = playersDatabase.filter(p => p.id !== id);
    renderFacilitatorDashboard();
  }
}

/* ATHLETE PROFILE MODAL & LOGOUT */
function openProfileModal() {
  if (!currentLoggedUser) return;

  if (currentLoggedUser.type === 'student' && currentLoggedUser.details) {
    const d = currentLoggedUser.details;
    document.getElementById("profFirstName").value = d.firstName;
    document.getElementById("profLastName").value = d.lastName;
    document.getElementById("profContact").value = d.contactNo;
    document.getElementById("profSport").value = d.sport;
  } else {
    document.getElementById("profFirstName").value = currentLoggedUser.name.split(" ")[0] || "";
    document.getElementById("profLastName").value = currentLoggedUser.name.split(" ")[1] || "";
    document.getElementById("profContact").value = "09123456789";
    document.getElementById("profSport").value = currentLoggedUser.sport;
  }

  document.getElementById("profileModal").classList.add("active");
}

function closeProfileModal() {
  document.getElementById("profileModal").classList.remove("active");
}

function changeAvatar() {
  const newUrl = prompt("Enter Image URL for new Profile Picture:", "image/23456777.jpg");
  if (newUrl) {
    document.getElementById("modalAvatarPreview").src = newUrl;
    document.getElementById("headerAvatarImg").src = newUrl;
    if (currentLoggedUser) {
      currentLoggedUser.avatar = newUrl;
    }
  }
}

function saveProfile(e) {
  e.preventDefault();
  const fn = document.getElementById("profFirstName").value;
  const ln = document.getElementById("profLastName").value;

  if (currentLoggedUser) {
    currentLoggedUser.name = `${fn} ${ln}`;
    if (currentLoggedUser.details) {
      currentLoggedUser.details.firstName = fn;
      currentLoggedUser.details.lastName = ln;
      currentLoggedUser.details.contactNo = document.getElementById("profContact").value;
    }
  }

  alert("Profile updated successfully!");
  closeProfileModal();
}

function logout() {
  currentLoggedUser = null;
  document.getElementById("profileBtn").classList.add("hidden");
  closeProfileModal();
  navigateTo("homeSection");
}

/* FAQ TOGGLE ACCORDION */
function toggleFaq(element) {
  element.classList.toggle("active");
}