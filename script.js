function loadAndCropImage(input, imgId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById(imgId);
      img.src = e.target.result;

      img.onload = function () {
        const aspectRatio = img.width / img.height;

        if (aspectRatio > 1) {
          // Wide image
          img.style.width = "auto";
          img.style.height = "100%";
        } else {
          // Tall image
          img.style.width = "100%";
          img.style.height = "auto";
        }

        // Center image within the container
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
  
  // Hide upload buttons before capturing
  uploadButtons.forEach(button => button.style.display = "none");

  // Capture the grid as a canvas
  html2canvas(gridContainer, { backgroundColor: null }).then(canvas => {
    // Convert canvas to Blob
    canvas.toBlob(blob => {
      if (!blob) {
        alert("Something went wrong creating the image.");
        // Re-show upload buttons
        uploadButtons.forEach(button => button.style.display = "block");
        return;
      }

      const file = new File([blob], "grid-image.png", { type: "image/png" });

      // Check if Web Share is available with file support
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: "My 3x3 Grid"
        })
        .then(() => {
          // Successfully opened native share sheet
          // Re-show upload buttons
          uploadButtons.forEach(button => button.style.display = "block");
        })
        .catch(error => {
          console.error("Sharing failed", error);
          // Fallback if user cancels or share fails
          downloadFallback(canvas);
        });
      } else {
        // If can't use Web Share API with files, do fallback
        downloadFallback(canvas);
      }
    });
  });
  
  // Fallback: a standard download link
  function downloadFallback(canvas) {
    const link = document.createElement("a");
    link.download = "grid-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // Re-show upload buttons
    uploadButtons.forEach(button => button.style.display = "block");
  }
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
      img.style.left = `${initialLeft + dx}px`;
      img.style.top = `${initialTop + dy}px`;
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
});
