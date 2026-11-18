<?php

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(404);
    exit('Неправильний ID');
}

$dataFile = __DIR__ . '/fandoms.json';

if (!is_file($dataFile)) {
    http_response_code(500);
    exit('Файл fandoms.json не знайдено');
}

$items = json_decode(file_get_contents($dataFile), true);

if (!is_array($items)) {
    http_response_code(500);
    exit('Помилка читання JSON');
}

$item = null;

foreach ($items as $entry) {
    if ((int)($entry['id'] ?? 0) === $id) {
        $item = $entry;
        break;
    }
}

if (!$item) {
    http_response_code(404);
    exit('Фандом не знайдено');
}

$backUrl = 'fandoms.html';

require __DIR__ . '/item-template.php';