const sendEmailBtn = document.getElementById('sendEmailBtn');
const modal = document.getElementById('modalCodigo');
const cerrarModal = document.getElementById('cerrarModal');
const validarCodigoBtn = document.getElementById('validarCodigoBtn');
const codigoInput = document.getElementById('codigoInput');
const formRecuperar = document.getElementById('formRecuperar');

console.log('✅ Script cargado');

let codigoGenerado = '';
let emailUsuario = '';

function generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function toggleModal(mostrar) {
    if (mostrar) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

// === Manejo de los inputs OTP ===
const otpInputs = document.querySelectorAll('.otp');
if (otpInputs.length) {
    const updateHidden = () => {
        const val = Array.from(otpInputs).map(i => i.value).join('');
        codigoInput.value = val;
    };

    otpInputs.forEach((inp, idx) => {
        inp.addEventListener('input', () => {
            inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
            if (inp.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
            updateHidden();
        });
        inp.addEventListener('keydown', (e) => {
            if ((e.key === 'Backspace' || e.key === 'Delete') && !inp.value && idx > 0) {
                otpInputs[idx - 1].focus();
            }
        });
        inp.addEventListener('paste', (e) => {
            const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
            if (!text) return;
            e.preventDefault();
            for (let i = 0; i < otpInputs.length; i++) {
                otpInputs[i].value = text[i] || '';
            }
            updateHidden();
        });
    });
}

// === Tu lógica original ===

// Enviar código por email
async function enviarCodigoPorEmail(email, codigo) {
    const response = await fetch('/api/enviar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, codigo: codigo })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al enviar el código');
    return data;
}

formRecuperar.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) return alert('❌ Ingresa un correo válido.');
    if (!email.endsWith('@gmail.com')) return alert('❌ Solo se permiten correos Gmail.');

    const originalText = sendEmailBtn.textContent;
    sendEmailBtn.textContent = 'Enviando...';
    sendEmailBtn.disabled = true;

    try {
        const response = await fetch('/api/verificar-correo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });
        const data = await response.json();
        if (!data.existe) return alert('❌ No existe un usuario con este correo.');

        codigoGenerado = generarCodigo();
        emailUsuario = email;
        await enviarCodigoPorEmail(email, codigoGenerado);
        alert('✅ Código enviado. Revisa tu correo.');
        toggleModal(true);
        otpInputs[0].focus();

        setTimeout(() => {
            if (codigoGenerado !== '') {
                codigoGenerado = '';
                alert('⏰ El código ha expirado.');
                toggleModal(false);
                codigoInput.value = '';
                otpInputs.forEach(i => i.value = '');
            }
        }, 10 * 60 * 1000);
    } catch (error) {
        alert('⚠️ Error: ' + error.message);
    } finally {
        sendEmailBtn.textContent = originalText;
        sendEmailBtn.disabled = false;
    }
});

cerrarModal.addEventListener('click', () => {
    toggleModal(false);
    codigoInput.value = '';
    otpInputs.forEach(i => i.value = '');
});

validarCodigoBtn.addEventListener('click', () => {
    const codigo = codigoInput.value.trim();

    if (codigo.length !== 6) {
        alert('❌ El código debe tener 6 dígitos.');
        return;
    }

    if (codigo !== codigoGenerado) {
        alert('❌ Código incorrecto.');
        codigoInput.value = '';
        otpInputs.forEach(i => i.value = '');
        otpInputs[0].focus();
        return;
    }

    alert('✅ Código validado. Ahora crea tu nueva contraseña.');

    // 🔹 Limpiar todo antes de redirigir
    toggleModal(false);
    codigoGenerado = '';
    codigoInput.value = '';
    otpInputs.forEach(i => i.value = '');

    // Redirigir
    window.location.href = './nueva-contraseña.html?email=' + encodeURIComponent(emailUsuario);
});

// Validar con Enter
codigoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') validarCodigoBtn.click();
});

modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        toggleModal(false);
        codigoInput.value = '';
        otpInputs.forEach(i => i.value = '');
    }
});

console.log('🎯 Event listeners configurados');
