const uploadFunction = (event) => {
  const files = event.target.files;
  const data = new FormData();
  data.append('file', files[0]);
  console.log(data);

  fetch('/pictures', {
    method: 'POST',
    body: data,
  });
};

document.getElementById('formFile').addEventListener('change', (event) => {
  uploadFunction(event);
});
