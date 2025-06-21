<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение почты | Hospital</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header img {
            max-width: 150px;
            margin-bottom: 10px;
        }

        .content {
            padding: 20px;
        }

        .btn-confirm {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }

        .btn-confirm:hover {
            background-color: #0056b3;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <svg stroke="currentColor" fill="0000FF" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z"></path></svg>
        <h1>Добро пожаловать в Hospital!</h1>
    </div>

    <div class="content">
        <p>Здравствуйте!</p>
        <p>Спасибо за регистрацию в Hospital. Для завершения регистрации и активации вашей учетной записи, пожалуйста, нажмите кнопку ниже:</p>

        <form action="">
            <a href="{{ $verificationUrl }}" class="btn-confirm">Подтвердить почту</a>
        </form>

        <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
    </div>

    <div class="footer">
        <p>&copy; 2023 Hospital. Все права защищены.</p>
        <p>Это автоматическое сообщение. Пожалуйста, не отвечайте на него.</p>
    </div>
</div>
</body>
</html>
