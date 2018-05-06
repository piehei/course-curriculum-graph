
export const getCoursePosition = (id) => {
  const pos = localStorage.getItem(`course-position-${id}`);
  if (pos) {
    return JSON.parse(pos);
  }
  return pos;
};

export const setCoursePosition = (id, x, y) => {
  const obj = JSON.stringify({ 'x': x, 'y': y });
  localStorage.setItem(`course-position-${id}`, obj);
};

