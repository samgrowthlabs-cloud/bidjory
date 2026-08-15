const API_URL = "https://bidjory-api.bidjorysamuel.workers.dev/projects";
const SOCIAL_SETTINGS_CATEGORY = "__site_social_settings__";
const TIMELINE_SETTINGS_CATEGORY = "__site_timeline_settings__";
const DEFAULT_TIMELINE_ITEMS = [
  { year: "2021", description: "Desde cedo desenvolvi uma forte curiosidade por computadores. Nesse período comecei a explorar tecnologia por conta própria e a entender como sistemas e softwares funcionavam." },
  { year: "2022", description: "Comecei a programar de forma autodidata e a aprender na prática. Também realizei pequenos trabalhos freelance na área, ganhando experiência real com desenvolvimento, mesmo de forma inicial." },
  { year: "2023", description: "Tive meu primeiro contato mais profundo com finanças e investimentos. Comecei a estudar o assunto por interesse próprio e a entender como o mercado financeiro funciona." },
  { year: "2024", description: "Aprofundei ainda mais meus estudos em finanças e comecei a pensar em como unir tecnologia, conteúdo e educação financeira em algo mais estruturado." },
  { year: "2025", description: "Criei a ideia de um projeto próprio e comecei a estruturar mentalmente uma possível holding focada em finanças, mídia e tecnologia." },
  { year: "2026", description: "Iniciei o projeto Samzin, um canal focado em finanças e documentários, com a intenção de criar conteúdo educativo e narrativo sobre o tema." }
];

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
const socialForm = document.getElementById("socialForm");
const saveSocialsBtn = document.getElementById("saveSocialsBtn");
const socialMessage = document.getElementById("socialMessage");
const timelineForm = document.getElementById("timelineForm");
const timelineEditIndexInput = document.getElementById("timelineEditIndex");
const timelineYearInput = document.getElementById("timelineYear");
const timelineDescriptionInput = document.getElementById("timelineDescription");
const saveTimelineItemBtn = document.getElementById("saveTimelineItemBtn");
const cancelTimelineEditBtn = document.getElementById("cancelTimelineEditBtn");
const timelineItemsList = document.getElementById("timelineItemsList");
const timelineMessage = document.getElementById("timelineMessage");
const socialInputs = {
  instagram: document.getElementById("socialInstagram"),
  youtube: document.getElementById("socialYoutube"),
  tiktok: document.getElementById("socialTiktok"),
  linkedin: document.getElementById("socialLinkedin"),
  x: document.getElementById("socialX"),
  facebook: document.getElementById("socialFacebook"),
  github: document.getElementById("socialGithub")
};

let projects = [];
let socialSettingsProject = null;
let timelineSettingsProject = null;
let timelineItems = [];

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

function showSocialMessage(text, type = "") {
  socialMessage.textContent = text;
  socialMessage.className = type;
}

function fillSocialForm(project) {
  let settings = {};
  try {
    settings = project?.description ? JSON.parse(project.description) : {};
  } catch {
    settings = {};
  }
  Object.entries(socialInputs).forEach(([key, input]) => {
    input.value = settings[key] || "";
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function showTimelineMessage(text, type = "") {
  timelineMessage.textContent = text;
  timelineMessage.className = type;
}

function resetTimelineForm() {
  timelineForm.reset();
  timelineEditIndexInput.value = "";
  saveTimelineItemBtn.textContent = "Adicionar acontecimento";
  cancelTimelineEditBtn.classList.add("hidden");
}

function renderTimelineItems() {
  if (!timelineItems.length) {
    timelineItemsList.innerHTML = '<p class="muted">Nenhum acontecimento cadastrado.</p>';
    return;
  }

  timelineItemsList.innerHTML = timelineItems.map((item, index) => `
    <article class="project-item">
      <div class="project-top">
        <div class="project-title">${escapeHtml(item.year)}</div>
      </div>
      <p class="project-desc">${escapeHtml(item.description)}</p>
      <div class="project-actions">
        <button type="button" onclick="editTimelineItem(${index})">Editar</button>
        <button type="button" class="danger" onclick="deleteTimelineItem(${index})">Excluir</button>
      </div>
    </article>
  `).join("");
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

    const allProjects = await response.json();
    socialSettingsProject = allProjects.find(project => project.category === SOCIAL_SETTINGS_CATEGORY) || null;
    timelineSettingsProject = allProjects.find(project => project.category === TIMELINE_SETTINGS_CATEGORY) || null;
    try {
      const savedTimeline = timelineSettingsProject?.description
        ? JSON.parse(timelineSettingsProject.description)
        : DEFAULT_TIMELINE_ITEMS;
      timelineItems = Array.isArray(savedTimeline) ? savedTimeline : DEFAULT_TIMELINE_ITEMS;
    } catch {
      timelineItems = DEFAULT_TIMELINE_ITEMS;
    }
    projects = allProjects.filter(project =>
      project.category !== SOCIAL_SETTINGS_CATEGORY &&
      project.category !== TIMELINE_SETTINGS_CATEGORY
    );
    fillSocialForm(socialSettingsProject);
    renderTimelineItems();
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
    await testToken(token);
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

async function persistTimelineItems(nextItems) {
  const settingsProject = {
    title: "Configurações da linha do tempo",
    description: JSON.stringify(nextItems),
    status: "private",
    progress: 0,
    tags: [],
    year: "",
    category: TIMELINE_SETTINGS_CATEGORY,
    link: "#",
    avatar: "",
    banner: ""
  };

  const result = timelineSettingsProject
    ? await updateProject(timelineSettingsProject.id, settingsProject)
    : await createProject(settingsProject);

  if (!result.success) throw new Error(result.error || "Erro ao salvar a linha do tempo.");
  await loadProjects();
}

window.editTimelineItem = function(index) {
  const item = timelineItems[index];
  if (!item) return;
  timelineEditIndexInput.value = index;
  timelineYearInput.value = item.year;
  timelineDescriptionInput.value = item.description;
  saveTimelineItemBtn.textContent = "Salvar alteração";
  cancelTimelineEditBtn.classList.remove("hidden");
  timelineYearInput.focus();
};

window.deleteTimelineItem = async function(index) {
  if (!timelineItems[index] || !confirm("Excluir este acontecimento da linha do tempo?")) return;
  showTimelineMessage("Salvando...");
  try {
    await persistTimelineItems(timelineItems.filter((_, itemIndex) => itemIndex !== index));
    resetTimelineForm();
    showTimelineMessage("Acontecimento excluído.", "success");
  } catch (error) {
    showTimelineMessage(error.message, "error");
  }
};

timelineForm.addEventListener("submit", async event => {
  event.preventDefault();
  const item = {
    year: timelineYearInput.value.trim(),
    description: timelineDescriptionInput.value.trim()
  };
  if (!item.year || !item.description) return;

  const editIndex = timelineEditIndexInput.value;
  const nextItems = [...timelineItems];
  if (editIndex === "") nextItems.push(item);
  else nextItems[Number(editIndex)] = item;

  saveTimelineItemBtn.disabled = true;
  showTimelineMessage("Salvando...");
  try {
    await persistTimelineItems(nextItems);
    resetTimelineForm();
    showTimelineMessage(editIndex === "" ? "Acontecimento adicionado." : "Acontecimento atualizado.", "success");
  } catch (error) {
    showTimelineMessage(error.message, "error");
  } finally {
    saveTimelineItemBtn.disabled = false;
  }
});

cancelTimelineEditBtn.addEventListener("click", resetTimelineForm);
cancelEditBtn.addEventListener("click", resetForm);
reloadBtn.addEventListener("click", loadProjects);

socialForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!getToken()) {
    showLogin("Faça login novamente.");
    return;
  }

  const settings = Object.fromEntries(
    Object.entries(socialInputs)
      .map(([key, input]) => [key, input.value.trim()])
      .filter(([, value]) => value)
  );
  const settingsProject = {
    title: "Configurações de redes sociais",
    description: JSON.stringify(settings),
    status: "private",
    progress: 0,
    tags: [],
    year: "",
    category: SOCIAL_SETTINGS_CATEGORY,
    link: "#",
    avatar: "",
    banner: ""
  };

  saveSocialsBtn.disabled = true;
  saveSocialsBtn.textContent = "Salvando...";
  showSocialMessage("");

  try {
    const result = socialSettingsProject
      ? await updateProject(socialSettingsProject.id, settingsProject)
      : await createProject(settingsProject);
    if (!result.success) {
      if (/autorizado|unauthorized/i.test(result.error || "")) {
        clearToken();
        showLogin("Token inválido ou expirado. Entre novamente com o ADMIN_TOKEN do Worker.");
        return;
      }
      throw new Error(result.error || "Erro ao salvar redes sociais.");
    }
    await loadProjects();
    showSocialMessage("Redes sociais salvas com sucesso.", "success");
  } catch (error) {
    showSocialMessage(error.message, "error");
  } finally {
    saveSocialsBtn.disabled = false;
    saveSocialsBtn.textContent = "Salvar redes sociais";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const savedToken = getToken();

  if (!savedToken) {
    showLogin();
    return;
  }

  try {
    await testToken(savedToken);
    showAdminPanel();
  } catch {
    clearToken();
    showLogin("Sua sessão não é mais válida. Digite novamente o ADMIN_TOKEN do Worker.");
  }
});
