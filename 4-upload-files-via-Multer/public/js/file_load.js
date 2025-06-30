document.querySelector("#uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const fileInput = form.querySelector('input[name="file"]');
  const result = document.querySelector("#message");

  if (fileInput.files.length === 0) {
    result.textContent = "Choose a file";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch("/upload-file", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    result.textContent = text;

    if (response.ok) {
      form.reset();
    }
  } catch (error) {
    result.textContent = "Server error";
  }
});
