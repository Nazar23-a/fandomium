<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/Exception.php';
require __DIR__ . '/PHPMailer.php';
require __DIR__ . '/SMTP.php';

// ======================================
// 1. Перевірка HTTP-методу
// ======================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Метод запиту не підтримується.');
}

// ======================================
// 2. Отримання повідомлення
// ======================================

$message = trim($_POST['message'] ?? '');

if (
    $message === '' ||
    mb_strlen($message, 'UTF-8') > 3000
) {
    http_response_code(400);
    exit('Повідомлення порожнє або занадто довге.');
}

// ======================================
// 3. Cloudflare Turnstile
// ======================================

$token = $_POST['cf-turnstile-response'] ?? '';

if ($token === '') {
    http_response_code(403);
    exit('Будь ласка, пройди перевірку Cloudflare.');
}

// Секретний ключ зберігається на сервері!
$turnstileSecret = '0x4AAAAAAFvj3v6i7REMGllIUXbFsGOdPzw';

if (!$turnstileSecret) {
    error_log('Turnstile secret is not configured.');

    http_response_code(500);
    exit('Помилка конфігурації захисту.');
}

$ch = curl_init(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify'
);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'secret' => $turnstileSecret,
        'response' => $token
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_CONNECTTIMEOUT => 5
]);

$result = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($result === false || $httpCode !== 200) {
    error_log('Turnstile API error: ' . $curlError);

    http_response_code(503);
    exit('Не вдалося перевірити Cloudflare. Спробуй пізніше.');
}

$verification = json_decode($result, true);

if (
    !is_array($verification) ||
    ($verification['success'] ?? false) !== true
) {
    http_response_code(403);
    exit('Перевірку Cloudflare не пройдено. Спробуй ще раз.');
}

// ======================================
// 4. Відправлення через PHPMailer
// ======================================

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    $mail->Host       = 'smtp.ukr.net';
    $mail->SMTPAuth   = true;

    $mail->Username = 'nazar2025mail@ukr.net';
    $mail->Password = 'rCiHN6DiyjpNnKQm';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->CharSet = 'UTF-8';

    $mail->setFrom(
        'nazar2025mail@ukr.net',
        'Fandoms Website'
    );

    $mail->addAddress('nazar2025y@gmail.com');

    $mail->Subject = 'Нова пропозиція з сайту';
    $mail->Body    = $message;

    $mail->send();

    echo <<<HTML
    <!DOCTYPE html>
    <html lang='uk'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0, shrink-to-fit=no'>
            <title>Твою пропозицію успішно надіслано!</title>
            <link rel="icon" href="fav2.ico" type="image/x-icon">
            <link rel="preload" href="style.css" as="style">
            <link rel="stylesheet" href="style.css">
        </head>
        <body class='body-center'>
            <nav>
                <a href="fandoms.html">FANDOMS</a>
                <a href="characters.html">CHARACTERS</a>
                <a href="about.html">ABOUT</a>
                <a href="quiz.html">QUIZ</a>
                <a id="selected-chat" href="report.html"><img class="some" src="report.webp" alt="Службова картинка"></a>
            </nav>
            <h1 class='white'>Дякую! Повідомлення успішно надіслано 💜</h1>
        </body>
    </html>
HTML;
} catch (Exception $e) {

    error_log('PHPMailer error: ' . $mail->ErrorInfo);

    http_response_code(500);

    echo <<<HTML
    <!DOCTYPE html>
    <html lang='uk'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0, shrink-to-fit=no'>
            <title>Щось пішло не так...</title>
            <link rel="icon" href="fav2.ico" type="image/x-icon">
            <link rel="preload" href="style.css" as="style">
            <link rel="stylesheet" href="style.css">
        </head>
        <body class='body-center'>
            <nav>
                <a href="fandoms.html">FANDOMS</a>
                <a href="characters.html">CHARACTERS</a>
                <a href="about.html">ABOUT</a>
                <a href="quiz.html">QUIZ</a>
                <a id="selected-chat" href="report.html"><img class="some" src="report.webp" alt="Службова картинка"></a>
            </nav>
            <h1 class='white'>Сталася якась помилка 🥲</h1>
            <h2 class='white'>Спробуй ще раз пізніше</h2>
        </body>
    </html>
HTML;
}