export const defaultMessages = {
  isInvalid: "is invalid",
  isMissing: "is missing",
  isRequired: "is required",
};

export function getMessage(key, messages = defaultMessages) {
  return messages[key] || defaultMessages[key];
}

export function getMessages() {
  return defaultMessages;
}

export function setMessages(messages = {}) {
  Object.assign(defaultMessages, messages);
}
