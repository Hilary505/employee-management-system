const API_URL = 'http://localhost:8080/api/employees';
const fields  = ['firstName', 'lastName', 'email', 'department', 'salary'];

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
  document.getElementById('employeeForm').reset();
  clearErrors();
}

// ── Table ─────────────────────────────────────────────────

async function fetchEmployees() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch');
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
      // Remove row from DOM without page refresh
      document.getElementById(`row-${id}`)?.remove();

      // Show empty message if table is now empty
      const tbody = document.getElementById('tableBody');
      if (tbody.children.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No employees found.</td></tr>`;
      }
      setAlert('tableAlert', 'Employee deleted successfully.', 'success');
    } else if (res.status === 404) {
      setAlert('tableAlert', 'Employee not found.', 'error');
    } else {
      setAlert('tableAlert', 'Failed to delete employee.', 'error');
    }
  } catch {
    setAlert('tableAlert', 'Could not connect to server.', 'error');
  }
}

function editEmployee(id) {
  // Placeholder — wire to edit form/modal in next step
  alert(`Edit employee ${id} — coming soon.`);
}

// ── Add Employee Form ─────────────────────────────────────

document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  const payload = {
    firstName:  document.getElementById('firstName').value.trim(),
    lastName:   document.getElementById('lastName').value.trim(),
    email:      document.getElementById('email').value.trim(),
    department: document.getElementById('department').value.trim(),
    salary:     parseFloat(document.getElementById('salary').value),
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      setAlert('alert', 'Employee added successfully!', 'success');
      resetForm();
      fetchEmployees(); // refresh table
    } else if (res.status === 400) {
      const errors = await res.json();
      if (errors.error) {
        setAlert('alert', errors.error, 'error');
      } else {
        showFieldErrors(errors);
      }
    } else {
      setAlert('alert', 'Unexpected error. Please try again.', 'error');
    }
  } catch {
    setAlert('alert', 'Could not connect to server. Is the backend running?', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Add Employee';
  }
});

// ── Init ──────────────────────────────────────────────────
fetchEmployees();
