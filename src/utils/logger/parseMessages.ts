const parseMessages: (...messages: any[]) => string = (...messages) => {
  return messages.map(m => JSON.stringify(m)).join(' ');
};

export { parseMessages };
