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

        // Form submission handler
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

        // Load templates when page loads
        document.addEventListener('DOMContentLoaded', loadTemplates);

        // Add this function for live preview
        function updatePreview() {
            const name = document.getElementById('name').value || 'Your Name';
            const category = document.getElementById('category').value || 'Selected Category';
            const selectedTemplate = document.querySelector('.template-option.selected');
            
            if (!selectedTemplate) return;
            
            const templateId = selectedTemplate.dataset.templateId;
            const previewContainer = document.getElementById('certificate-preview');
            
            // Show loading state
            previewContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Generating preview...</p></div>';

            // Generate preview
            fetch('http://localhost:3000/api/preview-certificate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, category, templateId })
            })
            .then(response => response.blob())
            .then(blob => {
                const previewUrl = URL.createObjectURL(blob);
                previewContainer.innerHTML = `<img src="${previewUrl}" class="img-fluid" alt="Certificate Preview">`;
            })
            .catch(error => {
                console.error('Preview error:', error);
                previewContainer.innerHTML = '<p class="text-danger">Error generating preview</p>';
            });
        }

        // Update event listeners
        document.getElementById('name')?.addEventListener('input', updatePreview);
        document.getElementById('category')?.addEventListener('change', updatePreview);

        // Update template selection handler
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.template-option').forEach(opt => 
                    opt.classList.remove('selected'));
                option.classList.add('selected');
                updatePreview();
            });
        });
