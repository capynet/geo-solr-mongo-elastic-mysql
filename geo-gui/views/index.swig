{% extends 'layout.swig' %}

{% block title %}Mapa{% endblock %}
{% block content %}
    <label>
        Ubicación
        <input type="text" id="buscador" name="buscador">
    </label>

    <div id="mapa"></div>
{% endblock %}