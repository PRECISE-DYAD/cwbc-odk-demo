/********************************************************************************
 * Constants
 ********************************************************************************/

import { IODkTableRowData } from "src/app/modules/shared/types/odk.types";

// some fields used in profile form views and search
// _guid used to uniquely identify participant across all forms
export const PARTICIPANT_SUMMARY_FIELDS = [
  "_savepoint_timestamp",
  "f2_guid",
  "f2a_participant_id",
  "f2a_national_id",
  "f2a_hdss",
  "f2a_phone_number",
  "f2a_full_name",
] as const;

// list of some fields from screening form used to merge with participant registration
export const PARTICIPANT_SCREENING_FIELDS = [
  "f0_0_userID",
  "f0_age",
  "f0_cohort_consented",
  "f0_cohort_existing",
  "f0_consent_status",
  "f0_eligible_cohort",
  "f0_guid",
  "f0_ineligible_continue",
  "f0_precise_id",
  "f0_screen_date",
  "f0_screening_id",
  "f1_1_userID",
  "f1_age",
  "f1_consent_status",
  "f1_screen_date",
] as const;

/********************************************************************************
 * Types
 ********************************************************************************/
// create a type from the list of fields above
type IParticipantSummaryField = typeof PARTICIPANT_SUMMARY_FIELDS[number];
type IParticipantScreeningField = typeof PARTICIPANT_SCREENING_FIELDS[number];

// placeholder interface to reflect all fields available within participant table and ODK meta
export type IParticipant = IODkTableRowData &
  {
    [K in IParticipantSummaryField]: string;
  };

export type IParticipantScreening = IODkTableRowData &
  {
    [K in IParticipantScreeningField]: string;
  };

// summary contains partial participant
export type IParticipantSummary = Partial<IParticipant>;

// hashmap to provide quick lookup of participant by participant id
// tslint:disable interface-over-type-literal
export type IParticipantsHashmap = { [f2_guid: string]: IParticipant };
