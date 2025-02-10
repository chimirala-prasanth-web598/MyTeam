<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate Certificate - Certificate Hub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6">
                <h2>Generate Certificate</h2>

                <!-- FORM SUBMISSION TO process.php -->
                <form action="process.php" method="POST" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label for="name" class="form-label">Full Name</label>
                        <input type="text" class="form-control" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="category" class="form-label">Category</label>
                        <select class="form-control" name="category" id="category" required>
                            <option value="">Select Category</option>
                            <option value="engineering">Engineering</option>
                            <option value="management">Management</option>
                            <option value="vocational">Vocational</option>
                            <option value="nptel">NPTEL</option>
                            <option value="language">Language</option>
                            <option value="technical">Technical Skills</option>
                        </select>
                    </div>

                    <!-- PHP-Based Template Selection (Canva & Local) -->
                    <div class="mb-3">
                        <label class="form-label">Select Template</label>
                        <div id="template-container" class="row g-3">
                            <?php
                            $canva_templates = [
                                "engineering" => [
                                    ["id" => "eng1", "name" => "Engineering Excellence", "preview" => "https://www.canva.com/design/DAExyQehv5Y/view", "image" => "https://cdn.canva.com/preview/eng1.png"],
                                    ["id" => "eng2", "name" => "Innovative Engineer", "preview" => "https://www.canva.com/design/DAExyQehv5Y/view", "image" => "https://cdn.canva.com/preview/eng2.png"]
                                ],
                                "management" => [
                                    ["id" => "mgmt1", "name" => "Leadership Award", "preview" => "https://www.canva.com/design/DAExyQehv5Y/view", "image" => "https://cdn.canva.com/preview/mgmt1.png"],
                                    ["id" => "mgmt2", "name" => "Business Excellence", "preview" => "https://www.canva.com/design/DAExyQehv5Y/view", "image" => "https://cdn.canva.com/preview/mgmt2.png"]
                                ],
                                "technical" => [
                                    ["id" => "tech1", "name" => "Tech Wizard", "preview" => "https://www.canva.com/design/DAExyQehv5Y/view", "image" => "https://cdn.canva.com/preview/tech1.png"],
                                    ["id" => "tech2", "name" => "Coding Champion", "preview" => "https://www.canva.com/design/DAExyQehv5Y/view", "image" => "https://cdn.canva.com/preview/tech2.png"]
                                ]
                            ];

                            $selected_category = isset($_POST['category']) ? $_POST['category'] : "engineering";
                            $templates = isset($canva_templates[$selected_category]) ? $canva_templates[$selected_category] : [];

                            foreach ($templates as $template) {
                                echo '
                                <div class="col-md-4 text-center">
                                    <label class="template-option">
                                        <input type="radio" name="template" value="'.$template['id'].'" required>
                                        <a href="'.$template['preview'].'" target="_blank">
                                            <img src="'.$template['image'].'" alt="'.$template['name'].'" class="img-fluid">
                                        </a>
                                        <p class="mt-2">'.$template['name'].'</p>
                                    </label>
                                </div>';
                            }
                            ?>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="logo" class="form-label">Upload Logo (optional)</label>
                        <input type="file" class="form-control" name="logo" accept="image/*">
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Generate Certificate</button>
                </form>
            </div>

            <div class="col-md-6">
                <div class="preview-container">
                    <h3>Preview</h3>
                    <?php
                    if (isset($_GET['certificate_id'])) {
                        $certificateId = $_GET['certificate_id'];
                        echo "<div class='alert alert-success mt-3'>Certificate Generated Successfully!</div>";
                        echo "<p>Certificate ID: <strong>$certificateId</strong></p>";
                        echo "<a href='download.php?id=$certificateId' class='btn btn-primary'>Download Certificate</a>";
                    } else {
                        echo '<p class="text-muted text-center">Certificate preview will appear here</p>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Certificate Generated!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Your certificate has been generated successfully!</p>
                    <p><strong>Certificate ID:</strong> <span id="certificate-id"></span></p>
                    <div class="d-grid gap-2">
                        <a id="preview-link" href="#" class="btn btn-primary" target="_blank">Preview Certificate</a>
                        <a id="download-link" href="#" class="btn btn-success">Download Certificate</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- JS Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
