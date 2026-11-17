document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script de InicioAdmin cargado");

  // ==========================
  // BOTÓN CERRAR SESIÓN
  // ==========================
  document.querySelector(".exit-btn")?.addEventListener("click", () => {
    window.location.href = "/html/htmlAdmin/AdminLogin.html";
  });

  // ==========================
  // ICONOS DEL HEADER
  // ==========================
  document
    .querySelector('.icons img[alt="editar"]')
    ?.addEventListener("click", () => {
      window.location.href = "/html/htmlLibros/EditarLibros.html";
    });

  document
    .querySelector('.icons img[alt="usuario"]')
    ?.addEventListener("click", () => {
      window.location.href = "/html/info.html";
    });

  // ==========================
  // MENÚ HAMBURGUESA
  // ==========================
  const menuBtn = document.querySelector(".menu-btn");
  const popupMenu = document.getElementById("popupMenu");
  const menuDescripcion = document.getElementById("menuDescripcion");

  menuBtn?.addEventListener("click", () => {
    if (popupMenu) popupMenu.style.display = "flex";
  });

  popupMenu?.addEventListener("click", (e) => {
    if (e.target === popupMenu) popupMenu.style.display = "none";
  });

  document.querySelectorAll(".popup-menu .close-popup").forEach((btn) => {
    btn.addEventListener("click", () => {
      const popup = btn.closest(".popup-menu");
      if (popup) popup.style.display = "none";
    });
  });

  // Descripciones del menú (hover)
  const descripciones = {
    "btn-agregar": "Permite registrar nuevos libros en la biblioteca.",
    "btn-usuarios": "Administra y modifica la información de los usuarios.",
    "btn-prestamos": "Gestiona los préstamos y devoluciones de libros.",
    "btn-informes": "Consulta informes y estadísticas de la biblioteca."
  };

  Object.entries(descripciones).forEach(([id, texto]) => {
    const li = document.getElementById(id);
    li?.addEventListener("mouseenter", () => {
      if (menuDescripcion) menuDescripcion.textContent = texto;
    });
    li?.addEventListener("mouseleave", () => {
      if (menuDescripcion) {
        menuDescripcion.textContent =
          "Pasa el cursor sobre una opción para ver qué hace.";
      }
    });
  });

  // Navegación real de las opciones
  document.getElementById("btn-agregar")?.addEventListener("click", () => {
    window.location.href = "/html/htmlLibros/AgregarLibro.html";
  });
  document.getElementById("btn-usuarios")?.addEventListener("click", () => {
    window.location.href = "/html/htmlAdmin/editar-usuarios.html";
  });
  document.getElementById("btn-prestamos")?.addEventListener("click", () => {
    window.location.href = "/html/htmlAdmin/Gestion-prestamos.html";
  });
  document.getElementById("btn-informes")?.addEventListener("click", () => {
    window.location.href = "/html/Informes.html";
  });

  // ==========================
  // VARIABLES GENERALES
  // ==========================
  const contenedorCategorias = document.getElementById("contenedor-categorias");
  const selectFiltro = document.getElementById("selectFiltro");
  const listaCategoriasDiv = document.getElementById("listaCategorias");
  let librosData = [];

  // ==========================
  // CATEGORÍAS
  // ==========================
  async function cargarCategorias() {
    try {
      const res = await fetch("/api/categorias");
      const categorias = await res.json();

      // Carrusel de categorías
      if (contenedorCategorias) {
        contenedorCategorias.innerHTML = "";
        categorias.forEach((cat) => {
          const card = document.createElement("div");
          card.className = "card";
          card.dataset.idCategoria = cat.id_categoria;
          card.dataset.nombreCategoria = cat.nombre;

          card.innerHTML = `
            <img src="${cat.portada || "https://via.placeholder.com/120x180?text=Sin+Portada"}" alt="${cat.nombre}">
            <p>${cat.nombre}</p>
          `;

          card.addEventListener("click", () => {
            filtrarPorCategoriaId(cat.id_categoria);
            document
              .querySelector(".mas-leidos")
              ?.scrollIntoView({ behavior: "smooth" });
          });

          contenedorCategorias.appendChild(card);
        });
      }

      // Opciones del select filtro
      if (selectFiltro) {
        selectFiltro.innerHTML = `<option value="">-- Todos los libros --</option>`;
        categorias.forEach((cat) => {
          const opt = document.createElement("option");
          opt.value = cat.id_categoria;
          opt.textContent = cat.nombre;
          selectFiltro.appendChild(opt);
        });
      }

      // Lista para gestionar categorías
      if (listaCategoriasDiv) {
        listaCategoriasDiv.innerHTML = "";
        categorias.forEach((cat) => {
          const div = document.createElement("div");
          div.style.display = "flex";
          div.style.alignItems = "center";
          div.style.justifyContent = "space-between";
          div.style.margin = "8px 0";

          div.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${cat.portada || "https://via.placeholder.com/50x70?text=No+Img"}"
                   width="50" height="70" style="object-fit:cover;border-radius:6px;">
              <span>${cat.nombre}</span>
            </div>
            <div>
              <button
                data-id="${cat.id_categoria}"
                data-nombre="${cat.nombre}"
                data-portada="${cat.portada || ""}"
                class="btn-editar-cat"
              >🖊️</button>
              <button data-id="${cat.id_categoria}" class="btn-eliminar-cat">🗑️</button>
            </div>
          `;

          listaCategoriasDiv.appendChild(div);
        });
      }
    } catch (err) {
      console.error("❌ Error cargando categorías:", err);
    }
  }

  // Abrir / cerrar modal de categorías
  const popupCategorias = document.getElementById("popupCategorias");
  document
    .getElementById("btn-gestionar-categorias")
    ?.addEventListener("click", () => {
      if (popupCategorias) popupCategorias.style.display = "flex";
    });
  document.getElementById("cerrarCategorias")?.addEventListener("click", () => {
    if (popupCategorias) popupCategorias.style.display = "none";
  });

  // Agregar categoría
  document.getElementById("formCategoria")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Error al guardar categoría");
      alert("✅ Categoría agregada");
      form.reset();
      cargarCategorias();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar categoría");
    }
  });

  // ==========================
  // EDITAR / ELIMINAR CATEGORÍA
  // ==========================
  const popupEditar = document.getElementById("popupEditarCategoria");
  const cerrarEditar = document.getElementById("cerrarEditarCategoria");
  const formEditar = document.getElementById("formEditarCategoria");
  const editId = document.getElementById("editIdCategoria");
  const editNombre = document.getElementById("editNombreCategoria");
  const editPortada = document.getElementById("editPortadaCategoria");
  const previewEdit = document.getElementById("previewEditPortada");

  cerrarEditar?.addEventListener("click", () => {
    if (popupEditar) popupEditar.style.display = "none";
  });

  // Delegación de eventos para editar/eliminar
  listaCategoriasDiv?.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    // Editar
    if (target.classList.contains("btn-editar-cat")) {
      const id = target.dataset.id || "";
      const nombre = target.dataset.nombre || "";
      const portada = target.dataset.portada || "";

      if (editId) editId.value = id;
      if (editNombre) editNombre.value = nombre;
      if (previewEdit) {
        previewEdit.src =
          portada || "https://via.placeholder.com/80x100?text=Sin+Portada";
      }
      if (editPortada) editPortada.value = "";

      if (popupEditar) popupEditar.style.display = "flex";
    }

    // Eliminar
    if (target.classList.contains("btn-eliminar-cat")) {
      const id = target.dataset.id;
      if (!id) return;

      if (!confirm("¿Eliminar categoría?")) return;

      try {
        const res = await fetch(`/api/categorias/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Error al eliminar categoría");
        alert("🗑️ Categoría eliminada");
        cargarCategorias();
      } catch (err) {
        console.error(err);
        alert("❌ Error al eliminar categoría");
      }
    }
  });

  // Preview portada al editar
  editPortada?.addEventListener("change", () => {
    const file = editPortada.files?.[0];
    if (file && previewEdit) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          previewEdit.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Guardar cambios edición
  formEditar?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editId) return;
    const id = editId.value;
    const formData = new FormData(formEditar);

    try {
      const res = await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        body: formData
      });
      if (!res.ok) throw new Error("Error al actualizar categoría");
      alert("✅ Categoría actualizada");
      if (popupEditar) popupEditar.style.display = "none";
      cargarCategorias();
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar categoría");
    }
  });

  // ==========================
  // LIBROS
  // ==========================
  async function cargarLibros() {
    try {
      const res = await fetch("/api/libros");
      librosData = await res.json();
      renderLibros(librosData);
    } catch (err) {
      console.error("❌ Error cargando libros:", err);
    }
  }

  function renderLibros(libros) {
    const contenedor = document.getElementById("contenedor-libros");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    if (!libros || libros.length === 0) {
      contenedor.innerHTML = "<p>No se encontraron libros.</p>";
      return;
    }

    libros.forEach((libro) => {
      const card = document.createElement("div");
      card.className = "card-libro";
      card.dataset.idLibro = libro.id_libro;
      card.innerHTML = `
        <img src="${libro.portada || "https://via.placeholder.com/120x180?text=Sin+Portada"}" alt="${libro.titulo}">
        <p>${libro.titulo}</p>
      `;
      contenedor.appendChild(card);
    });
  }

  // Filtrar por ID de categoría (para carrusel y select)
  function filtrarPorCategoriaId(idCategoria) {
    if (!idCategoria) {
      renderLibros(librosData);
      if (selectFiltro) selectFiltro.value = "";
      return;
    }

    const idNum = parseInt(idCategoria, 10);
    const filtrados = librosData.filter(
      (l) => Number(l.id_categoria) === idNum
    );
    renderLibros(filtrados);

    if (selectFiltro) selectFiltro.value = String(idCategoria);
  }

  // Detalle de libro
  function mostrarDetalle(libro) {
    document.getElementById("detalleTitulo").textContent =
      libro.titulo || "Sin título";
    document.getElementById("detalleEditorial").textContent =
      libro.editorial || "Desconocida";
    document.getElementById("detalleAutor").textContent =
      libro.autor || "Desconocido";
    document.getElementById("detalleCategoria").textContent =
      libro.categoria_nombre || "Sin categoría";
    document.getElementById("detalleAnio").textContent =
      libro.anio_edicion || "N/A";
    document.getElementById("detalleEjemplares").textContent =
      libro.ejemplares || "0";
    document.getElementById("detalleDescripcion").textContent =
      libro.descripcion || "Sin descripción";
    document.getElementById("popupDetalle").style.display = "flex";
  }

  document.querySelector(".close-detalle")?.addEventListener("click", () => {
    document.getElementById("popupDetalle").style.display = "none";
  });

  document.getElementById("contenedor-libros")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const card = target.closest(".card-libro");
    if (!card) return;

    const titulo = card.querySelector("p")?.textContent;
    if (!titulo) return;

    const libro = librosData.find((l) => l.titulo === titulo);
    if (libro) mostrarDetalle(libro);
  });

  // Buscar por título
  document.querySelector(".btn.buscar")?.addEventListener("click", () => {
    const input = document.getElementById("inputBuscar");
    const texto = input?.value?.toLowerCase() || "";
    const filtrados = librosData.filter((l) =>
      l.titulo?.toLowerCase().includes(texto)
    );
    renderLibros(filtrados);
  });

  // Filtro por categoría desde el select
  selectFiltro?.addEventListener("change", () => {
    const idCategoria = selectFiltro.value;
    filtrarPorCategoriaId(idCategoria);
  });

  // ==========================
  // CARGA INICIAL
  // ==========================
  cargarCategorias();
  cargarLibros();
});
