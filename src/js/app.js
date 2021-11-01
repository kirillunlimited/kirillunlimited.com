const initCurrentYear = () => {
  const currentYearElement = document.querySelector('#current-year');
  currentYearElement.innerHTML = new Date().getFullYear();
};

setupScheme();
initCurrentYear();
