const JASMINE_PASSWORD = "angganda";

// Default users repository
const defaultRegisteredUsers = [
    { name: "Jasmine S. Lapaz", email: "jasmine.lapaz@cvsu.edu.ph", pass: "angganda", role: "jasmine" },
    { name: "Cenicare Admin", email: "admin@cenicare.ph", pass: "adminpassword", role: "admin" }
];

// Load users from localStorage if available, otherwise use defaults
let registeredUsers = JSON.parse(localStorage.getItem('cenicare_users')) || defaultRegisteredUsers;

function saveUsersToLocalStorage() {
    localStorage.setItem('cenicare_users', JSON.stringify(registeredUsers));
}

let currentUser = registeredUsers[0];
let currentClientIndex = null;

// Initial 20 records (4 active, 16 completed) used if localStorage is empty
const defaultClientsData = [
    // 4 ACTIVE / ONGOING RECORDS
    { name: "Juan Dela Cruz", deceased: "Pedro Dela Cruz", decAge: "72", decDate: "October 16, 2026", decCause: "Cardiac Arrest", address: "123 Main St, General Trias, Cavite", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 4: Executive Metal Package", addOns: "Fresh Flower Wreath, Photo Frame", paid: "PHP 15,000", balance: "PHP 84,750", date: "October 20, 2026 - 10:00 AM", burial: "Golden Haven Memorial Park", status: "Active / Ongoing Viewing & Service", chapel: "St. Peter Chapel A" },
    { name: "Pedro Penduko", deceased: "Teofilo Penduko", decAge: "65", decDate: "October 15, 2026", decCause: "Stroke", address: "789 Rizal Ave, Dasmariñas, Cavite", relation: "Brother", serviceType: "Cremation", pkgName: "Service 1: Direct Cremation Package", addOns: "Keepsake Urn", paid: "PHP 10,000", balance: "PHP 19,500", date: "October 21, 2026 - 1:00 PM", burial: "Dasmariñas Memorial Gardens", status: "Active / Pending Interment", chapel: "St. Jude Chapel B" },
    { name: "Carlos Gomez", deceased: "Tomas Gomez", decAge: "80", decDate: "October 16, 2026", decCause: "Heart Failure", address: "88 Mabini St, Kawit, Cavite", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 2: Standard Wooden Package", addOns: "Fresh Flower Wreath", paid: "PHP 8,000", balance: "PHP 40,500", date: "October 22, 2026 - 9:00 AM", burial: "Cavite Memorial Center", status: "Active / Ongoing Service", chapel: "Chapel Main Hall" },
    { name: "Elena Mercado", deceased: "Simeon Mercado", decAge: "78", decDate: "October 17, 2026", decCause: "Natural Causes", address: "14 Tanza-Trece Rd, Tanza, Cavite", relation: "Husband", serviceType: "Cremation", pkgName: "Service 3: Cremation & Memorial Chapel", addOns: "Additional Viewing Day", paid: "PHP 12,000", balance: "PHP 54,500", date: "October 23, 2026 - 2:00 PM", burial: "Tanza Public Cemetery", status: "Active / Pending Burial", chapel: "Chapel C" },

    // 16 COMPLETED & BURIED / CREMATORY RECORDS
    { name: "Maria Santos", deceased: "Jose Santos", decAge: "68", decDate: "October 01, 2026", decCause: "Pneumonia", address: "456 Acacia St, Imus, Cavite", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 2: Standard Wooden Package", addOns: "None", paid: "PHP 45,000", balance: "PHP 0", date: "October 03, 2026", burial: "Heritage Park Taguig", status: "Completed & Buried", chapel: "Chapel B" },
    { name: "Ana Reyes", deceased: "Mateo Reyes", decAge: "75", decDate: "October 02, 2026", decCause: "Old Age", address: "12 San Francisco, Gen. Trias", relation: "Husband", serviceType: "Cremation", pkgName: "Service 1: Direct Cremation Package", addOns: "Keepsake Urn", paid: "PHP 29,500", balance: "PHP 0", date: "October 04, 2026", burial: "San Francisco Crematorium", status: "Completed & Cremated", chapel: "Chapel A" },
    { name: "Beatriz Villanueva", deceased: "Clara Villanueva", decAge: "70", decDate: "October 03, 2026", decCause: "Kidney Disease", address: "45 Aguinaldo Highway, Bacoor", relation: "Mother", serviceType: "Traditional Burial", pkgName: "Service 3: Cremation & Memorial Chapel", addOns: "Photo Frame", paid: "PHP 66,200", balance: "PHP 0", date: "October 05, 2026", burial: "Bacoor Catholic Cemetery", status: "Completed & Buried", chapel: "Chapel B" },
    { name: "Roberto Tan", deceased: "Linda Tan", decAge: "64", decDate: "October 04, 2026", decCause: "Cancer", address: "99 Salitran, Dasmariñas, Cavite", relation: "Wife", serviceType: "Traditional Burial", pkgName: "Service 5: VIP Grand Presidential", addOns: "Fresh Flower Wreath", paid: "PHP 153,500", balance: "PHP 0", date: "October 06, 2026", burial: "Heaven's Gate Memorial Park", status: "Completed & Buried", chapel: "Chapel C" },
    { name: "Gabriel Mendoza", deceased: "Emilio Mendoza", decAge: "71", decDate: "October 05, 2026", decCause: "Respiratory Failure", address: "22 Malagasang, Imus, Cavite", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 2: Standard Wooden Package", addOns: "None", paid: "PHP 45,000", balance: "PHP 0", date: "October 07, 2026", burial: "Imus Public Cemetery", status: "Completed & Buried", chapel: "Chapel E" },
    { name: "Rosario Alcantara", deceased: "Teresa Alcantara", decAge: "60", decDate: "October 06, 2026", decCause: "Hypertension", address: "56 Manggahan, General Trias", relation: "Sister", serviceType: "Cremation", pkgName: "Service 1: Direct Cremation Package", addOns: "None", paid: "PHP 25,000", balance: "PHP 0", date: "October 08, 2026", burial: "Golden Haven Columbarium", status: "Completed & Cremated", chapel: "Chapel B" },
    { name: "Ferdinand Aquino", deceased: "Benigno Aquino Sr.", decAge: "82", decDate: "October 07, 2026", decCause: "Old Age", address: "77 Pook Langka, Dasmariñas", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 4: Executive Metal Package", addOns: "Photo Frame", paid: "PHP 100,950", balance: "PHP 0", date: "October 09, 2026", burial: "Dasmariñas Memorial Gardens", status: "Completed & Buried", chapel: "Chapel C" },
    { name: "Luzviminda Ramos", deceased: "Generoso Ramos", decAge: "69", decDate: "October 08, 2026", decCause: "Cardiac Arrest", address: "33 Bucandala, Imus, Cavite", relation: "Husband", serviceType: "Traditional Burial", pkgName: "Service 5: VIP Grand Presidential", addOns: "Fresh Flower Wreath, Photo Frame", paid: "PHP 154,700", balance: "PHP 0", date: "October 10, 2026", burial: "Heritage Park Taguig", status: "Completed & Buried", chapel: "Chapel D" },
    { name: "Eduardo Dizon", deceased: "Manuel Dizon", decAge: "63", decDate: "October 09, 2026", decCause: "Liver Failure", address: "89 San Agustin, Trece Martires", relation: "Brother", serviceType: "Cremation", pkgName: "Service 3: Cremation & Memorial Chapel", addOns: "Keepsake Urn", paid: "PHP 69,500", balance: "PHP 0", date: "October 11, 2026", burial: "Trece Memorial Park", status: "Completed & Cremated", chapel: "Chapel A" },
    { name: "Corazon Navarro", deceased: "Consuelo Navarro", decAge: "76", decDate: "October 10, 2026", decCause: "Pneumonia", address: "101 Tejero, General Trias, Cavite", relation: "Mother", serviceType: "Traditional Burial", pkgName: "Service 2: Standard Wooden Package", addOns: "None", paid: "PHP 45,000", balance: "PHP 0", date: "October 12, 2026", burial: "Tejero Cemetery", status: "Completed & Buried", chapel: "Chapel B" },
    { name: "Ramon Magsaysay Jr.", deceased: "Ramon Magsaysay Sr.", decAge: "85", decDate: "October 11, 2026", decCause: "Natural Causes", address: "21 Poblacion, Naic, Cavite", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 4: Executive Metal Package", addOns: "None", paid: "PHP 99,750", balance: "PHP 0", date: "October 13, 2026", burial: "Naic Catholic Cemetery", status: "Completed & Buried", chapel: "Chapel C" },
    { name: "Imelda Romualdez", deceased: "Vicente Romualdez", decAge: "73", decDate: "October 12, 2026", decCause: "Stroke", address: "55 Anabu, Imus, Cavite", relation: "Uncle", serviceType: "Cremation", pkgName: "Service 1: Direct Cremation Package", addOns: "Keepsake Urn", paid: "PHP 29,500", balance: "PHP 0", date: "October 14, 2026", burial: "Heaven's Gate Memorial Park", status: "Completed & Cremated", chapel: "Chapel D" },
    { name: "Jose Mari Chan", deceased: "Antonio Chan", decAge: "81", decDate: "October 13, 2026", decCause: "Old Age", address: "44 Pasong Camachile, Gen. Trias", relation: "Uncle", serviceType: "Traditional Burial", pkgName: "Service 3: Cremation & Memorial Chapel", addOns: "Photo Frame", paid: "PHP 66,200", balance: "PHP 0", date: "October 15, 2026", burial: "Golden Haven Memorial Park", status: "Completed & Buried", chapel: "Chapel A" },
    { name: "Gloria Macapagal", deceased: "Diosdado Macapagal", decAge: "86", decDate: "October 14, 2026", decCause: "Heart Failure", address: "66 San Juan, Noveleta, Cavite", relation: "Father", serviceType: "Traditional Burial", pkgName: "Service 5: VIP Grand Presidential", addOns: "Fresh Flower Wreath", paid: "PHP 153,500", balance: "PHP 0", date: "October 16, 2026", burial: "Noveleta Public Cemetery", status: "Completed & Buried", chapel: "Chapel B" },
    { name: "Benigno Aquino III", deceased: "Agapito Aquino", decAge: "67", decDate: "October 14, 2026", decCause: "Complications", address: "12 Sampaloc, Dasmariñas, Cavite", relation: "Brother", serviceType: "Traditional Burial", pkgName: "Service 2: Standard Wooden Package", addOns: "None", paid: "PHP 45,000", balance: "PHP 0", date: "October 17, 2026", burial: "Dasmariñas Memorial Gardens", status: "Completed & Buried", chapel: "Chapel C" },
    { name: "Victoria Soriano", deceased: "Artemio Soriano", decAge: "74", decDate: "October 15, 2026", decCause: "Cardiac Arrest", address: "88 Tejeros Convention, Rosario", relation: "Husband", serviceType: "Traditional Burial", pkgName: "Service 4: Executive Metal Package", addOns: "Photo Frame", paid: "PHP 100,950", balance: "PHP 0", date: "October 17, 2026", burial: "Rosario Catholic Cemetery", status: "Completed & Buried", chapel: "Chapel D" }
];

let clientsData = JSON.parse(localStorage.getItem('cenicare_clients')) || defaultClientsData;

function saveClientsToLocalStorage() {
    localStorage.setItem('cenicare_clients', JSON.stringify(clientsData));
}

window.onload = function() {
    renderUserSelectOptions();
};

function renderUserSelectOptions() {
    const select = document.getElementById('login-role');
    select.innerHTML = '';
    registeredUsers.forEach((u, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = `${u.name} (${u.role === 'jasmine' ? 'Main Operator' : 'Admin User'})`;
        select.appendChild(option);
    });
    updateLoginEmail();
}

function updateLoginEmail() {
    const selectVal = document.getElementById('login-role').value;
    const user = registeredUsers[selectVal] || registeredUsers[0];
    document.getElementById('login-email').value = user.email;
}

function openRegisterModal() {
    document.getElementById('register-modal').classList.add('active');
}

function closeRegisterModal() {
    document.getElementById('register-modal').classList.remove('active');
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-auth-password').value = '';
}

function registerNewAdmin() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value.trim();
    const authPass = document.getElementById('reg-auth-password').value.trim();

    if (authPass !== JASMINE_PASSWORD) {
        alert("UNAUTHORIZED: Incorrect authorization password from Jasmine!");
        return;
    }

    if (!name || !email || !pass) {
        alert("Please complete all registration fields.");
        return;
    }

    registeredUsers.push({ name, email, pass, role: "admin" });
    saveUsersToLocalStorage(); // Save admin accounts permanently
    renderUserSelectOptions();
    closeRegisterModal();
    alert(`Success! Admin account for "${name}" has been authorized and created.`);
}

function login() {
    const selectVal = document.getElementById('login-role').value;
    const pass = document.getElementById('login-password').value;
    const targetUser = registeredUsers[selectVal];
    
    if(targetUser && pass === targetUser.pass) {
        currentUser = targetUser;
        setupUserInterface();
    } else {
        alert('Error: Incorrect password or credentials!');
    }
}

function setupUserInterface() {
    document.getElementById('screen-login').classList.remove('active');
    document.getElementById('app-layout').classList.add('active');

    if(currentUser.role === 'jasmine') {
        document.getElementById('profile-avatar').innerText = "J";
        document.getElementById('profile-name').innerText = currentUser.name;
        document.getElementById('profile-role').innerText = "Main Authorized Operator";
        document.getElementById('profile-email').innerText = currentUser.email;
        document.getElementById('profile-access').innerText = "Full Operator (Primary Password Holder)";
        
        document.getElementById('auth-label-client').innerText = "Confirm Your Password to Save";
        document.getElementById('auth-label-sched').innerText = "Confirm Your Password to Save";
    } else {
        document.getElementById('profile-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
        document.getElementById('profile-name').innerText = currentUser.name;
        document.getElementById('profile-role').innerText = "Authorized Assistant Admin";
        document.getElementById('profile-email').innerText = currentUser.email;
        document.getElementById('profile-access').innerText = "Restricted (Requires Jasmine's Password for Add/Delete)";
        
        document.getElementById('auth-label-client').innerText = "Enter Jasmine's Approval Password";
        document.getElementById('auth-label-sched').innerText = "Enter Jasmine's Approval Password";
    }

    loadAllLists();
}

function logout() {
    document.getElementById('app-layout').classList.remove('active');
    document.getElementById('screen-login').classList.add('active');
    document.getElementById('login-password').value = '';
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    document.getElementById('tab-' + tabName).classList.add('active');
    closeSearchDropdown();
}

function selectPackageForClient(packageIndex) {
    const packagePrices = ["25000", "45000", "65000", "99750", "150000"];
    const packageSelect = document.getElementById('new-package-select');
    
    packageSelect.value = packagePrices[packageIndex];
    openClientModal();
    calculateFormTotals();
}

function calculateFormTotals() {
    const basePkgPrice = parseFloat(document.getElementById('new-package-select').value) || 0;
    
    let addOnsTotal = 0;
    const checkboxes = document.querySelectorAll('.add-on-check');
    checkboxes.forEach(cb => {
        if(cb.checked) {
            addOnsTotal += parseFloat(cb.value);
        }
    });

    const grandTotal = basePkgPrice + addOnsTotal;
    document.getElementById('new-calc-total').value = "PHP " + grandTotal.toLocaleString();

    const rawPaid = document.getElementById('new-paid').value.replace(/[^0-9]/g, '');
    const paidVal = parseFloat(rawPaid) || 0;

    const remainingBal = Math.max(0, grandTotal - paidVal);
    document.getElementById('new-balance').value = "PHP " + remainingBal.toLocaleString();
}

function loadAllLists() {
    let ongoingCount = clientsData.filter(c => !c.status.includes("Completed")).length;
    let balanceCount = clientsData.filter(c => c.balance !== "PHP 0").length;
    
    document.getElementById('kpi-total').innerText = clientsData.length;
    document.getElementById('kpi-ongoing').innerText = ongoingCount;
    document.getElementById('kpi-balance').innerText = balanceCount;

    const dashOngoing = document.getElementById('dash-ongoing-list');
    dashOngoing.innerHTML = '';
    clientsData.forEach((client, index) => {
        if(!client.status.includes("Completed")) {
            const item = document.createElement('div');
            item.className = 'dash-item';
            item.innerHTML = `<strong>${client.deceased}</strong> (${client.serviceType}) | Client: ${client.name} <br><small style="color:#008CBA;">Chapel: ${client.chapel}</small>`;
            item.onclick = () => openClientDetailsByIndex(index);
            dashOngoing.appendChild(item);
        }
    });

    const dashCert = document.getElementById('dash-cert-list');
    dashCert.innerHTML = '';
    clientsData.forEach((client, index) => {
        if(!client.status.includes("Completed")) {
            const item = document.createElement('div');
            item.className = 'dash-item';
            item.innerHTML = `<strong>${client.name}</strong> needs Burial/Cremation Permit for ${client.deceased}`;
            item.onclick = () => generateCertificate(index, 'service');
            dashCert.appendChild(item);
        }
    });

    // 1. Client Directory
    const clientContainer = document.getElementById('client-list-container');
    clientContainer.innerHTML = '';
    clientsData.forEach((client, index) => {
        const btn = document.createElement('button');
        btn.className = 'client-item';
        btn.innerHTML = `<strong>${client.name}</strong> [${client.serviceType}] - ${client.address} <span style="float:right; color:${client.status.includes('Completed') ? 'green' : '#008CBA'}">${client.status}</span>`;
        btn.onclick = () => openClientDetailsByIndex(index);
        clientContainer.appendChild(btn);
    });

    // 2. Deceased Records
    const deceasedContainer = document.getElementById('deceased-list-container');
    deceasedContainer.innerHTML = '';
    clientsData.forEach((client, index) => {
        const btn = document.createElement('button');
        btn.className = 'client-item';
        btn.innerHTML = `<strong>${client.deceased}</strong> (${client.relation} of ${client.name}) | <span style="color:${client.serviceType==='Cremation'?'#008CBA':'#333'}">${client.serviceType}</span> - ${client.burial}`;
        btn.onclick = () => openDeceasedDetailsByIndex(index);
        deceasedContainer.appendChild(btn);
    });

    // 3. Ongoing / Active Schedules
    const schedulesContainer = document.getElementById('schedules-list-container');
    schedulesContainer.innerHTML = '';
    clientsData.forEach((client, index) => {
        if(!client.status.includes("Completed")) {
            const btn = document.createElement('button');
            btn.className = 'client-item';
            btn.innerHTML = `<strong>[${client.serviceType.toUpperCase()}] ${client.deceased}</strong> | Client: ${client.name} <br><small style="color:#008CBA;">Chapel: ${client.chapel} | Date: ${client.date} @ ${client.burial}</small>`;
            btn.onclick = () => openClientDetailsByIndex(index);
            schedulesContainer.appendChild(btn);
        }
    });

    // 4. Clients Payments List
    const paymentsContainer = document.getElementById('payments-list-container');
    paymentsContainer.innerHTML = '';
    clientsData.forEach((client, index) => {
        const btn = document.createElement('button');
        btn.className = 'client-item';
        btn.innerHTML = `<strong>${client.name}</strong> | Paid: <span style="color:green;">${client.paid}</span> | Balance: <span style="color:red;">${client.balance}</span>`;
        btn.onclick = () => openClientDetailsByIndex(index);
        paymentsContainer.appendChild(btn);
    });

    // 5. Clients with Balance List
    const balanceContainer = document.getElementById('balance-list-container');
    balanceContainer.innerHTML = '';
    clientsData.forEach((client, index) => {
        if(client.balance !== "PHP 0") {
            const btn = document.createElement('button');
            btn.className = 'client-item';
            btn.innerHTML = `<strong>${client.name}</strong> | Outstanding Balance: <span style="color:red;">${client.balance}</span>`;
            btn.onclick = () => openClientDetailsByIndex(index);
            balanceContainer.appendChild(btn);
        }
    });

    // 6. Certifications List
    const certContainer = document.getElementById('cert-list-container');
    certContainer.innerHTML = '';
    clientsData.forEach((client, index) => {
        const box = document.createElement('div');
        box.className = 'client-item';
        box.style.display = 'flex';
        box.style.justifyContent = 'space-between';
        box.style.alignItems = 'center';
        
        box.innerHTML = `
            <div>
                <strong>${client.name}</strong> (Deceased: <em>${client.deceased}</em> - ${client.serviceType})
                <br><small style="color:#666;">Address: ${client.address}</small>
            </div>
            <div class="cert-btn-group" style="display:flex; gap:6px;">
                <button onclick="generateCertificate(${index}, 'service')">Funeral Cert</button>
                <button onclick="generateCertificate(${index}, 'burial')">Permit Cert</button>
                <button onclick="generateCertificate(${index}, 'promissory')">Promissory Note</button>
            </div>
        `;
        certContainer.appendChild(box);
    });
}

function generateCertificate(index, type) {
    const client = clientsData[index];
    const titleElem = document.getElementById('cert-doc-title');
    const bodyElem = document.getElementById('cert-doc-body');
    document.getElementById('cert-client-sign').innerText = client.name;

    if (type === 'service') {
        titleElem.innerText = "CERTIFICATE OF FUNERAL SERVICE COMPLETION";
        bodyElem.innerHTML = `
            <p>This is to certify that <strong>CENICARE Funeral Services</strong> has successfully provided complete funeral and chapel services (${client.serviceType}) for the late <strong>${client.deceased}</strong>, who passed away on <strong>${client.decDate}</strong> at the age of <strong>${client.decAge} years old</strong>.</p>
            <br>
            <p><strong>Package & Add-ons:</strong> ${client.pkgName} (${client.addOns || 'No Add-ons'})</p>
            <br>
            <p>This certification is issued upon the request of <strong>${client.name}</strong> (${client.relation} of the deceased), residing at <strong>${client.address}</strong>, for legal, insurance, or record-keeping purposes.</p>
            <br>
            <p>Given this <strong>18th day of October, 2026</strong> at General Trias, Cavite, Philippines.</p>
        `;
    } else if (type === 'burial') {
        titleElem.innerText = `CERTIFICATE OF ${client.serviceType.toUpperCase()} PERMIT`;
        bodyElem.innerHTML = `
            <p>To Whom It May Concern:</p>
            <br>
            <p>Permission and clearance are hereby granted for the ${client.serviceType.toLowerCase()} and transfer of the remains of <strong>${client.deceased}</strong>.</p>
            <p><strong>Scheduled Service Date:</strong> ${client.date}</p>
            <p><strong>Designated Location / Cemetery:</strong> ${client.burial}</p>
            <p><strong>Authorized Family Representative:</strong> ${client.name} (${client.relation})</p>
            <br>
            <p>All sanitary codes, municipal health permits, and Cenicare mortuary documentation have been duly verified and authorized.</p>
            <br>
            <p>Issued this <strong>18th day of October, 2026</strong> at General Trias, Cavite.</p>
        `;
    } else if (type === 'promissory') {
        titleElem.innerText = "CERTIFICATE OF PROMISSORY NOTE & BALANCE AGREEMENT";
        bodyElem.innerHTML = `
            <p>I, <strong>${client.name}</strong>, residing at <strong>${client.address}</strong>, hereby acknowledge the total funeral service costs provided by Cenicare Funeral Services for <strong>${client.deceased}</strong>.</p>
            <br>
            <p><strong>Service Type & Package:</strong> ${client.serviceType} - ${client.pkgName}</p>
            <p><strong>Total Amount Paid to Date:</strong> ${client.paid}</p>
            <p><strong>Remaining Outstanding Balance:</strong> <span style="color:#d9534f; font-weight:bold;">${client.balance}</span></p>
            <br>
            <p>I hereby promise to settle and pay the remaining balance of <strong>${client.balance}</strong> in full on or before 30 calendar days from this date.</p>
            <br>
            <p>Signed and acknowledged this <strong>18th day of October, 2026</strong>.</p>
        `;
    }

    switchTab('print-view');
}

function openClientDetailsByIndex(index) {
    currentClientIndex = index;
    const client = clientsData[index];
    
    document.getElementById('detail-name').innerText = client.name;
    document.getElementById('detail-deceased').innerText = client.deceased;
    document.getElementById('detail-service-type').innerText = client.serviceType || "Traditional Burial";
    document.getElementById('detail-package').innerText = client.pkgName || "Service Package";
    document.getElementById('detail-addons').innerText = client.addOns || "None";
    document.getElementById('detail-address').innerText = client.address;
    document.getElementById('detail-relation').innerText = client.relation;
    document.getElementById('detail-paid').innerText = client.paid;
    document.getElementById('detail-balance').innerText = client.balance;
    document.getElementById('detail-date').innerText = client.date;
    document.getElementById('detail-burial').innerText = client.burial;
    
    const statusElem = document.getElementById('detail-status');
    statusElem.innerText = client.status;
    statusElem.style.color = client.status.includes("Completed") ? "green" : "#d9534f";
    
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    document.getElementById('tab-details').classList.add('active');
    closeSearchDropdown();
}

function openDeceasedDetailsByIndex(index) {
    const client = clientsData[index];
    
    document.getElementById('dec-name').innerText = client.deceased;
    document.getElementById('dec-age').innerText = client.decAge + " years old";
    document.getElementById('dec-date').innerText = client.decDate;
    document.getElementById('dec-cause').innerText = client.decCause;
    document.getElementById('dec-client').innerText = client.name;
    document.getElementById('dec-relation').innerText = client.relation;
    
    const dispElem = document.getElementById('dec-disposition');
    dispElem.innerText = client.serviceType;
    dispElem.style.color = client.serviceType === "Cremation" ? "#008CBA" : "#28a745";

    document.getElementById('dec-burial').innerText = client.burial;
    
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    document.getElementById('tab-deceased-details').classList.add('active');
    closeSearchDropdown();
}

function deleteCurrentClient() {
    if(currentClientIndex === null) return;
    
    let promptMsg = currentUser.role === 'admin' 
        ? `ADMIN ACTION (${currentUser.name}): Deleting records requires Jasmine's authorization password. Please confirm with Jasmine and enter her password:` 
        : "CONFIDENTIAL ACTION: Please enter your password to delete this record:";

    const password = prompt(promptMsg);
    
    if(password === JASMINE_PASSWORD) {
        const deletedName = clientsData[currentClientIndex].name;
        clientsData.splice(currentClientIndex, 1);
        currentClientIndex = null;
        saveClientsToLocalStorage();
        loadAllLists();
        switchTab('clients');
        alert(`Client record for "${deletedName}" has been successfully deleted.`);
    } else if(password !== null) {
        alert("Unauthorized Action: Incorrect password!");
    }
}

function openClientModal() {
    document.getElementById('client-modal').classList.add('active');
    calculateFormTotals();
}

function closeClientModal() {
    document.getElementById('client-modal').classList.remove('active');
    document.getElementById('new-auth-password').value = '';
}

function addNewClient() {
    const pass = document.getElementById('new-auth-password').value;
    
    if(pass !== JASMINE_PASSWORD) {
        alert("Unauthorized Action: Incorrect confirmation password from Jasmine!");
        return;
    }

    const cName = document.getElementById('new-client-name').value;
    const cAddr = document.getElementById('new-client-address').value;
    const dName = document.getElementById('new-deceased-name').value;
    const rel = document.getElementById('new-relation').value;
    const sType = document.getElementById('new-service-type').value;
    const pkgSelect = document.getElementById('new-package-select');
    const pkgText = pkgSelect.options[pkgSelect.selectedIndex].text;
    
    const addOnList = [];
    const checkboxes = document.querySelectorAll('.add-on-check');
    const addOnLabels = ["Fresh Flower Wreath", "Photo Frame", "Keepsake Urn", "Extra Viewing Day"];
    checkboxes.forEach((cb, idx) => {
        if(cb.checked) addOnList.push(addOnLabels[idx]);
    });

    const paidVal = document.getElementById('new-paid').value;
    const balVal = document.getElementById('new-balance').value;
    const burial = document.getElementById('new-burial').value;

    if(cName && dName) {
        const formattedPaid = paidVal ? (paidVal.startsWith("PHP") ? paidVal : "PHP " + paidVal) : "PHP 0";

        clientsData.unshift({
            name: cName,
            deceased: dName,
            decAge: "68",
            decDate: "October 18, 2026",
            decCause: "Pending Evaluation",
            address: cAddr || "General Trias, Cavite",
            relation: rel || "Family Representative",
            serviceType: sType,
            pkgName: pkgText,
            addOns: addOnList.length > 0 ? addOnList.join(", ") : "None",
            paid: formattedPaid,
            balance: balVal,
            date: burial || "October 26, 2026 - 10:00 AM",
            burial: burial || "Local Memorial Park",
            status: "Active / Ongoing Service",
            chapel: "Main Funeral Chapel"
        });

        saveClientsToLocalStorage();
        loadAllLists();
        closeClientModal();
        alert('New Client record added successfully!');
    } else {
        alert('Please enter at least the Client Name and Deceased Name.');
    }
}

function openScheduleModal() {
    document.getElementById('schedule-modal').classList.add('active');
}

function closeScheduleModal() {
    document.getElementById('schedule-modal').classList.remove('active');
    document.getElementById('sched-auth-password').value = '';
}

function addNewSchedule() {
    const pass = document.getElementById('sched-auth-password').value;
    
    if(pass !== JASMINE_PASSWORD) {
        alert("Unauthorized Action: Incorrect confirmation password from Jasmine!");
        return;
    }

    const clientName = document.getElementById('sched-client').value;
    const decName = document.getElementById('sched-deceased').value;
    const chapel = document.getElementById('sched-chapel').value;
    const burial = document.getElementById('sched-burial').value;

    if(clientName && decName) {
        clientsData.unshift({
            name: clientName,
            deceased: decName,
            decAge: "65",
            decDate: "October 18, 2026",
            decCause: "Pending Evaluation",
            address: "Cavite Area",
            relation: "Family Representative",
            serviceType: "Traditional Burial",
            pkgName: "Service 4: Executive Metal Package",
            addOns: "None",
            paid: "PHP 10,000",
            balance: "PHP 89,750",
            date: burial || "October 25, 2026 - 11:00 AM",
            burial: burial || "Local Cemetery",
            status: "Active / Ongoing Service",
            chapel: chapel || "Main Chapel"
        });

        saveClientsToLocalStorage();
        loadAllLists();
        closeScheduleModal();
        alert('New schedule added successfully!');
    } else {
        alert('Please fill out at least the Client Name and Deceased Name.');
    }
}

function handleSearchInput() {
    const query = document.getElementById('search-bar').value.toLowerCase().trim();
    const dropdown = document.getElementById('search-dropdown');
    
    if(query.length === 0) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
    }

    const matches = clientsData.filter(client => 
        client.name.toLowerCase().includes(query) || 
        client.deceased.toLowerCase().includes(query) || 
        client.address.toLowerCase().includes(query)
    );

    if(matches.length === 0) {
        dropdown.innerHTML = '<div class="dropdown-item" style="color:#888;">No matching records found</div>';
    } else {
        dropdown.innerHTML = '';
        matches.forEach(client => {
            const originalIndex = clientsData.indexOf(client);
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `<strong>${client.name}</strong> (Deceased: ${client.deceased}) <br><small>${client.address}</small>`;
            item.onclick = () => {
                openClientDetailsByIndex(originalIndex);
                document.getElementById('search-bar').value = '';
            };
            dropdown.appendChild(item);
        });
    }

    dropdown.classList.add('active');
}

function closeSearchDropdown() {
    const dropdown = document.getElementById('search-dropdown');
    dropdown.classList.remove('active');
}