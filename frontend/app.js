const API_URL = 'http://localhost:8080/api/employees';
const fields  = ['firstName', 'lastName', 'email', 'department', 'salary'];

let editingId = null; // tracks which employee is being edited

// ── Helpers ──────────────────────────────────────────────

function clearErrors() {
  fields.forEach(f => {
    document.getElementById(f).classList.remove('error-input');
    document.getElementById(`err-${f}`).textContent = '';
  });
  setAlert('alert', '', '');
}

function setAlert(id, message, type) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.className = type ? `alert ${type}` : 'alert';
}

function showFieldErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const input = document.getElementById(field);
    const errEl = document.getElementById(`err-${field}`);
    if (input) input.classList.add('error-input');
    if (errEl) errEl.textContent = message;
  });
}

function resetForm() {
  editingId = null;
  document.getElementById('employeeForm').reset();
  document.getElementById('formTitle').textContent = 'Add New Employee';
  document.getElementById('submitBtn').textContent = 'Add Employee';
  document.getElementById('cancelBtn').style.display = 'none';
  clearErrors();
}

// ── Edit ─────────────────────────────────────────────────

async function editEmployee(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error();
    const emp = await res.json();

    // Populate form fields with employee data
    document.getElementById('firstName').value  = emp.firstName;
    document.getElementById('lastName').value   = emp.lastName;
    document.getElementById('email').value      = emp.email;
    document.getElementById('department').value = emp.department;
    document.getElementById('salary').value     = emp.salary;

    // Switch form to edit mode
    editingId = id;
    document.getElementById('formTitle').textContent  = 'Edit Employee';
    document.getElementById('submitBtn').textContent  = 'Update Employee';
    document.getElementById('cancelBtn').style.display = 'block';

    // Scroll to form
    document.getElementById('employeeForm').scrollIntoView({ behavior: 'smooth' });
    clearErrors();
  } catch {
    setAlert('tableAlert', 'Could not load employee data.', 'error');
  }
}

// ── Cancel edit ───────────────────────────────────────────

document.getElementById('cancelBtn').addEventListener('click', resetForm);

// ── Table ─────────────────────────────────────────────────

async function fetchEmployees() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error();
    const employees = await res.json();
    renderTable(employees);
  } catch {
    setAlert('tableAlert', 'Could not load employees. Is the backend running?', 'error');
  }
}

function renderTable(employees) {
  const tbody = document.getElementById('tableBody');

  if (employees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No employees found.</td></tr>`;
    return;
  }

  tbody.innerHTML = employees.map(emp => `
    <tr id="row-${emp.id}">
      <td>${emp.id}</td>
      <td>${emp.firstName} ${emp.lastName}</td>
      <td>${emp.email}</td>
      <td>${emp.department}</td>
      <td>$${Number(emp.salary).toLocaleString()}</td>
      <td>
        <button class="btn-edit"   onclick="editEmployee(${emp.id})">Edit</button>
        <button class="btn-delete" onclick="deleteEmployee(${emp.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteEmployee(id) {
  if (!confirm('Are you sure you want to delete this employee?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (res.status === 204) {
      document.getElementById(`row-${id}`)?.remove();
      const tbody = document.getElementById('tableBody');
      if (tbody.children.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No employees found.</td></tr>`;
      }
      setAlert('tableAlert', 'Employee deleted successfully.', 'success');
      if (editingId === id) resetForm(); // cancel edit if deleted employee was being edited
    } else if (res.status === 404) {
      setAlert('tableAlert', 'Employee not found.', 'error');
    } else {
      setAlert('tableAlert', 'Failed to delete employee.', 'error');
    }
  } catch {
    setAlert('tableAlert', 'Could not connect to server.', 'error');
  }
}

// ── Add / Edit Form Submit ────────────────────────────────

document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = editingId ? 'Updating...' : 'Saving...';

  const payload = {
    firstName:  document.getElementById('firstName').value.trim(),
    lastName:   document.getElementById('lastName').value.trim(),
    email:      document.getElementById('email').value.trim(),
    department: document.getElementById('department').value.trim(),
    salary:     parseFloat(document.getElementById('salary').value),
  };

  const isEdit   = editingId !== null;
  const url      = isEdit ? `${API_URL}/${editingId}` : API_URL;
  const method   = isEdit ? 'PUT' : 'POST';
  const successStatus = isEdit ? 200 : 201;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === successStatus) {
      setAlert('alert', isEdit ? 'Employee updated successfully!' : 'Employee added successfully!', 'success');
      resetForm();
      fetchEmployees(); // refresh table without page reload
    } else if (res.status === 400) {
      const errors = await res.json();
      errors.error ? setAlert('alert', errors.error, 'error') : showFieldErrors(errors);
    } else if (res.status === 404) {
      setAlert('alert', 'Employee not found.', 'error');
    } else {
      setAlert('alert', 'Unexpected error. Please try again.', 'error');
    }
  } catch {
    setAlert('alert', 'Could not connect to server. Is the backend running?', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = editingId ? 'Update Employee' : 'Add Employee';
  }
});

// ── Init ─────────────────────────────────────────────────
fetchEmployees();
