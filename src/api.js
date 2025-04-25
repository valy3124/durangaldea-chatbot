const BASE_URL = import.meta.env.VITE_API_URL;

async function sendChatMessage(_, message) {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message })
  });

  const data = await res.json();

  if (!res.ok) {
    return Promise.reject({ status: res.status, data });
  }

  return data; // Return the parsed response directly
}


async function createChat() {
  // simulate an empty chat ID
  return { id: Date.now().toString() };
}

export default {
  createChat,
  sendChatMessage,
};
