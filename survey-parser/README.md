# Survey Parser
Tool to parse an odkx formdef.json file and corresponding data entries,
and determine which questions were from the form (and in which section), 
and whether they were answered.

Used to generate a section summary of the form:
```
"section1": {
    "missing": {},
    "responses": {
      "f2_visit_date": "2019-06-19",
      "f2_interviewer_id": "024",
      "f2_woman_addr": "Gigimar",
      "f2_location_from": "2",
      "f2_mode_of_transport_1_4": "[\"1\"]",
      "f2_travel_duration": "3",
      "section1_complete": "true"
    },
    "skipped": {
      "f2a_sum_visit1_date": true,
      "f2_ke_health_facility": true,
      "f2_ke_county": true,
      "f2_2_system_datetime": true
    }
  },
  "section2": {
    "missing": {},
    "responses": {
      "f3_year_of_birth": "1983.0000000000",
      "f3_month_of_birth": "6",
      "f3_religion": "1",
      "f3_highest_school_level": "1",
      "f3_occupation": "6",
      "f3_live_with_alone": "0",
      "f3_live_with_partner": "1",
      "f3_live_with_parents": "0",
      "f3_live_with_in_law": "1",
      "f3_live_with_relatives": "1",
      "f3_live_with_friends": "0",
      "f3_live_with_children": "1",
      "f3_live_with_other_children": "1",
      "f3_live_with_other": "0",
      "f3_number_of_people_live_with": "5",
      "f3_marital_status": "3",
      "f3_duration_of_living_together": "21",
      "section2_complete": "true"
    },
    "skipped": {
      "f3_interviewer_id": true,
      "f3_ethnicity_ke": true,
      "f3_3_system_datetime": true
    }
  }
}
```
Where a `missing` field is one that is marked as required but not answered, and `skipped` simply not answered.