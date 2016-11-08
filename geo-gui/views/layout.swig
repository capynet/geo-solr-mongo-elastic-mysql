<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{% block title %}{% endblock %}</title>

    {% block head %}
        <link rel="stylesheet" href="css/style.css">
    {% endblock %}
</head>

<body>
{% block content %}{% endblock %}
<script src="vendor/jquery-2.1.4.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=places"></script>
<script src="js/map.js"></script>
<script src="js/logger.js"></script>
<script src="js/main.js"></script>
</body>
</html>