// ========== MENU TOGGLE ==========
function toggleMenu() {
  var links = document.querySelector('.nav-links');
  links.classList.toggle('show');
}

//========== DEFAULT JOBS ==========
function loadDefaultJobs() {
  var existing = localStorage.getItem('jobs');
  if (!existing) {
    var defaultJobs = [
      {
        title: 'Frontend Developer Intern',
        company: 'TechNova Ltd',
        location: 'Lagos',
        salary: '₦80,000/month',
        description: 'Build user interfaces with HTML, CSS, and JavaScript.'
      },
      {
        title: 'Data Entry Clerk',
        company: 'GlobalServe Inc',
        location: 'Abuja',
        salary: '₦50,000/month',
        description: 'Handle data entry and record management tasks.'
      },
      {
        title: 'IT Support Trainee',
        company: 'NetWorks Solutions',
        location: 'Port Harcourt',
        salary: '₦60,000/month',
        description: 'Provide technical support and troubleshooting.'
      }
    ];
    localStorage.setItem('jobs', JSON.stringify(defaultJobs));
  }
}

// ========== DISPLAY JOBS (Homepage) ==========
function displayJobs() {
  var jobList = document.getElementById('jobList');
  if (!jobList) return;
  var jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  jobList.innerHTML = '';
  jobs.forEach(function(job, index) {
    var card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML =
      '<h3>' + job.title + '</h3>' +
      '<p><strong>Company:</strong> ' + job.company + '</p>' +
      '<p><strong>Location:</strong> ' + job.location + '</p>' +
      '<p><strong>Salary:</strong> ' + job.salary + '</p>' +
      '<button onclick="alert(\'Please login to apply!\')">Apply</button>';
    jobList.appendChild(card);
  });
}

// ========== SEARCH JOBS ==========
function searchJobs() {
  var titleQuery = document.getElementById('searchTitle').value.toLowerCase();
  var locationQuery = document.getElementById('searchLocation').value.toLowerCase();
  var jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  var jobList = document.getElementById('jobList');
  jobList.innerHTML = '';

  var filtered = jobs.filter(function(job) {
    var matchTitle = job.title.toLowerCase().indexOf(titleQuery) !== -1;
    var matchLocation = job.location.toLowerCase().indexOf(locationQuery) !== -1;
    return matchTitle && matchLocation;
  });

  if (filtered.length === 0) {
    jobList.innerHTML = '<p style="text-align:center;color:#888;">No jobs found.</p>';
    return;
  }

  filtered.forEach(function(job) {
    var card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML =
      '<h3>' + job.title + '</h3>' +
      '<p><strong>Company:</strong> ' + job.company + '</p>' +
      '<p><strong>Location:</strong> ' + job.location + '</p>' +
      '<p><strong>Salary:</strong> ' + job.salary + '</p>' +
      '<button onclick="alert(\'Please login to apply!\')">Apply</button>';
    jobList.appendChild(card);
  });
}

// ========== REGISTER ==========
function registerUser(e) {
  e.preventDefault();
  var name = document.getElementById('regName').value;
  var email = document.getElementById('regEmail').value;
  var password = document.getElementById('regPassword').value;

  var users = JSON.parse(localStorage.getItem('users')) || [];
  var exists = users.some(function(u) { return u.email === email; });
  if (exists) {
    alert('Email already registered!');
    return;
  }

  users.push({ name: name, email: email, password: password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  window.location.href = 'login.html';
}

// ========== LOGIN ==========
function loginUser(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;

  var users = JSON.parse(localStorage.getItem('users')) || [];
  var user = users.find(function(u) {
    return u.email === email && u.password === password;
  });

  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Welcome, ' + user.name + '!');
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid email or password!');
  }
}

// ========== CHECK LOGIN ==========
function checkLogin() {
  var user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) {
    alert('Please login first!');
    window.location.href = 'login.html';
    return;
  }
  var nameEl = document.getElementById('userName');
  if (nameEl) nameEl.textContent = user.name;
}

// ========== LOGOUT ==========
function logoutUser() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

// ========== UPLOAD CV ==========
function uploadCV() {
  var fileInput = document.getElementById('cvFile');
  if (fileInput.files.length > 0) {
    var fileName = fileInput.files[0].name;
    var user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      user.cv = fileName;
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
    alert('CV uploaded: ' + fileName);
    showCVStatus();
  }
}

function showCVStatus() {
  var user = JSON.parse(localStorage.getItem('loggedInUser'));
  var statusEl = document.getElementById('cvStatus');
  if (user && user.cv && statusEl) {
    statusEl.textContent = 'Uploaded: ' + user.cv;
  }
}

// ========== DASHBOARD JOBS ==========
function displayDashboardJobs() {
  var jobList = document.getElementById('dashboardJobs');
  if (!jobList) return;
  var jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  jobList.innerHTML = '';

  jobs.forEach(function(job, index) {
    var card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML =
      '<h3>' + job.title + '</h3>' +
      '<p><strong>Company:</strong> ' + job.company + '</p>' +
      '<p><strong>Location:</strong> ' + job.location + '</p>' +
      '<p><strong>Salary:</strong> ' + job.salary + '</p>' +
      '<button onclick="applyForJob(' + index + ')">Apply</button>';
    jobList.appendChild(card);
  });
}

// ========== APPLY FOR JOB ==========
function applyForJob(index) {
  var user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) { alert('Please login!'); return; }

  var jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  var job = jobs[index];

  var applications = JSON.parse(localStorage.getItem('applications')) || [];
  var alreadyApplied = applications.some(function(a) {
    return a.email === user.email && a.jobTitle === job.title;
  });

  if (alreadyApplied) {
    alert('You already applied for this job!');
    return;
  }

  applications.push({
    name: user.name,
    email: user.email,
    jobTitle: job.title,
    company: job.company
  });
  localStorage.setItem('applications', JSON.stringify(applications));
  alert('Applied for ' + job.title + ' successfully!');
  displayAppliedJobs();
}

// ========== DISPLAY APPLIED JOBS ==========
function displayAppliedJobs() {
  var container = document.getElementById('appliedJobs');
  if (!container) return;
  var user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user) return;

  var applications = JSON.parse(localStorage.getItem('applications')) || [];
  var myApps = applications.filter(function(a) { return a.email === user.email; });

  container.innerHTML = '';
  if (myApps.length === 0) {
    container.innerHTML = '<p style="color:#888;">No applications yet.</p>';
    return;
  }

  myApps.forEach(function(app) {
    var div = document.createElement('div');
    div.className = 'applied-item';
    div.innerHTML = '<strong>' + app.jobTitle + '</strong> at ' + app.company;
    container.appendChild(div);
  });
}

// ========== POST JOB (Employer) ==========
function postJob(e) {
  e.preventDefault();
  var job = {
    title: document.getElementById('jobTitle').value,
    company: document.getElementById('jobCompany').value,
    location: document.getElementById('jobLocation').value,
    salary: document.getElementById('jobSalary').value,
    description: document.getElementById('jobDescription').value
  };

  var jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  jobs.push(job);
  localStorage.setItem('jobs', JSON.stringify(jobs));
  alert('Job posted successfully!');
  e.target.reset();
}

// ========== DISPLAY APPLICANTS (Employer) ==========
function displayApplicants() {
  var container = document.getElementById('applicantList');
  if (!container) return;

  var applications = JSON.parse(localStorage.getItem('applications')) || [];
  container.innerHTML = '';

  if (applications.length === 0) {
    container.innerHTML = '<p style="color:#888;">No applicants yet.</p>';
    return;
  }

  applications.forEach(function(app) {
    var div = document.createElement('div');
    div.className = 'applicant-item';
    div.innerHTML =
      '<p><strong>Name:</strong> ' + app.name + '</p>' +
      '<p><strong>Email:</strong> ' + app.email + '</p>' +
      '<p><strong>Applied for:</strong> ' + app.jobTitle + '</p>';
    container.appendChild(div);
  });
}

// ========== CONTACT FORM ==========
function submitContact(e) {
  e.preventDefault();
  alert('Thank you for your message! We will get back to you soon.');
  e.target.reset();
}
