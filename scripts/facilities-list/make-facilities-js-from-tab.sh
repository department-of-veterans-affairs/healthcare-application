#!/bin/bash

file="PreferredFacilities.txt"

awk -v showFieldNames=1 -f make-facilities-js-from-tab.awk $file > FieldNames.txt

awk -v captureNeededFields=1 -f make-facilities-js-from-tab.awk $file | sort > SortedFacilityList.txt

awk -v makeFacilitiesJson=1 -f make-facilities-js-from-tab.awk SortedFacilityList.txt > FacilityList.js
