        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add animation on scroll
        window.addEventListener('scroll', function() {
            const cards = document.querySelectorAll('.feature-card, .category-card');
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                if (cardTop < window.innerHeight - 100) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });

        // Add form submission handler
        document.getElementById('certificate-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const selectedTemplate = document.querySelector('.template-option.selected');
            
            if (!selectedTemplate) {
                alert('Please select a template');
                return;
            }
            
            formData.append('templateId', selectedTemplate.dataset.templateId);
            
            try {
                const response = await fetch('http://localhost:3000/api/generate-certificate', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show preview
                    const previewFrame = document.createElement('iframe');
                    previewFrame.src = data.previewUrl;
                    const previewContainer = document.getElementById('certificate-preview');
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(previewFrame);

                    // Update modal
                    document.getElementById('certificate-id').textContent = data.certificateId;
                    document.getElementById('preview-link').href = data.previewUrl;
                    document.getElementById('download-link').href = data.downloadUrl;

                    // Show modal
                    new bootstrap.Modal(document.getElementById('successModal')).show();
                } else {
                    alert('Error generating certificate. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error generating certificate. Please try again.');
            }
        });

        // Add certificate verification handler
        document.getElementById('verify-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const certificateId = document.getElementById('certificate-id').value;
            
            try {
                const response = await fetch(`http://localhost:3000/api/verify/${certificateId}`);
                const data = await response.json();
                
                if (data.success) {
                    const certificate = data.certificate;
                    document.getElementById('verification-result').innerHTML = `
                        <div class="alert alert-success">
                            <h4>Certificate Verified</h4>
                            <p>Name: ${certificate.name}</p>
                            <p>Category: ${certificate.category}</p>
                            <p>Issue Date: ${new Date(certificate.issueDate).toLocaleDateString()}</p>
                        </div>
                    `;
                } else {
                    document.getElementById('verification-result').innerHTML = `
                        <div class="alert alert-danger">
                            <h4>Invalid Certificate</h4>
                            <p>The certificate ID provided is not valid.</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error verifying certificate. Please try again.');
            }
        });

        // Load certificate templates
        async function loadTemplates() {
            try {
                const response = await fetch('http://localhost:3000/api/templates');
                const templates = await response.json();
                
                const container = document.getElementById('template-container');
                templates.forEach(template => {
                    const templateDiv = document.createElement('div');
                    templateDiv.className = 'col-md-4';
                    templateDiv.innerHTML = `
                        <div class="template-option" data-template-id="${template.id}">
                            <img src="${template.preview}" alt="${template.name}">
                            <p class="text-center mt-2">${template.name}</p>
                        </div>
                    `;
                    container.appendChild(templateDiv);
                });

                // Add template selection handler
                document.querySelectorAll('.template-option').forEach(option => {
                    option.addEventListener('click', () => {
                        document.querySelectorAll('.template-option').forEach(opt => 
                            opt.classList.remove('selected'));
                        option.classList.add('selected');
                    });
                });
            } catch (error) {
                console.error('Error loading templates:', error);
            }
        }

        // Load templates when page loads
        document.addEventListener('DOMContentLoaded', loadTemplates);
