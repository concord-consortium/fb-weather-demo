
Equirectangular Projection (x  = lon y = lat)


# Proposed data structure in firebase:

* `sesssions`/
  * <sessionName1>…
  * <sessionNameN>
    * <version1>…
    * <versionN>
      * `activities`
        * <activityName1> …
        * <activityNameN>
          * `frameNumber`
          * `settings`
            * `baseMap` (pulldown includes none)
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
            * `backgroundImages`
              * <imageName1> …
              * <imageNameN>
                * `url`
          * `frames`
            * <frameNumber1> …
            * <frameNumberN>
              * `geoJson` (includes all station locations + station data & timestamp)
        * `presence`
          * <uuId1>...
          * <uuIdN>
            * `name`
            * `location`
              * `row`
              * `column`
