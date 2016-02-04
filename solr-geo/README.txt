NOTES:
schema.xml must have this field added:
 <field name="coordinates" type="location" indexed="true" stored="true" />

 And check this field exist:
 <!-- A specialized field for geospatial search. If indexed, this fieldType must not be multivalued. -->
 <fieldType name="location" class="solr.LatLonType" subFieldSuffix="_coordinate"/>