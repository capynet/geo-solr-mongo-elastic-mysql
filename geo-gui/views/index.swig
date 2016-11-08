{% extends 'layout.swig' %}

{% block title %}Mapa{% endblock %}
{% block content %}
<div id="info">

</div>

<div id="mapa"></div>

<div id="engine-selection">
    <label>
        <input type="radio" value="mongo" name="engine" checked>
        Mongo
    </label>

    <label>
        <input type="radio" value="solr" name="engine">
        Solr
    </label>

    <label>
        <input type="radio" value="elastic" name="engine">
        Elastic
    </label>
</div>
{% endblock %}