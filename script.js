function loadAndCropImage(input, imgId) {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.getElementById(imgId);
        img.src = e.target.result;
  
        img.onload = function () {
          const wrapper = img.parentElement;
          const aspectRatio = img.width / img.height;
  
          if (aspectRatio > 1) {
            img.style.width = "auto";
            img.style.height = "100%";
          } else {
            img.style.width = "100%";
            img.style.height = "auto";
          }
  
          img.style.left = "50%";
          img.style.top = "50%";
          img.style.transform = "translate(-50%, -50%)";
        };
      };
      reader.readAsDataURL(file);
    }
  }
  
  function toggleLabels() {
    const showLabels = document.getElementById("toggleLabels").checked;
    const labels = document.querySelectorAll(".label");
    labels.forEach(label => {
      label.style.display = showLabels ? "block" : "none";
    });
  }
  
  function exportGrid() {
    const gridContainer = document.getElementById("gridContainer");
    const uploadButtons = document.querySelectorAll(".upload-button");
  
    uploadButtons.forEach(button => button.style.display = "none");
  
    html2canvas(gridContainer, { backgroundColor: null }).then(canvas => {
      const link = document.createElement("a");
      link.download = "grid-image.png";
      link.href = canvas.toDataURL();
      link.click();
  
      uploadButtons.forEach(button => button.style.display = "block");
    });
  }
  
  // Enable dragging of images within the grid cells
  document.querySelectorAll(".croppable").forEach(image => {
    image.addEventListener("mousedown", function (event) {
      const img = event.target;
      let startX = event.clientX;
      let startY = event.clientY;
      let initialLeft = parseFloat(img.style.left) || 50;
      let initialTop = parseFloat(img.style.top) || 50;
  
      function onMouseMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        img.style.left = '${initialLeft + dx}px';
        img.style.top = '${initialTop + dy}px';
      }
  
      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
  
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });
