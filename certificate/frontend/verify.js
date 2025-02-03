const API_BASE_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", function () {
  const verifyForm = document.getElementById("verifyForm");

  if (verifyForm) {
    verifyForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const verificationCode =
        document.getElementById("verificationCode").value;
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;

      try {
        submitButton.innerHTML =
          '<span class="spinner-border spinner-border-sm"></span> Verifying...';
        submitButton.disabled = true;

        const response = await fetch(
          `${API_BASE_URL}/certificates/verify/${verificationCode}`
        );

        if (!response.ok) {
          throw new Error("Certificate not found");
        }

        const data = await response.json();

        if (data.success) {
          const certificateDetails =
            document.getElementById("certificateDetails");
          certificateDetails.classList.remove("d-none");

          const certificateInfo = document.getElementById("certificateInfo");
          certificateInfo.innerHTML = `
            <h3 class="text-center mb-4">Certificate Details</h3>
            <div class="certificate-info">
              <p><strong>Certificate ID:</strong> ${data.data.certificateId}</p>
              <p><strong>Recipient:</strong> ${data.data.recipientName}</p>
              <p><strong>Course:</strong> ${data.data.courseName}</p>
              <p><strong>Category:</strong> ${data.data.category}</p>
              <p><strong>Subcategory:</strong> ${data.data.subcategory}</p>
              <p><strong>Issue Date:</strong> ${new Date(
                data.data.issueDate
              ).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span class="badge bg-success">Valid</span></p>
            </div>
          `;
        } else {
          throw new Error(data.error || "Invalid certificate");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(error.message || "Error verifying certificate");
      } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});
