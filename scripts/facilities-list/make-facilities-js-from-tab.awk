BEGIN {
  FS="\t"; # use tabs as field separator
  OFS="\t";

  #if (showFieldNames == 1 || captureNeededFields == 1) {
  #  RS="\r"; # Mac Excel uses \r as a line delimiter
  #  ORS="\n" # We want Unix \n line delimiter output
  #}

  if (makeFacilitiesJson) {
    # print header
    print "const vaMedicalFacilities = {";
  }

  # field numbers learned from running this script with showFieldNames set to 1 
  NAME = 4;
  STATIONNUMBER = 5;
  STREETSTATE_ID = 13;
  POSTALNAME = 36;
}

showFieldNames == 1 {
  for (i=1; i<=NF; i++) {
    printf("# $%s %s\n", i, $i);
  }
  exit;
}

# get unsorted records with needed fields
# only use the record if it has 36 fields (includes state)
captureNeededFields == 1 && NF == POSTALNAME {
  gsub("\"", "", $NAME); # get rid of random double quotes in source
  gsub("'", "\\'", $NAME); # quote single quotes
  if ($NAME !~ /^ZZ.*/) { # only include records w/o ZZ at start of name:q
    print $POSTALNAME, $STATIONNUMBER, $NAME;
  }
}

makeFacilitiesJson == 1 {
  # this section uses the sorted output which has field order of
  # $1 state abbreviation
  # $2 station numbers
  # $3 facility name
  if (lastStateAbbr != $1) {
    if (lastStateAbbr != "") {
      print "  ],"
    }
    printf("  %s: [\n", $1);
  }
  printf("    { value: '%s', label: '%s' },\n", $2, $3);
  lastStateAbbr = $1;
}

END {
  if (makeFacilitiesJson) {
    # print footer
    print "  ],"
    print "};"
  }
}
