
function saveReport() {
    const data = new Blob(["Hello World"], { type: "text/plain" });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filename.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

const editModal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
});

const jsonUploadBtn = document.getElementById('json-uploadBtn')
window.addEventListener('load', function() {
  setTimeout(function() {
    loadTheSampleData()
  }, 10);
});


  