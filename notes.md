
Map: Equirectangular Projection (x  = lon y = lat)

# Proposed data structure in firebase:

* `sesssions`/
  * sessionName1…
  * sessionNameN
    * `dataFormat` (semver string)
    * `activity`
    * `activities`
      * activityName1 …
      * activityNameN
        * `frameNumber`
        * `settings`
          * `baseMap` (pulldown includes none &baseMapRef)
          * `showTemp`
          * `showColor`
          * `showStationTemps`
          * `showPredictions`
          * `simluationLength` (in seconds)
        * `mapSettings`
          * `classGrid`
            * `columns`
            * `rows`
          * `displayGrid`
            * `columns`
            * `rows`
          * `baseMaps`
            * imageName1 …
            * imageNameN
              * `url`
        * `frames`
          * frameNumber1 …
          * frameNumberN
            * `geoJson` (includes all station locations + station data & timestamp) -- can be serialized string...
      * `presence`
        * uuId1...
        * uuIdN
          * `name`
          * `location`
            * `row`
            * `column`



weather.csv → geoJSON → grid data …

