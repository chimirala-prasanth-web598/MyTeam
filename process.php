<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('tcpdf/tcpdf.php');
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';
require 'PHPMailer-master/src/Exception.php';

include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $name        = trim($_POST['name']);
    $email       = trim($_POST['email']);
    $category    = trim($_POST['category']);
    $template_id = trim($_POST['template']);

    // Map template IDs to relative paths of template images
    $template_images = [
        "eng1"  => "templates/engineering2.png",
        "eng2"  => "templates/engineering2.jpg",
        "mgmt1" => "templates/management.jpg",
        "mgmt2" => "templates/management2.jpg",
        "tech1" => "templates/technical.jpg",
        "tech2" => "templates/technical2.jpg"
    ];

    // Validate template selection
    if (!isset($template_images[$template_id])) {
        die("❌ Error: Invalid template selection.");
    }

    // Use the mapped image if available
    $template_path = __DIR__ . "/" . $template_images[$template_id];

    // Debug: Check if the file exists
    if (!file_exists($template_path)) {
        die("❌ Error: Template file not found at: " . $template_path);
    }

    try {
        // Create a new PDF document
        $pdf = new TCPDF();
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Certificate Hub');
        $pdf->SetTitle('Certificate of Achievement');
        $pdf->SetSubject('Certificate');
        $pdf->SetAutoPageBreak(TRUE, 0);
        $pdf->AddPage();

        // Add background image
        $pdf->Image($template_path, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);

        // Set font
        $pdf->SetFont('helvetica', 'B', 40);

        // Certificate Text
        $pdf->SetXY(0, 100);
        $pdf->Cell(0, 10, $name, 0, 1, 'C');
        
        $pdf->SetFont('helvetica', 'B', 30);
        $pdf->SetXY(0, 140);
        $pdf->Cell(0, 10, strtoupper($category), 0, 1, 'C');

        // Ensure the certificates directory exists
        $certificates_dir = __DIR__ . "/certificates";
        if (!file_exists($certificates_dir)) {
            mkdir($certificates_dir, 0777, true);
        }

        // Generate PDF certificate filename
        $certificate_filename = "certificate_" . time() . ".pdf";
        $certificate_path = $certificates_dir . "/" . $certificate_filename;
        // Display preview and action buttons
        echo "<p class='alert alert-success'>✅ Certificate Generated Successfully!</p>";
        echo "<iframe src='certificates/$certificate_filename' width='80%' height='700px'></iframe>";
        //echo "<a href='certificates/$certificate_filename' download class='btn btn-primary mt-3'>Download Certificate</a>";
        // Save PDF file
        $pdf->Output($certificate_path, 'F');

        // ✅ Send email with attachment
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Replace with your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'syamdattuyadav@gmail.com'; // Replace with your Gmail
        $mail->Password = 'nxhx iyaw skyx sovz'; // Replace with your App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;;
        $mail->Port = 587;
        $mail->setFrom('syamdattuyadav@gmail.com', 'Certificate Hub');
        //$mail->setFrom('your_email@gmail.com', 'Certificate Hub');
        $mail->addAddress($email, $name);
        $mail->addAttachment($certificate_path);
        $mail->isHTML(true);
        $mail->Subject = 'Your Certificate of Achievement';
        $mail->Body = "Hello <b>$name</b>,<br><br>Congratulations! Attached is your certificate.<br><br>Best regards,<br>Certificate Hub";

        if ($mail->send()) {
            echo "<p class='alert alert-success'>✅ Certificate Generated & Sent Successfully!</p>";
        } else {
            echo "<p class='alert alert-danger'>❌ Error sending email: " . $mail->ErrorInfo . "</p>";
        }

        // Download link
        echo "<a href='certificates/$certificate_filename' download class='btn btn-primary mt-3'>Download Certificate</a>";

    } catch (Exception $e) {
        echo "<p class='alert alert-danger'>❌ Error generating certificate: " . $e->getMessage() . "</p>";
    }
}
?>
