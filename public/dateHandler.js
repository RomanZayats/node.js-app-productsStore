function toDate(date) {
  return new Intl.DateTimeFormat("us-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
}

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});
