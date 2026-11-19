// Validación de registro de administrador con guía, longitud mínima de 8 caracteres y ver/ocultar contraseña
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const usuario = document.getElementById("usuario");
  const correo = document.getElementById("correo");
  const pass = document.getElementById("contrasena");
  const pass2 = document.getElementById("contrasena2");
  const formMessage = document.getElementById("formMessage");

  // Botones de mostrar/ocultar
  const togglePassBtn = document.getElementById("togglePass");
  const togglePass2Btn = document.getElementById("togglePass2");

  // Lista de requisitos visuales
  const reqList = document.getElementById("passReqs");
  const reqItems = {
    len: reqList.querySelector('[data-req="len"]'),
    upper: reqList.querySelector('[data-req="upper"]'),
    special: reqList.querySelector('[data-req="special"]'),
  };

  // Regex: al menos 8 caracteres, 1 mayúscula, 1 especial
  const passRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])[A-Za-z\d\W]{8,128}$/;

  // Actualiza el estado visual de los requisitos
  function updateRequirements(value) {
    const checks = {
      len: value.length >= 8,
      upper: /[A-Z]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };

    for (const key in checks) {
      reqItems[key].classList.toggle("good", checks[key]);
      reqItems[key].classList.toggle("bad", !checks[key]);
    }

    return checks.len && checks.upper && checks.special;
  }

  // Mostrar guía mientras el usuario escribe
  pass.addEventListener("input", () => {
    const cumple = updateRequirements(pass.value);
    pass.classList.toggle("is-valid", cumple);
    pass.classList.toggle("is-invalid", !cumple);

    // Verificar coincidencia si ya escribió la segunda
    if (pass2.value.length > 0) {
      const iguales = pass.value === pass2.value;
      pass2.classList.toggle("is-valid", iguales);
      pass2.classList.toggle("is-invalid", !iguales);
    }
  });

  // Comparar contraseñas
  pass2.addEventListener("input", () => {
    const iguales = pass.value === pass2.value;
    pass2.classList.toggle("is-valid", iguales);
    pass2.classList.toggle("is-invalid", !iguales);
  });

  // Validación de usuario y correo
  usuario.addEventListener("input", () => {
    usuario.classList.toggle("is-valid", usuario.value.trim().length >= 3);
    usuario.classList.toggle("is-invalid", usuario.value.trim().length < 3);
  });

  correo.addEventListener("input", () => {
    correo.classList.toggle("is-valid", correo.validity.valid);
    correo.classList.toggle("is-invalid", !correo.validity.valid);
  });

  // Mostrar / ocultar contraseñas
  function toggleVisibility(input, button) {
    if (input.type === "password") {
      input.type = "text";
      button.textContent = "🙈 Ocultar";
    } else {
      input.type = "password";
      button.textContent = "👁️ Ver";
    }
  }

  togglePassBtn.addEventListener("click", () => toggleVisibility(pass, togglePassBtn));
  togglePass2Btn.addEventListener("click", () => toggleVisibility(pass2, togglePass2Btn));

  // Envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMessage.textContent = "";

    const uOK = usuario.value.trim().length >= 3;
    const cOK = correo.validity.valid;
    const pOK = passRegex.test(pass.value);
    const p2OK = pass.value === pass2.value;

    if (!(uOK && cOK && pOK && p2OK)) {
      formMessage.textContent = "⚠️ Revisa los campos marcados en rojo.";
      updateRequirements(pass.value);
      return;
    }

    const payload = {
      usuario: usuario.value.trim(),
      correo: correo.value.trim(),
      contrasena: pass.value,
      rol: document.getElementById("rol").value || "bibliotecario",
    };

    try {
      const res = await fetch("/api/registroadmin/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");

      formMessage.textContent = "✅ Registro exitoso.";
      form.reset();
      updateRequirements(""); // limpiar guía
      [usuario, correo, pass, pass2].forEach((el) =>
        el.classList.remove("is-valid", "is-invalid")
      );
    } catch (err) {
      formMessage.textContent = "❌ Error: " + err.message;
    }
  });
});
