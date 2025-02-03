const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";

const categories = {
  engineering: {
    name: "Engineering",
    subcategories: {
      "Computer Science": ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      Mechanical: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      Electrical: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      Civil: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      Electronics: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      Chemical: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    },
  },
  management: {
    name: "Management",
    subcategories: {
      Finance: [],
      Marketing: [],
      "Human Resources": [],
      Operations: [],
      Strategy: [],
      "International Business": [],
    },
  },
  competitive: {
    name: "Competitive Exams",
    subcategories: {
      GATE: [],
      CAT: [],
      GRE: [],
      UPSC: [],
      Banking: [],
      SSC: [],
    },
  },
  language: {
    name: "Languages",
    subcategories: {
      English: [],
      German: [],
      French: [],
      Spanish: [],
      Japanese: [],
      Mandarin: [],
    },
  },
  technical: {
    name: "Technical Skills",
    subcategories: {
      "Web Development": [],
      "Data Science": [],
      "Cloud Computing": [],
      "Artificial Intelligence": [],
      Cybersecurity: [],
      DevOps: [],
    },
  },
};

// Add certificate backgrounds
const certificateBackgrounds = [
  { id: "bg1", name: "Classic", path: "images/backgrounds/bg1.jpg" },
  { id: "bg2", name: "Modern", path: "images/backgrounds/bg2.jpg" },
  { id: "bg3", name: "Elegant", path: "images/backgrounds/bg3.jpg" },
  { id: "bg4", name: "Professional", path: "images/backgrounds/bg4.jpg" },
  { id: "bg5", name: "Academic", path: "images/backgrounds/bg5.jpg" },
  { id: "bg6", name: "Corporate", path: "images/backgrounds/bg6.jpg" },
  { id: "bg7", name: "Traditional", path: "images/backgrounds/bg7.jpg" },
  { id: "bg8", name: "Contemporary", path: "images/backgrounds/bg8.jpg" },
];

// Available fonts for certificates
const certificateFonts = {
  helvetica: {
    name: "Helvetica",
    class: "font-helvetica",
  },
  times: {
    name: "Times New Roman",
    class: "font-times",
  },
  georgia: {
    name: "Georgia",
    class: "font-georgia",
  },
  calibri: {
    name: "Calibri",
    class: "font-calibri",
  },
  palatino: {
    name: "Palatino",
    class: "font-palatino",
  },
};

// Function to create background options
function createBackgroundOptions() {
  const container = document.querySelector(".background-preview-grid .row");
  if (container) {
    certificateBackgrounds.forEach((bg) => {
      const col = document.createElement("div");
      col.className = "col-md-3 col-6";
      col.innerHTML = `
        <div class="background-option">
          <input type="radio" name="background" id="${bg.id}" 
            value="${bg.id}" class="d-none" required>
          <label for="${bg.id}" class="background-preview">
            <img src="${bg.path}" alt="${bg.name}" class="img-fluid">
          </label>
        </div>
      `;
      container.appendChild(col);
    });
  }
}

// Function to handle photo preview
function previewPhoto(input) {
  const preview = document.getElementById("photoPreview");
  const previewImage = preview.querySelector("img");

  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image under 2MB");
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      preview.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  }
}

// Function to remove photo
function removePhoto() {
  const photoInput = document.getElementById("recipientPhoto");
  const preview = document.getElementById("photoPreview");

  photoInput.value = "";
  preview.classList.add("d-none");
  preview.querySelector("img").src = "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Test server connection
  async function testServerConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      console.log("Server health check:", data);
    } catch (error) {
      console.error("Server connection test failed:", error);
    }
  }

  testServerConnection();

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  // If category is provided, set it in the form
  if (category) {
    const categorySelect = document.getElementById("category");
    if (categorySelect) {
      categorySelect.value = category;
    }
  }

  // Add subcategory handling
  const categorySelect = document.getElementById("category");
  const subcategorySelect = document.getElementById("subcategory");
  const yearContainer = document.getElementById("yearContainer");
  const yearSelect = document.getElementById("year");

  if (categorySelect) {
    categorySelect.addEventListener("change", function () {
      updateSubcategories(this);
    });
  }

  if (subcategorySelect) {
    subcategorySelect.addEventListener("change", function () {
      updateYears(this);
    });
  }

  // Create background options
  createBackgroundOptions();

  // Handle certificate form submission
  const certificateForm = document.getElementById("certificateForm");
  if (certificateForm) {
    certificateForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Debug log
      console.log("Starting certificate generation...");

      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm"></span> Generating...';
      submitButton.disabled = true;

      // Get photo data if uploaded
      let photoData = null;
      const photoInput = document.getElementById("recipientPhoto");
      if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        photoData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(photoInput.files[0]);
        });
      }

      const formData = {
        category: document.getElementById("category").value,
        subcategory: document.getElementById("subcategory").value,
        year:
          document.getElementById("category").value === "engineering"
            ? document.getElementById("year").value || null
            : null,
        recipientName: document.getElementById("recipientName").value,
        courseName: document.getElementById("courseName").value,
        appreciationText: document.getElementById("appreciationText").value,
        fontStyle: document.getElementById("fontStyle").value,
        background:
          document.querySelector('input[name="background"]:checked')?.value ||
          "bg1",
        photo: photoData,
      };

      try {
        // Log form data
        console.log("Form data:", formData);

        const apiUrl = `${API_BASE_URL}/certificates/generate`;
        console.log("Sending request to:", apiUrl);

        const response = await fetch(`${API_BASE_URL}/certificates/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          throw new Error("Invalid response format from server");
        }

        // Log response status
        console.log("Response status:", response.status);

        if (!response.ok) {
          console.error("Server error:", data.error);
          throw new Error(data.error || `Server error: ${response.status}`);
        }

        console.log("Response data:", data);

        if (data.success) {
          // Show preview section
          document.getElementById("previewSection").classList.remove("d-none");

          // Get selected background
          const selectedBg = certificateBackgrounds.find(
            (bg) => bg.id === formData.background
          );

          // Display certificate preview
          const previewHtml = `
            <div class="certificate-preview ${
              certificateFonts[formData.fontStyle].class
            }" 
              style="background-image: url('${selectedBg.path}')">
              ${
                photoData
                  ? `
                <div class="recipient-photo">
                  <img src="${photoData}" alt="Recipient Photo">
                </div>
              `
                  : ""
              }
              <div class="certificate-content">
                <h2>Certificate of Completion</h2>
                <p>This is to certify that</p>
                <h3>${formData.recipientName}</h3>
                <p>has successfully completed the course</p>
                <h3>${formData.courseName}</h3>
                <p>in ${formData.subcategory}${
            formData.year ? ` (${formData.year})` : ""
          }</p>
                ${
                  formData.appreciationText
                    ? `
                  <div class="appreciation-text">
                    <p class="mt-4 mb-4 font-italic">
                      "${formData.appreciationText}"
                    </p>
                  </div>
                `
                    : ""
                }
                <p>Certificate ID: ${data.data.certificateId}</p>
                <p>Verification Code: ${data.data.verificationCode}</p>
              </div>
            </div>
          `;
          document.getElementById("certificatePreview").innerHTML = previewHtml;

          // Handle download button
          document.getElementById("downloadBtn").onclick = function () {
            // Convert base64 PDF to blob and download
            const pdfBlob = base64ToBlob(data.pdf, "application/pdf");
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `certificate-${data.data.certificateId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          };

          // Handle email button
          document.getElementById("emailBtn").onclick = async function () {
            try {
              const emailResponse = await fetch(
                `${API_BASE_URL}/certificates/email`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    certificateId: data.data.certificateId,
                    email: formData.recipientEmail,
                  }),
                }
              );

              if (emailResponse.ok) {
                alert("Certificate sent successfully!");
              } else {
                throw new Error("Failed to send email");
              }
            } catch (error) {
              console.error("Email error:", error);
              alert("Failed to send certificate via email");
            }
          };
        } else {
          throw new Error(data.error || "Failed to generate certificate");
        }
      } catch (error) {
        console.error("Error details:", error);
        alert(`Error generating certificate: ${error.message}`);
      } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});

// Utility function to convert base64 to blob
function base64ToBlob(base64, type) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: type });
}

// Handle category card clicks
function navigateToGenerate(category) {
  window.location.href = `generate.html?category=${category}`;
}

// Add this function to handle subcategory updates
function updateSubcategories(categorySelect) {
  const subcategorySelect = document.getElementById("subcategory");
  const yearContainer = document.getElementById("yearContainer");
  const yearSelect = document.getElementById("year");
  const selectedCategory = categorySelect.value;

  if (subcategorySelect) {
    // Clear existing options
    subcategorySelect.innerHTML =
      '<option value="">Select Subcategory</option>';
    yearSelect.innerHTML = '<option value="">Select Year</option>';
    yearContainer.style.display = "none";

    // Disable subcategory by default
    subcategorySelect.setAttribute("disabled", "disabled");

    // Add new options based on selected category
    if (categories[selectedCategory]) {
      // Enable subcategory select
      subcategorySelect.removeAttribute("disabled");

      // Add subcategories for all categories
      Object.keys(categories[selectedCategory].subcategories).forEach((sub) => {
        const option = document.createElement("option");
        option.value = sub;
        option.textContent = sub;
        subcategorySelect.appendChild(option);
      });
    }
  }
}

// Update the updateYears function
function updateYears(subcategorySelect) {
  const selectedCategory = document.getElementById("category").value;
  const selectedSubcategory = subcategorySelect.value;
  const yearContainer = document.getElementById("yearContainer");
  const yearSelect = document.getElementById("year");

  // Reset year selection when subcategory changes
  yearSelect.innerHTML = '<option value="">Select Year</option>';
  yearSelect.setAttribute("disabled", "disabled");
  yearContainer.style.display = "none";

  if (selectedCategory === "engineering") {
    // Get years directly using the selected subcategory
    const years = categories.engineering.subcategories[selectedSubcategory];

    if (!years) return;

    years.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    yearSelect.removeAttribute("disabled");
    yearContainer.style.display = "block";
  }
}
