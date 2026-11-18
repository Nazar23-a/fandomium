<?php
$name = htmlspecialchars($item['name'] ?? '', ENT_QUOTES, 'UTF-8');
$image = htmlspecialchars($item['image'] ?? '', ENT_QUOTES, 'UTF-8');
$desc = htmlspecialchars($item['desc'] ?? '', ENT_QUOTES, 'UTF-8');
$fullDesc = htmlspecialchars($item['fullDesc'] ?? '', ENT_QUOTES, 'UTF-8');

$related = $item['relatedWith'] ?? [];
$addDate = htmlspecialchars($item['addDate'] ?? '', ENT_QUOTES, 'UTF-8');
?>

<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <meta name="theme-color" content="#8B5CF6">

    <title><?= $name ?></title>

    <link rel="icon" href="fav2.ico" type="image/x-icon">
    <link rel="stylesheet" href="style.css">
</head>

<body class="body-center">

<nav>
    <a href="fandoms.html">FANDOMS</a>
    <a href="characters.html">CHARACTERS</a>
    <a href="about.html">ABOUT</a>
    <a href="quiz.html">QUIZ</a>
    <a href="report.html">
        <img class="some" src="report.webp" alt="Службова картинка">
    </a>
</nav>

<main class="white">
    <h1><?= $name ?></h1>

    <?php if ($image): ?>
        <img src="<?= $image ?>" alt="<?= $name ?>">
    <?php endif; ?>

    <p><?= $desc ?></p>

    <section>
        <h2>Детальний опис</h2>
        <div>
            <?= nl2br($fullDesc) ?>
        </div>
    </section>

    <?php if (!empty($related)): ?>
        <section>
            <h2>Пов'язано з</h2>

            <ul>
                <?php foreach ($related as $entry): ?>
                    <li>
                        <?= htmlspecialchars($entry, ENT_QUOTES, 'UTF-8') ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>
    <?php endif; ?>
</main>

</body>
</html>