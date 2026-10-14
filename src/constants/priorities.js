export const PRIORITIES = [
  { key: 'critical', label: 'Критический', color: '#cf1322', bg: '#fff1f0', border: '#ffa39e' },
  { key: 'high', label: 'Высокий', color: '#fa8c16', bg: '#fff7e6', border: '#ffd591' },
  { key: 'medium', label: 'Средний', color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff' },
  { key: 'low', label: 'Низкий', color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' },
];

export const getPriorityMeta = (key) => {
  return PRIORITIES.find((p) => p.key === key) || PRIORITIES[2]; // по умолчанию Средний
};
