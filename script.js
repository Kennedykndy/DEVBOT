const textarea = document.querySelector("textarea");

const initialTextareaHeight = textarea.scrollHeight;

// Função para obter resposta do backend
async function createBotReplay(content) {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: content }),
  });

  const data = await response.json();

  if (response.ok) {
    return data.reply;
  } else {
    throw new Error(data.error || "Erro ao obter resposta");
  }
}

// Função para criar mensagens
function createChatMessage(message, type) {
  const li = document.createElement("li");

  li.classList.add("message", type);

  const p = document.createElement("p");

  // Ícone do bot
  if (type === "bot") {
    const i = document.createElement("i");

    i.classList.add("fa-solid", "fa-robot", "fa-xl");

    li.appendChild(i);
  }

  p.textContent = message;

  li.appendChild(p);

  return li;
}

// Fechar chat
function handleCloseChat() {
  document.body.classList.remove("open-chat");
}

// Abrir / fechar chat
function handleTogglerChat() {
  document.body.classList.toggle("open-chat");
}

// Enter para enviar mensagem
function handleChatOnKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    handleChat();
  }
}

// Auto resize textarea
function handleAutoSize() {
  textarea.style.height = `${initialTextareaHeight}px`;

  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Função principal do chat
async function handleChat() {
  const textareaValue = textarea.value.trim();

  if (!textareaValue) return;

  const main = document.querySelector("main");

  const messageHistory = document.querySelector("ul");

  // Mensagem do usuário
  const userMessage = createChatMessage(textareaValue, "user");

  messageHistory.appendChild(userMessage);

  main.scrollTo(0, main.scrollHeight);

  // Limpa textarea
  textarea.value = "";

  textarea.style.height = `${initialTextareaHeight}px`;

  // Mensagem temporária do bot
  const botMessage = createChatMessage("Digitando...", "bot");

  messageHistory.appendChild(botMessage);

  main.scrollTo(0, main.scrollHeight);

  try {
    const botReplay = await createBotReplay(textareaValue);

    botMessage.querySelector("p").textContent = botReplay;

    main.scrollTo(0, main.scrollHeight);
  } catch (error) {
    botMessage.querySelector("p").textContent =
      "Ops! Algo deu errado. Por favor tente novamente.";

    botMessage.querySelector("p").classList.add("error");
  }
}
