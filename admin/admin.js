const API_URL = "https://bidjory-api.bidjorysamuel.workers.dev/projects";

// LOGIN
const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const loginTokenInput = document.getElementById("loginToken");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

// FORM
const form = document.getElementById("projectForm");
const formTitle = document.getElementById("formTitle");
const projectIdInput = document.getElementById("projectId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const progressInput = document.getElementById("progress");
const tagsInput = document.getElementById("tags");
const yearInput = document.getElementById("year");
const categoryInput = document.getElementById("category");
const linkInput = document.getElementById("link");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const reloadBtn = document.getElementById("reloadBtn");
const message = document.getElementById("message");
const projectsList = document.getElementById("projectsList");
const avatarInput = document.getElementById("avatar");
const avatarFileInput = document.getElementById("avatarFile");
const avatarPreview = document.getElementById("avatarPreview");
const bannerInput = document.getElementById("banner");
const bannerFileInput = document.getElementById("bannerFile");
const bannerPreview = document.getElementById("bannerPreview");

let projects = [];

function getToken() {
  return localStorage.getItem("bidjory_admin_token") || "";
}

function setToken(token) {
  localStorage.setItem("bidjory_admin_token", token);
}

function clearToken() {
  localStorage.removeItem("bidjory_admin_token");
}

function showLogin(errorText = "") {
  loginScreen.classList.remove("hidden");
  adminPanel.classList.add("hidden");
  loginMessage.textContent = errorText;
}

function showAdminPanel() {
  loginScreen.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  loginMessage.textContent = "";
  loadProjects();
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = type;
}

function getProjectFromForm() {
  return {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value,
    progress: Number(progressInput.value || 0),
    tags: tagsInput.value
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean),
    year: yearInput.value.trim(),
    category: categoryInput.value.trim(),
    link: linkInput.value.trim() || "#",
    avatar: avatarInput.value.trim(),
    banner: bannerInput.value.trim()
  };
}

function resetForm() {
  form.reset();
  avatarInput.value = "";
  avatarFileInput.value = "";
  avatarPreview.innerHTML = "";
  bannerInput.value = "";
  bannerFileInput.value = "";
  bannerPreview.innerHTML = "";
  projectIdInput.value = "";
  formTitle.textContent = "Novo projeto";
  submitBtn.textContent = "Criar projeto";
  cancelEditBtn.classList.add("hidden");
  progressInput.value = 0;
  showMessage("");
}

function fillForm(project) {
  projectIdInput.value = project.id;
  titleInput.value = project.title || "";
  descriptionInput.value = project.description || "";
  avatarInput.value = project.avatar || "";
  avatarPreview.innerHTML = project.avatar
  ? `<img src="${project.avatar}" alt="Preview do avatar">`
  : "";
  bannerInput.value = project.banner || "";

  bannerPreview.innerHTML = project.banner
    ? `<img src="${project.banner}" alt="Preview do banner">`
    : "";
  statusInput.value = project.status || "building";
  progressInput.value = project.progress || 0;
  tagsInput.value = Array.isArray(project.tags) ? project.tags.join(", ") : "";
  yearInput.value = project.year || "";
  categoryInput.value = project.category || "";
  linkInput.value = project.link && project.link !== "#" ? project.link : "";

  formTitle.textContent = `Editando: ${project.title}`;
  submitBtn.textContent = "Salvar alterações";
  cancelEditBtn.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProjectsList() {
  if (!projects.length) {
    projectsList.innerHTML = `<p class="muted">Nenhum projeto cadastrado ainda.</p>`;
    return;
  }

  projectsList.innerHTML = projects.map(project => {
    const tags = Array.isArray(project.tags) ? project.tags : [];

    return `
      <article class="project-item">
        <div class="project-top">
          <div class="project-title">${project.title || "Sem título"}</div>
          <div class="project-status">${project.status || "building"}</div>
        </div>

        <p class="project-desc">${project.description || ""}</p>

        <div class="project-meta">
          <span>Avatar: ${project.avatar ? "Sim" : "Não"}</span>
          <span>ID: ${project.id}</span>
          <span>Ano: ${project.year || "-"}</span>
          <span>Categoria: ${project.category || "-"}</span>
          <span>Progresso: ${project.progress || 0}%</span>
          ${tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>

        <div class="project-actions">
          <button type="button" onclick="editProject(${project.id})">Editar</button>
          <button type="button" class="danger" onclick="deleteProject(${project.id})">Deletar</button>
        </div>
      </article>
    `;
  }).join("");
}

async function loadProjects() {
  projectsList.innerHTML = `<p class="muted">Carregando projetos...</p>`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erro ao carregar projetos");
    }

    projects = await response.json();
    renderProjectsList();

  } catch (error) {
    projectsList.innerHTML = `<p class="muted">Erro ao carregar projetos.</p>`;
    console.error(error);
  }
}

async function createProject(project) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(project)
  });

  return response.json();
}

async function updateProject(id, project) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(project)
  });

  return response.json();
}

async function removeProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });

  return response.json();
}

async function testToken(token) {
  const testProject = {
    title: "__token_test__",
    description: "",
    status: "inactive",
    progress: 0,
    tags: [],
    year: "",
    category: "",
    link: "#"
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(testProject)
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Token inválido");
  }

  await fetch(`${API_URL}/${result.id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

window.editProject = function(id) {
  const project = projects.find(item => Number(item.id) === Number(id));

  if (!project) {
    alert("Projeto não encontrado.");
    return;
  }

  fillForm(project);
};

window.deleteProject = async function(id) {
  const confirmed = confirm("Tem certeza que deseja deletar este projeto?");

  if (!confirmed) return;

  try {
    const result = await removeProject(id);

    if (!result.success) {
      throw new Error(result.error || "Erro ao deletar projeto.");
    }

    await loadProjects();
    showMessage("Projeto deletado com sucesso.", "success");

  } catch (error) {
    showMessage(error.message, "error");
  }
};

loginBtn.addEventListener("click", async () => {
  const token = loginTokenInput.value.trim();

  if (!token) {
    loginMessage.textContent = "Digite o token.";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Entrando...";
  loginMessage.textContent = "";

  try {
    setToken(token);
    showAdminPanel();

  } catch (error) {
    clearToken();
    showLogin(error.message || "Token inválido.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Entrar";
  }
});

loginTokenInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loginBtn.click();
  }
});

logoutBtn.addEventListener("click", () => {
  clearToken();
  resetForm();
  showLogin();
});


async function convertImageToWebP(file, quality = 0.82, maxSize = 512) {
  const imageBitmap = await createImageBitmap(file);

  let width = imageBitmap.width;
  let height = imageBitmap.height;

  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) return reject(new Error("Erro ao converter imagem para WebP."));
      resolve(new File([blob], "avatar.webp", { type: "image/webp" }));
    }, "image/webp", quality);
  });
}

async function uploadProjectAvatar(file) {
  const webpFile = await convertImageToWebP(file);

  const formData = new FormData();
  formData.append("file", webpFile);

  const response = await fetch("https://bidjory-api.bidjorysamuel.workers.dev/upload/project-avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Erro ao enviar imagem.");
  }

  return result.url;
}

async function uploadProjectBanner(file) {
  const webpFile = await convertImageToWebP(file, 0.82, 1200);

  const formData = new FormData();
  formData.append("file", webpFile);

  const response = await fetch("https://bidjory-api.bidjorysamuel.workers.dev/upload/project-banner", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Erro ao enviar banner.");
  }

  return result.url;
}


avatarFileInput.addEventListener("change", async () => {
  const file = avatarFileInput.files[0];
  if (!file) return;

  try {
    showMessage("Convertendo imagem para WebP e enviando...");

    const url = await uploadProjectAvatar(file);

    avatarInput.value = url;

    avatarPreview.innerHTML = `
      <img src="${url}" alt="Preview do avatar">
    `;

    showMessage("Imagem enviada com sucesso.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

bannerFileInput.addEventListener("change", async () => {
  const file = bannerFileInput.files[0];
  if (!file) return;

  try {
    showMessage("Convertendo banner para WebP e enviando...");

    const url = await uploadProjectBanner(file);

    bannerInput.value = url;

    bannerPreview.innerHTML = `
      <img src="${url}" alt="Preview do banner">
    `;

    showMessage("Banner enviado com sucesso.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();

  if (!token) {
    showMessage("Faça login novamente.", "error");
    showLogin();
    return;
  }

  const project = getProjectFromForm();

  if (!project.title) {
    showMessage("Título é obrigatório.", "error");
    return;
  }

  const editingId = projectIdInput.value;

  submitBtn.disabled = true;
  submitBtn.textContent = editingId ? "Salvando..." : "Criando...";

  try {
    const result = editingId
      ? await updateProject(editingId, project)
      : await createProject(project);

    if (!result.success) {
      if (result.error === "Não autorizado") {
        clearToken();
        showLogin("Token inválido ou expirado.");
      }

      throw new Error(result.error || "Erro ao salvar projeto.");
    }

    await loadProjects();
    resetForm();

    showMessage(
      editingId ? "Projeto atualizado com sucesso." : "Projeto criado com sucesso.",
      "success"
    );

  } catch (error) {
    showMessage(error.message, "error");

  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editingId ? "Salvar alterações" : "Criar projeto";
  }
});

cancelEditBtn.addEventListener("click", resetForm);
reloadBtn.addEventListener("click", loadProjects);

document.addEventListener("DOMContentLoaded", () => {
  const savedToken = getToken();

  if (savedToken) {
    showAdminPanel();
  } else {
    showLogin();
  }
});