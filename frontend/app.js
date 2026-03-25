const API_URL = 'http://localhost:8080/api/employees';

const fields = ['firstName', 'lastName', 'email', 'department', 'salary'];

function clearErrors() {
  fields.forEach(f => {
    document.getElementById(f).classList.remove('error-input');
    document.getElementById(`err-${f}`).textContent = '';
  });
  const alert = document.getElementById('alert');
  alert.className = 'alert';
  alert.textContent = '';
}

function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert ${type}`;
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
      showAlert('Employee added successfully!', 'success');
      resetForm();
    } else if (res.status === 400) {
      const errors = await res.json();
      if (errors.error) {
        showAlert(errors.error, 'error');
      } else {
        showFieldErrors(errors);
      }
    } else {
      showAlert('Unexpected error. Please try again.', 'error');
    }
  } catch (err) {
    showAlert('Could not connect to server. Is the backend running?', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Add Employee';
  }
});
