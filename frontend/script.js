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

        // Update API base URL to use port 3000
        const API_BASE_URL = 'http://localhost:3000/api';
        console.log('API Base URL:', API_BASE_URL);

        // Add configuration object for API settings
        const API_CONFIG = {
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // Verify API is accessible
        fetch(`${API_BASE_URL}/health-check`)
            .then(response => response.ok ? console.log('API is accessible') : console.error('API is not accessible'))
            .catch(error => console.error('API connection error:', error));

        // Define default certificate templates with detailed styles
        const defaultTemplates = [
            {
                id: 'elegant-gold',
                name: 'Elegant Gold',
                category: 'Professional',
                description: 'A sophisticated gold-themed certificate with elegant typography',
                preview: '/images/templates/elegant-gold.png',
                style: {
                    container: `
                        background: linear-gradient(45deg, #f9f6f0 0%, #f1e9d5 100%);
                        border: 2px solid #d4af37;
                        padding: 40px;
                        text-align: center;
                        position: relative;
                        margin: 20px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    `,
                    header: `
                        color: #8B7355;
                        font-family: 'Times New Roman', serif;
                        font-size: 36px;
                        margin-bottom: 30px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    `,
                    body: `
                        color: #5C4033;
                        font-family: 'Times New Roman', serif;
                        font-size: 20px;
                        line-height: 1.6;
                    `,
                    name: `
                        color: #8B7355;
                        font-family: 'Times New Roman', serif;
                        font-size: 32px;
                        margin: 20px 0;
                        font-weight: bold;
                    `,
                    seal: `
                        position: absolute;
                        bottom: 40px;
                        right: 40px;
                        width: 100px;
                        height: 100px;
                        background: url('/images/seal-gold.png') no-repeat center;
                        background-size: contain;
                    `
                }
            },
            {
                id: 'modern-blue',
                name: 'Modern Blue',
                category: 'Corporate',
                description: 'Clean and modern design with professional blue accents',
                preview: '/images/templates/modern-blue.png',
                style: {
                    container: `
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        border: 2px solid #4a90e2;
                        padding: 40px;
                        text-align: center;
                        position: relative;
                        margin: 20px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    `,
                    header: `
                        color: #2c3e50;
                        font-family: 'Arial', sans-serif;
                        font-size: 34px;
                        margin-bottom: 30px;
                        font-weight: 600;
                    `,
                    body: `
                        color: #34495e;
                        font-family: 'Arial', sans-serif;
                        font-size: 18px;
                        line-height: 1.6;
                    `,
                    name: `
                        color: #2c3e50;
                        font-family: 'Arial', sans-serif;
                        font-size: 30px;
                        margin: 20px 0;
                        font-weight: bold;
                    `,
                    seal: `
                        position: absolute;
                        bottom: 40px;
                        right: 40px;
                        width: 100px;
                        height: 100px;
                        background: url('/images/seal-blue.png') no-repeat center;
                        background-size: contain;
                    `
                }
            },
            {
                id: 'classic-red',
                name: 'Classic Red',
                category: 'Academic',
                description: 'Traditional academic-style certificate with red accents',
                preview: '/images/templates/classic-red.png',
                style: {
                    container: `
                        background: #fff;
                        border: 3px double #8b0000;
                        padding: 40px;
                        text-align: center;
                        position: relative;
                        margin: 20px;
                        box-shadow: 0 0 15px rgba(0,0,0,0.1);
                    `,
                    header: `
                        color: #8b0000;
                        font-family: 'Garamond', serif;
                        font-size: 38px;
                        margin-bottom: 30px;
                        text-transform: uppercase;
                    `,
                    body: `
                        color: #333;
                        font-family: 'Garamond', serif;
                        font-size: 20px;
                        line-height: 1.6;
                    `,
                    name: `
                        color: #8b0000;
                        font-family: 'Garamond', serif;
                        font-size: 34px;
                        margin: 20px 0;
                        font-weight: bold;
                    `,
                    seal: `
                        position: absolute;
                        bottom: 40px;
                        right: 40px;
                        width: 100px;
                        height: 100px;
                        background: url('/images/seal-red.png') no-repeat center;
                        background-size: contain;
                    `
                }
            },
            {
                id: 'minimalist',
                name: 'Minimalist',
                category: 'Modern',
                description: 'Clean and simple design focusing on content',
                preview: '/images/templates/minimalist.png',
                style: {
                    container: `
                        background: #ffffff;
                        border: 1px solid #e0e0e0;
                        padding: 40px;
                        text-align: center;
                        position: relative;
                        margin: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    `,
                    header: `
                        color: #333;
                        font-family: 'Helvetica', sans-serif;
                        font-size: 32px;
                        margin-bottom: 30px;
                        font-weight: 300;
                    `,
                    body: `
                        color: #555;
                        font-family: 'Helvetica', sans-serif;
                        font-size: 18px;
                        line-height: 1.6;
                    `,
                    name: `
                        color: #333;
                        font-family: 'Helvetica', sans-serif;
                        font-size: 28px;
                        margin: 20px 0;
                        font-weight: 500;
                    `,
                    seal: `
                        position: absolute;
                        bottom: 40px;
                        right: 40px;
                        width: 80px;
                        height: 80px;
                        background: url('/images/seal-minimal.png') no-repeat center;
                        background-size: contain;
                    `
                }
            }
        ];

        // Function to generate certificate HTML based on template
        function generateCertificateHTML(template, data) {
            return `
                <div class="certificate" style="${template.style.container}">
                    <h1 style="${template.style.header}">Certificate of Achievement</h1>
                    <div style="${template.style.body}">
                        <p>This is to certify that</p>
                        <h2 style="${template.style.name}">${data.name}</h2>
                        <p>has successfully completed the</p>
                        <h3 style="${template.style.body}">${data.category} Course</h3>
                        <p>with a score of ${data.score}%</p>
                        
                        <div style="margin-top: 40px;">
                            <p>Issued on ${new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        
                        <div class="signature-section" style="margin-top: 60px; display: flex; justify-content: space-around;">
                            <div class="signature">
                                <div style="border-top: 1px solid #333; width: 200px; margin-bottom: 10px;"></div>
                                <p>Director</p>
                            </div>
                            <div class="signature">
                                <div style="border-top: 1px solid #333; width: 200px; margin-bottom: 10px;"></div>
                                <p>Administrator</p>
                            </div>
                        </div>
                        
                        <div style="${template.style.seal}"></div>
                    </div>
                </div>
            `;
        }

        // Function to update certificate preview
        function updateCertificatePreview(templateId, formData) {
            const template = defaultTemplates.find(t => t.id === templateId);
            if (!template) return;

            const previewData = {
                name: formData?.get('name') || '[Name]',
                category: formData?.get('category') || '[Category]',
                score: formData?.get('score') || '[Score]'
            };

            const previewContainer = document.getElementById('certificate-preview');
            if (previewContainer) {
                previewContainer.innerHTML = generateCertificateHTML(template, previewData);
            }
        }

        // Update certificate verification handler
        document.getElementById('verify-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const certificateId = document.getElementById('certificate-id').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/certificates/verify/${certificateId}`);
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

        // Define all styles
        const styles = `
            .template-option {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .template-option:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .template-option.selected {
                border-color: var(--primary-color);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }

            .template-option img {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }

            .template-card {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .template-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .template-card.selected {
                border: 2px solid var(--primary-color);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }

            .template-preview {
                height: 200px;
                object-fit: cover;
            }

            .certificate-preview-container {
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                background: #fff;
            }

            .certificate {
                text-align: center;
                padding: 20px;
            }

            .engineering-style {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            }

            .management-style {
                background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
            }

            .technical-style {
                background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
            }

            .language-style {
                background: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%);
            }

            .recipient-name {
                font-size: 24px;
                margin: 20px 0;
            }

            .certificate-footer {
                display: flex;
                justify-content: space-around;
                margin-top: 40px;
            }

            .signature-line, .date-line {
                border-top: 1px solid #000;
                width: 200px;
                padding-top: 10px;
            }
        `;

        // Add styles to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Template selection functionality
        function initializeTemplateSelection() {
            const templateContainer = document.getElementById('template-container');
            if (!templateContainer) return;

            // Add template cards
            templateContainer.innerHTML = defaultTemplates.map(template => `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="template-card card h-100" data-template-id="${template.id}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${template.name}</h5>
                            <p class="card-text">${template.description}</p>
                            <div class="template-preview mb-3">
                                <div class="certificate-sample" style="${template.style.container}">
                                    <h3 style="${template.style.header}">Sample Certificate</h3>
                                </div>
                            </div>
                            <button class="btn btn-outline-primary select-template">Select Template</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handlers for template selection
            const templateCards = document.querySelectorAll('.template-card');
            templateCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Remove selected class from all cards
                    templateCards.forEach(c => c.classList.remove('selected'));
                    // Add selected class to clicked card
                    this.classList.add('selected');
                    
                    // Update select button text
                    const selectButton = this.querySelector('.select-template');
                    if (selectButton) {
                        selectButton.textContent = 'Selected';
                        selectButton.classList.remove('btn-outline-primary');
                        selectButton.classList.add('btn-success');
                    }
                    
                    // Reset other buttons
                    templateCards.forEach(c => {
                        if (c !== this) {
                            const btn = c.querySelector('.select-template');
                            if (btn) {
                                btn.textContent = 'Select Template';
                                btn.classList.add('btn-outline-primary');
                                btn.classList.remove('btn-success');
                            }
                        }
                    });
                });
            });
        }

        // Add styles for template selection
        const templateStyles = `
            .template-card {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .template-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }

            .template-card.selected {
                border-color: #28a745;
                box-shadow: 0 5px 15px rgba(40,167,69,0.2);
            }

            .template-preview {
                height: 200px;
                overflow: hidden;
                border-radius: 4px;
                border: 1px solid #ddd;
            }

            .certificate-sample {
                padding: 20px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;

        // Add styles to document
        function addTemplateStyles() {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = templateStyles;
            document.head.appendChild(styleSheet);
        }

        // Initialize when document is ready
        document.addEventListener('DOMContentLoaded', () => {
            addTemplateStyles();
            initializeTemplateSelection();
        });

        // Update form submission handler
        const certificateForm = document.getElementById('certificate-form');
        if (certificateForm) {
            certificateForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                try {
                    const selectedTemplate = document.querySelector('.template-card.selected');
                    if (!selectedTemplate) {
                        throw new Error('Please select a certificate template');
                    }

                    const formData = new FormData(certificateForm);
                    const certificateData = {
                        templateId: selectedTemplate.dataset.templateId,
                        name: formData.get('name')?.trim(),
                        category: formData.get('category')?.trim(),
                        score: parseInt(formData.get('score'))
                    };

                    // Show loading state
                    const submitButton = certificateForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Generating...';
                    }

                    console.log('Sending request to:', `${API_CONFIG.baseURL}/certificates/generate`);
                    console.log('Certificate data:', certificateData);

                    const response = await fetch(`${API_CONFIG.baseURL}/certificates/generate`, {
                        method: 'POST',
                        headers: API_CONFIG.headers,
                        body: JSON.stringify(certificateData)
                    });

                    if (!response.ok) {
                        throw new Error(`Server responded with ${response.status}`);
                    }

                    const data = await response.json();
            
                    if (data.success) {
                        showNotification('success', 'Certificate generated successfully!');
                        // Update preview if available
                        if (data.previewUrl) {
                            document.getElementById('certificate-preview').innerHTML = `
                                <iframe src="${data.previewUrl}" width="100%" height="500px" frameborder="0"></iframe>
                            `;
                        }
                    } else {
                        throw new Error(data.error || 'Failed to generate certificate');
                    }

                } catch (error) {
                    console.error('Certificate generation error:', error);
                    showNotification('error', error.message);
                } finally {
                    // Reset submit button
                    const submitButton = certificateForm.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Generate Certificate';
                    }
                }
            });
        }

        // Add download helper function
        function downloadCertificate(downloadUrl, recipientName) {
            try {
                // Show loading notification
                showNotification('info', 'Preparing download...');

                // Create a hidden link and trigger download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `Certificate-${recipientName.replace(/\s+/g, '-')}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show success notification
                showNotification('success', 'Download started!');
            } catch (error) {
                console.error('Download error:', error);
                showNotification('error', 'Failed to download certificate. Please try again.');
            }
        }

        // Add print helper function
        function printCertificate(previewUrl) {
            try {
                const printWindow = window.open(previewUrl, '_blank');
                printWindow.onload = function() {
                    printWindow.print();
                };
            } catch (error) {
                console.error('Print error:', error);
                showNotification('error', 'Failed to print certificate. Please try again.');
            }
        }

        // Enhanced notification function
        function showNotification(type, message) {
            const notificationContainer = document.getElementById('notification-container') || createNotificationContainer();
            
            // Remove any existing notifications
            while (notificationContainer.firstChild) {
                notificationContainer.removeChild(notificationContainer.firstChild);
            }
            
            const notification = document.createElement('div');
            notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
            notification.role = 'alert';
            notification.innerHTML = `
                <strong>${type === 'error' ? 'Error: ' : 'Success! '}</strong>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            notificationContainer.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }

        // Helper function to create notification container
        function createNotificationContainer() {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1050;
                max-width: 350px;
            `;
            document.body.appendChild(container);
            return container;
        }

        // Add this to your HTML
        function addNotificationStyles() {
            const styles = `
                .alert {
                    margin-bottom: 10px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .alert-success {
                    background-color: #d4edda;
                    border-color: #c3e6cb;
                    color: #155724;
                }
                .alert-danger {
                    background-color: #f8d7da;
                    border-color: #f5c6cb;
                    color: #721c24;
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        // Initialize notification styles
        document.addEventListener('DOMContentLoaded', () => {
            addNotificationStyles();
        });

        // Add event listeners for live preview
        ['name', 'category', 'score'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', updateLivePreview);
        });

        // Initialize preview on page load
        document.addEventListener('DOMContentLoaded', updateLivePreview);

        // Add the missing updateLivePreview function
        function updateLivePreview(templateId, formData) {
            const previewContainer = document.getElementById('certificate-preview');
            if (!previewContainer) return;

            const template = defaultTemplates.find(t => t.id === templateId);
            if (!template) return;

            const name = formData?.get('name') || '[Your Name]';
            const category = formData?.get('category') || '[Category]';
            const score = formData?.get('score') || '[Score]';

            const previewHTML = `
                <div class="certificate-preview" style="${template.style.container}">
                    <h1 style="${template.style.header}">Certificate of Achievement</h1>
                    <div style="${template.style.body}">
                        <p>This certifies that</p>
                        <h2 style="${template.style.name}">${name}</h2>
                        <p>has successfully completed the</p>
                        <h3 style="${template.style.body}">${category}</h3>
                        <p>with a score of ${score}%</p>
                        
                        <div style="margin-top: 40px;">
                            <p>Issued on ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            `;

            previewContainer.innerHTML = previewHTML;
        }

        // Add live preview update to form inputs
        function initializeLivePreview() {
            const form = document.getElementById('certificate-form');
            const inputs = form?.querySelectorAll('input, select');
            
            if (inputs) {
                inputs.forEach(input => {
                    input.addEventListener('input', () => {
                        const selectedTemplate = document.querySelector('.template-card.selected');
                        if (selectedTemplate) {
                            updateLivePreview(selectedTemplate.dataset.templateId, new FormData(form));
                        }
                    });
                });
            }
        }

        // Health check function
        async function checkAPIHealth() {
            try {
                console.log('Checking API health at:', `${API_CONFIG.baseURL}/health-check`);
                const response = await fetch(`${API_CONFIG.baseURL}/health-check`, {
                    method: 'GET',
                    headers: API_CONFIG.headers
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('API health check response:', data);
                    
                    if (data.status === 'ok') {
                        console.log('API is accessible and MongoDB is', data.mongodb);
                        showNotification('success', 'Connected to server');
                        return true;
                    } else {
                        throw new Error('API health check failed');
                    }
                } else {
                    console.error('API health check failed with status:', response.status);
                    showNotification('error', 'Unable to connect to server');
                    return false;
                }
            } catch (error) {
                console.error('API health check error:', error);
                showNotification('error', 'Server connection failed');
                return false;
            }
        }

        // Check API health on page load
        document.addEventListener('DOMContentLoaded', () => {
            checkAPIHealth().then(isHealthy => {
                if (!isHealthy) {
                    console.warn('API health check failed on page load');
                }
            });
        });
