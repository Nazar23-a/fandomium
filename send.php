<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/Exception.php';
require __DIR__ . '/PHPMailer.php';
require __DIR__ . '/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Метод запиту не підтримується.');
}

$message = trim($_POST['message'] ?? '');

if ($message === '' || mb_strlen($message) > 3000) {
    http_response_code(400);
    exit('Повідомлення порожнє або занадто довге.');
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.ukr.net';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'nazar2025mail@ukr.net';
    $mail->Password   = 'rCiHN6DiyjpNnKQm';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->CharSet = 'UTF-8';
    $mail->setFrom('nazar2025mail@ukr.net', 'Fandoms Website');
    $mail->addAddress('nazar2025y@gmail.com');

    $mail->Subject = 'Нова пропозиція з сайту';
    $mail->Body    = $message;

    $mail->send();

    echo 'Дякую! Повідомлення успішно надіслано 💜';
} catch (Exception $e) {
    error_log('Помилка надсилання листа: ' . $mail->ErrorInfo);

    http_response_code(500);
    echo 'Не вдалося надіслати повідомлення. Спробуй пізніше.';
}
