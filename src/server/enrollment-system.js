const _ = require('lodash');
const validations = require('./utils/validations');
//
// The Comments starting with "// *" that look like a bad CSV dump are copy-pasta-ed out the VOA
// requirements documentation from the ES team. It's not authoritative for the field name and
// message structure. Instead, look at /hca-api-stub/voa-voaSvc-xsd-2.xml for the
// <xs:element name="form"> definition. It is mostly composed of the eeSummary:eeSummary type
// which is defined in hca-api-stub/voa-voaSvc-xsd-1.xml. This is linked off the WSDL for the
// ES VOA SOAP endpoint and is therefore authoritative for the field structure and basic validations.
//

// Static for content for the 1010EZ.
const formTemplate = {
  form: {
    //  * form / formIdentifier / type, Not Applicable, Yes, "Data element is not a form captured element but provides the type of form submitted  (e.g., . 1010EZ)"
    formIdentifier: {
      type: '100',
      value: '1010EZ'
    },
    //  * identity / authenticationLevel / type, Not Applicable, No, Data element is not a form captured element but provides the  level of the Veterans' authentication.
    //  * identity / veteranIdentifier / type, Not Applicable, Yes, "Data element is not a form captured element but provides the Veteran Identifer type (e.g,  EDIPI)"
    //  * identity / veteranIdentifier / value, Not Applicable, Yes, "Data element is not a form captured element but provides the Veteran unique Identifer (e.g,  EDIPI)"
  },
  identity: {
    authenticationLevel: {
      type: '100',
      value: 'anonymous'
    }
  }
};

/**
 * Converts maritalStatus from the values in the Veteran resource to the VHA Standard Data Service code.
 *
 * maritalStatus comes from client/utils/options-for-select.js:maritalStatus.
 *
 * Codes are from the VHA Standard Data Service (ADRDEV01) HL7 24 Marital Status Map List.
 *
 * @param {String} maritalStatus (eg, 'Married', 'Never Married', etc.)
 * @returns {String} VHA SDS code (eg, 'M', 'S', etc.)
 */
// TODO(awong): Move to validations and add unittests.
function maritalStatusToSDSCode(maritalStatus) {
  switch (maritalStatus) {
    case 'Married':
      return 'M';
    case 'Never Married':
      return 'S';
    case 'Separated':
      return 'A';
    case 'Widowed':
      return 'W';
    case 'Divorced':
      return 'D';
    default:
      return 'U';
  }
}

/**
 * Converts yesNo options to the VHA Standard Data Service code.
 *
 * yesNo values come from client/utils/options-for-select.js:yesNo.
 *
 * ES Service booleans expect the strings 'true' or 'false'.
 *
 * @param {String} A value from the yesNo property.
 * @returns {String} 'true', 'false', or ''.
 */
// TODO(awong): Move to validations and add unittests.
function yesNoToESBoolean(yesNo) {
  switch (yesNo) {
    case 'Y':
      return 'true';
    case 'N':
      return 'false';
    default:
      // TODO(awong): What to do here?
      return '';
  }
}

// TODO(awong): Move to validations and add unittests.
function zeroPadNumber(number, padding) {
  return (new Array(padding + 1).join('0') + number).slice(-padding);
}

// TODO(awong): Move to validations and add unittests.
function formDateToESDate(dateObject) {
  if (dateObject.month >= 1 && dateObject.month <= 12 &&
    dateObject.day >= 1 && dateObject.month <= 31 && // TODO: how robust does this need to be? Form validates as well.
    dateObject.year > 1) {
    return `${zeroPadNumber(dateObject.month, 2)}/${zeroPadNumber(dateObject.day, 2)}/${zeroPadNumber(dateObject.year, 4)}`;
  }
  return undefined;
}

//  * personInfo / dob, mm/dd/yyyy; cannot be in the future, Yes, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / firstName, alphanumeric (1-30), Yes, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / gender, drop-down, Yes, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / lastName, alphanumeric (1-30), Yes, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / middleName, alphanumeric (1-30), No, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / mothersMaidenName, alphanumeric 2-35 characters, No, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / placeOfBirthCity, alphanumeric 2-20, No, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / placeOfBirthState, drop-down, No, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / ssnText,  must be 9 digits, Yes, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * personInfo / suffix, drop-down, No, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source).  Suffix is not asked for on the FEB 2011 Form version"
//  * personInfo/dob, Cannot be a Null value, ,
//  * personInfo/dob, Date format mm/dd/yyyy, ,
//  * personInfo/dob, Future date value, ,
//  * personInfo/firstName, Cannot be a Null value, ,
//  * personInfo/gender, Cannot be a Null value, ,
//  * personInfo/gender, Not a valid reference value, ,
//  * personInfo/lastName, Cannot be a Null value, ,
//  * personInfo/middleName, Null allowed; if not null then value must be alphanumeric from 1- 30 characters in length, ,
//  * personInfo/mothersMaidenName, Null allowed; alphanumeric from 1- 35 characters in length, ,
//  * personInfo/placeOfBirthCity, Null allowed;  if not null then value must be alphanumeric from 1- 20 characters in length, ,
//  * personInfo/placeOfBirthState, "Null allowed;  Not a valid reference value", ,
//  * personInfo/ssnText, Cannot be a Null value, ,
//  * personInfo/ssnText, Value not 9 digits and contains a non number., ,
function veteranToPersonInfo(veteran) {
  return {
    dob: validations.dateOfBirth(veteran.veteranDateOfBirth),
    firstName: validations.validateString(veteran.veteranFullName.first, 30),
    gender: veteran.gender,
    lastName: validations.validateString(veteran.veteranFullName.last, 30),
    middleName: validations.validateString(veteran.veteranFullName.middle, 30, true),
    mothersMaidenName: validations.validateString(veteran.mothersMaidenName, 35, true),
    placeOfBirthCity: validations.validateString(veteran.cityOfBirth, 20, true),
    placeOfBirthState: veteran.stateOfBirth, // todo(robbie) need to do this validation.
    ssnText: validations.validateSsn(veteran.veteranSocialSecurityNumber),
    suffix: veteran.veteranFullName.suffix,
  };
}

function makeServiceBranch(serviceBranch) {
  // NOTE the return codes are from VHA Standard Data Service (ADRDEV01) Service Branch List
  // http://vaausesrapp80.aac.va.gov:7404/ds/List/ServiceBranch
  switch (serviceBranch) {
    case 'army':
      return 1;
    case 'air force':
      return 2;
    case 'navy':
      return 3;
    case 'marine corps':
      return 4;
    case 'coast guard':
      return 5;
    case 'merchant seaman':
      return 7;
    case 'noaa':
      return 10;
    case 'usphs':
      return 9;
    case 'f.commonwealth':
      return 11;
    case 'f.guerilla':
      return 12;
    case 'f.scouts new':
      return 13;
    case 'f.scouts old':
      return 14;
    default:
      return 6; // OTHER
  }
}

function makeDischargeType(dischargeType) {
  // NOTE these codes are from VHA Standard Data Service (ADRDEV01) Service Discharge Code List
  // http://vaausesrapp80.aac.va.gov:7404/ds/List/ServiceDischargeCode
  switch (dischargeType) {
    case 'honorable':
      return 1;
    case 'general':
      return 3;
    case 'bad-conduct':
      return 6;
    case 'dishonorable':
      return 2;
    case 'undesirable':
      return 5;
    default:
      return '4'; // OTHER-THAN-HONORABLE
  }
}

//  * militaryServiceInfo / disabilityRetirementIndicator, Not applicable, Not applicable, This question has been dropped from VOA.
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / dischargeType, drop-down, Yes,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / dischargeType, Cannot be a Null value, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / dischargeType, Not a valid reference value, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / startDate, mm/dd/yyyy, month & year required,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / startDate, Cannot be a Null value, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / startDate, Check for format mm/yyyy or mm/dd/yyyy and cannot be a future date, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / endDate, mm/dd/yyyy, month & year required,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / endDate, Cannot be a Null value, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / endDate, Check for format mm/yyyy or mm/dd/yyyy and cannot be a future date, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / serviceBranch, drop-down, Yes,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / serviceBranch, Cannot be a Null value, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / serviceBranch, Not a valid reference value, ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / serviceNumber, "Null value is allowed;  Only numbers are allowed if value is present - must be 1 to 10 digits in length", ,
//  * militaryServiceInfo / militaryServiceSiteRecordCollection / militaryServiceEpisodeCollection / militaryServiceEpisodeInfo / serviceNumber, 1 to 15 digits, No,
function veteranToMilitaryServiceInfo(veteran) {
  return {
    militaryServiceSiteRecords: {
      militaryServiceSiteRecord: {
        militaryServiceEpisodes: {
          militaryServiceEpisode: {
            dischargeType: makeDischargeType(veteran.dischargeType),
            startDate: formDateToESDate(veteran.lastEntryDate),
            endDate: formDateToESDate(veteran.lastDischargeDate),
            serviceBranch: makeServiceBranch(veteran.lastServiceBranch),
          }
        },
        site: '565GC',  // FIX
      }
    }
  };
}

//  * InsuranceInfo / insuranceMappingTypeName , , , Identifies the insurance record as either Prrvate or Medicare.
//  * "insuranceCollection / InsuranceInfo / groupNumber", alphanumeric (1-30), "Policy Number or  Group Code Required", Required only if vet is covered by insurance.
//  * insuranceCollection / InsuranceInfo / companyName, alphanumeric (1-30), Yes, "Required only if vet is covered by insurance.   VOA will need to accommodate one to 5 multiple Insurance data  (for each:   name,  address,  city,  state,  zip,  phone,  name of policy holder,  policy number,  group code.)      "
//  * insuranceCollection / insuranceInfo / enrolledInPartA, Checkbox, Yes,
//  * insuranceCollection / insuranceInfo / enrolledInPartB, Checkbox, Yes,
//  * insuranceCollection / InsuranceInfo / insaddress / addressInfo / addressTypeCode, Not applicable, No, Data element is not a form captured element but provides the address type for the Veteren's Insurance Company.
//  * insuranceCollection / InsuranceInfo / insaddress / addressInfo / city, alphanumeric (2-25), No,
//  * insuranceCollection / InsuranceInfo / insaddress / addressInfo / country, drop-down, No,
//  * insuranceCollection / InsuranceInfo / insaddress / addressInfo / line1, alphanumeric (3-35), No,
//  * "insuranceCollection / InsuranceInfo / insaddress / addressInfo / state  (if country is USA) insuranceCollection / InsuranceInfo / insaddress / addressInfo /  provinceCode (if country is not USA)", drop-down, No,
//  * "insuranceCollection / InsuranceInfo / insaddress / addressInfo / zipCode  (if country = USA) insuranceCollection / InsuranceInfo / insaddress / addressInfo /  postalCode  (if country is not USA)", "alphanumeric: 99999", No,
//  * insuranceCollection / InsuranceInfo / insaddress / addressInfo / zipPlus4, "alphanumeric: 9999", No,
//  * "insuranceCollection / InsuranceInfo / insurancePhones / phoneCollection / phoneInfo / phoneNumber ", (999) 999-9999, No,
//  * insuranceCollection / InsuranceInfo / insurancePhones / phoneCollection / phoneInfo / type, Not applicable, No, Data element is not a form captured element but provides the phone type value for the Veterans's Insurance company.
//  * insuranceCollection / insuranceInfo / partaEffectiveDate, mm/dd/yyyy; cannot be in the future, Req. if Yes, "Required only if enrolled in Part a.   This is the effective date for enrollment in medicare insurance Part a"
//  * insuranceCollection / insuranceInfo / partBEffectiveDate, mm/dd/yyyy; cannot be in the future, Req. if Yes, "Required only if enrolled in Part a.   This is the effective date for enrollment in medicare insurance Part B"
//  * insuranceCollection / InsuranceInfo / policyHolderName, alphanumeric (1-30), Yes, Required only if vet is covered by insurance.
//  * insuranceCollection / InsuranceInfo / policyNumber, alphanumeric (1-30), "Policy Number or  Group Code Required", Required only if vet is covered by insurance.
//  * insuranceCollection / insuranceInfo / policyNumber, alphanumeric (1-60), Req if Part a or Part B is Yes, Required only if enrolled in medicare
//  * insuranceCollection / insuranceInfo / subscriber , alphanumeric (1-30), Req if Part a or Part B is Yes, Required only if enrolled in medicare
//  * insuranceCollection/insuranceInfo/companyName, Cannot be null if Health Insurance information is received for Private Insurance, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/enrolledInPartA, Cannot be a Null value, "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * insuranceCollection/insuranceInfo/enrolledInPartB, Cannot be a Null value, "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * insuranceCollection/insuranceInfo/enrolledInPartB, "The Veteran cannot set Medicare Part B enrollment to ""Yes""  without setting Medicare Part A enrollment as ""Yes"".", "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * insuranceCollection/insuranceInfo/insaddress/addressInfo/city, Null allowed;  if not null then value must be must be an alphanumeric from 1 -25 characters in length, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/insaddress/addressInfo/country, Cannot be a Null value, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/insaddress/addressInfo/country, Not a valid reference value, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/insaddress/addressInfo/line1, Null allowed;  if not null then value must be must be an alphanumeric from 1 -35 characters in length, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * "insuranceCollection/insuranceInfo/insAddress/addressInfo/state or insuranceCollection/insuranceInfo/insAddress/addressInfo/provinceCode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/insAddress/addressInfo/zipCode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/insAddress/addressInfo/zipPlus4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/insurancePhones/phoneCollection/phoneNumber, only numbers allowed and must by 10 digits, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/partAEffectiveDate, Required if enrolled in Medicare Insurance Part A, "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * insuranceCollection/insuranceInfo/partAEffectiveDate, Date format mm/dd/yyyy and cannot be a future date, "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * insuranceCollection/insuranceInfo/partBEffectiveDate, Required if enrolled in Medicare Insurance Part B, "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * insuranceCollection/insuranceInfo/policyHolderName, Cannot be a Null value, "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/policyNumber, Required if enrolled in Medicare Part A or Part B , "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
//  * "insuranceCollection/insuranceInfo/policyNumber insuranceCollection/insuranceInfo/groupNumber", Either Policy Number and Group Code is required , "Applies when ""insuranceMappingTypeName"" = ""PI""",
//  * insuranceCollection/insuranceInfo/subscriber , Required if enrolled in Medicare Part A or Part B , "Applies when ""insuranceMappingTypeName"" = ""MDCR""",
function veteranToInsuranceCollection(veteran) {
  return {
    // FIX. This is a sequence. What does that look like?
    insurance: {
      companyName: 'Medicare',
      enrolledInPartA: veteran.isEnrolledMedicarePartA,
      enrolledInPartB: false, // FIX
      insuranceMappingTypeName: 'MDCR' // FIX
    }
  };
}

// Produces an financialsInfo compatible type from a veteran resource.
//
// <xs:complexType name="enrollmentDeterminationInfo">
//   <xs:all>
//     <xs:element name="applicationDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="calculationSource" type="xs:string" minOccurs="0"/>
//     <xs:element name="cancelDeclineInfo" type="cancelDeclineInfo" minOccurs="0"/>
//     <xs:element name="catastrophicDisabilityInfo" type="catastrophicDisabilityInfo" minOccurs="0"/>
//     <xs:element name="effectiveDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="eligibleForMedicaid" type="xs:boolean" minOccurs="0"/>
//     <xs:element name="medicaidLastModifiedDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="endDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="enrollmentDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="enrollmentStatus" type="xs:string" minOccurs="0"/>
//     <xs:element name="facilityReceived" type="xs:string" minOccurs="0"/>
//     <xs:element name="enrollmentCategoryName" type="xs:string" minOccurs="0"/>
//     <xs:element name="ineligibilityFactor" type="ineligibilityFactorInfo" minOccurs="0"/>
//     <xs:element name="militarySexualTraumaInfo" type="militarySexualTraumaInfo" minOccurs="0"/>
//     <xs:element name="monetaryBenefitAwardInfo" type="monetaryBenefitAwardInfo" minOccurs="0"/>
//     <xs:element name="noseThroatRadiumInfo" type="noseThroatRadiumInfo" minOccurs="0"/>
//     <xs:element name="otherEligibilities" type="eligibilityCollection" minOccurs="0"/>
//     <xs:element name="primaryEligibility" type="eligibilityInfo" minOccurs="0"/>
//     <xs:element name="priorityGroup" type="xs:string" minOccurs="0"/>
//     <xs:element name="prioritySubGroup" type="xs:string" minOccurs="0"/>
//     <xs:element name="secondaryEligibilities" type="eligibilityCollection" minOccurs="0"/>
//     <xs:element name="serviceConnectionAward" type="serviceConnectionAwardInfo" minOccurs="0"/>
//     <xs:element name="specialFactors" type="specialFactorsInfo" minOccurs="0"/>
//     <xs:element name="userEnrolleeSite" type="xs:string" minOccurs="0"/>
//     <xs:element name="userEnrolleeValidThrough" type="xs:int" minOccurs="0"/>
//     <xs:element name="veteran" type="xs:boolean" minOccurs="0"/>
//     <xs:element name="recordCreatedDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="recordModifiedDate" type="xs:dateTime" minOccurs="0"/>
//   </xs:all>
// </xs:complexType>
//
// @param {Object} veteran - REST resource describing the veteran.
// @returns {Object} Object matching the enrollmentDeterminationInfo schema.
//
// TODO(awong): Reconcile the spreadsheet dump below with the code and then delete from comment.
//  * enrollmentDeterminationInfo / eligibleForMedicaid                                  , checkbox, Yes,
//  * enrollmentDeterminationInfo / specialFactorsInfo / agentOrangeInd, Checkbox, No,
//  * enrollmentDeterminationInfo / specialFactorsInfo / envContaminantsInd, Checkbox, No,
//  * enrollmentDeterminationInfo / specialFactorsInfo / radiationExposureInd, Checkbox, No,
//  * enrollmentDeterminationInfo/eligibleForMedicaid                                   , Cannot be a Null value, ,
function veteranToEnrollmentDeterminationInfo(veteran) {
  return {
    eligibleForMedicaid: veteran.isMedicaidEligible,

    //  * noseThroatRadiumInfo / receivingTreatment, Checkbox, No,
    noseThroatRadiumInfo: {
      receivingTreatment: veteran.radiumTreatments,
    },

    //  * serviceConnectionawardInfo / serviceConnectedIndicator, Checkbox, No,
    serviceConnectionAward: {
      serviceConnectedIndicator: yesNoToESBoolean(veteran.isVaServiceConnected),
    },

    specialFactors: {
      agentOrangeInd: false, // FIX
      envContaminantsInd: false, // FIX
      campLejeuneInd: veteran.campLejeune,
      radiationExposureInd: veteran.exposedToRadiation,
    }
  };
}

// Produces an financialsInfo compatible type from a veteran resource.
//
// <xs:complexType name="financialsInfo">
//   <xs:all>
//     <xs:element name="beneficiaryTravels" type="beneficiaryTravelCollection" minOccurs="0"/>
//     <xs:element name="financialStatement" type="financialStatementInfo" minOccurs="0"/>
//     <xs:element name="incomeTest" type="incomeTestInfo" minOccurs="0"/>
//     <xs:element name="nonPrimaryFinancialsInfo" type="eeSummary:nonPrimaryFinancialStatementCollection" maxOccurs="1" minOccurs="0"/>
//   </xs:all>
// </xs:complexType>
//
// @param {Object} veteran - REST resource describing the veteran.
// @returns {Object} Object matching the financialsInfo schema.
//
// TODO(awong): Reconcile the spreadsheet dump below with the code and then delete from comment.
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Funeral and Burial Expenses", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Funeral and Burial Expenses", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Funeral and Burial Expenses", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Total Non-Reimbursed Medical Expenses", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Total Non-Reimbursed Medical Expenses", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Total Non-Reimbursed Medical Expenses", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Veteran's Educational Expenses", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Veteran's Educational Expenses", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / amount Expense Type=Veteran's Educational Expenses", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / expenseType, Not applicable, Yes, Data element is not a form captured element but provides the expense type to identify the value of TOTAL NONREIMBURSED MEDICAL EXPENSES PAID BY YOU OR YOUR SPOUSE
//  * financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / expenseType, Not applicable, Yes, Data element is not a form captured element but provides the expense type to identify the value of Funeral and Burial Expenses for spouse or dependent child.
//  * financialsInfo / financialsInfo / financialStatementInfo / expenseCollection / expenseInfo / expenseType, Not applicable, Yes, Data element is not a form captured element but provides the expense type to identify the value of the Veteran's Educational Expenses
//  * financialsInfo / financialStatementInfo /  contributionToSpouse, , No, "This question is not on the Feb 2011 form version,  but instead,  the following question is asked:  ""If your spouse or dependent child did not live with you last year,  did you provide support.""  (Yes/No)"
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount Asset Type = CODE_CASH", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount Asset Type = CODE_CASH", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount Asset Type = Land", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount Asset Type = Land", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount Asset Type = Other Prop", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount Asset Type = Other Prop", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount AssetType = CODE_CASH", "Dollar amounts:  0 <= 9999999.99", Yes, "This amount field must be accompanied by the income type. "
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amount AssetType = Land", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / amountAsset Type = Other Prop", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * financialsInfo / financialStatementInfo / assetCollection / assetInfo / assetType, "Dollar amounts:  0 <= 9999999.99", Yes, Data element is not a form captured element but provides the asset type to identify the market value of the Veteran's other residences and land.
//  * financialsInfo / financialStatementInfo / assetCollection / assetInfo / assetType, "Dollar amounts:  0 <= 9999999.99", Yes, Data element is not a form captured element but provides the asset type to identify the Veteran's Other assets and property.
//  * "financialsInfo / financialStatementInfo / assetCollection / assetInfo / assetType ", Not applicable, Yes, Data element is not a form captured element but provides the asset type to identify the value of the Veteran's Cash and amount in bank accounts.
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount Asset Type = CODE_CASH", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount Asset Type = CODE_CASH", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount Asset Type = Land", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount Asset Type = Land", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount Asset Type = Other Prop", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount Asset Type = Other Prop", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount AssetType = CODE_CASH", "Dollar amounts:  0 <= 9999999.99", Req if child entered, "A value is needed for each child from the dependent screen.  This amount field must be accompanied by the income type. "
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount AssetType = Land", "Dollar amounts:  0 <= 9999999.99", Req if child entered, "A value is needed for each child from the dependent screen.  This amount field must be accompanied by the income type."
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / amount AssetType = Other Prop", "Dollar amounts:  0 <= 9999999.99", Req if child entered, "A value is needed for each child from the dependent screen.  This amount field must be accompanied by the income type."
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / assetType, Not applicable, Yes, Data element is not a form captured element but provides the asset type to identify the value of the Child's Cash and amount in bank accounts.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / assetType, "Dollar amounts:  0 <= 9999999.99", Yes, Data element is not a form captured element but provides the asset type to identify the market value of the Child's other residences and land.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / assetCollection / assetInfo / assetType, "Dollar amounts:  0 <= 9999999.99", Yes, Data element is not a form captured element but provides the asset type to identify the Child's Other assets and property.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / amountContributedToSupport, "Dollar amounts:  0 <= 9999999.99", No,
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / attendedSchool, Checkbox, No,
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / familyName, alphanumeric (1-30), Required if child is entered, "Required only if vet has a child.  VOA will need to accommodate one or multiple dependents  (for each:   first,  last,  middle,  suffix,  relationship,  SSN,  Date of Birth,  WaS CHILD PERMaNENTLY aND TOTaLLY DISaBLED BEFORE THE aGE OF 18,  IF CHILD IS BETWEEN 18 aND 23 YEaRS OF aGE,  DID CHILD aTTEND SCHOOL LaST CaLENDaR YEaR?,  DID YOUR CHILD LIVE WITH YOU LaST YEaR?,  EXPENSES PaID BY YOUR DEPENDENT CHILD FOR COLLEGE,  VOCaTIONaL REHaBILITaTION OR TRaINING).       Question: Is there a limit to the number of dependents that can be entered? "
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / givenName, alphanumeric (1-30), Required if child is entered, Required only if vet has a child.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / middleName, alphanumeric (1-30), No,
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / relationship, checkbox, Required if child is entered, Required only if vet has a child.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / ssns / ssn, 999-99-9999, Required if child is entered, Required only if vet has a child.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / startDate, "mm/dd/yyyy Date,  cannot be in the future. Date Child Became Your Dependent cannot be before Child's Date of Birth ", "Required if child is entered Only Year is Req", Required only if vet has a child.
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / expenseInfo / amount Type=Child's Educational Expenses", "Dollar amounts:  0 <= 9999999.99", No,
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / expenseInfo / expenseType, , No,
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incapableOfSelfSupport , Checkbox, Required if child is entered, Required only if vet has a child.
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / livedWithPatient, Checkbox, Required if child is entered, "This question is not on the Feb 2011 form version,  but instead,  the following question is asked:  ""If your spouse or dependent child did not live with you last year,  did you provide support.""  (Yes/No)"
//  * financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / relationInfo / suffix, drop-down, No, Suffix is not asked for on the FEB 2011 Form version
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount IncomeType=Net Income from Farm,   Ranch,  Property,  Business", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount IncomeType=Net Income from Farm,   Ranch,  Property,  Business", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount IncomeType=Net Income from Farm,   Ranch,  Property,  Business", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount IncomeType=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount IncomeType=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount IncomeType=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount Type=Total Employment Income (Wages,   Bonuses,  Tips)", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / amount Type=Total Employment Income (Wages,   Bonuses,  Tips)", "Dollar amounts:  0 <= 9999999.99", Yes, This amount field must be accompanied by the income type.
//  * financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, "Data element is not a form captured element but provides the income type to identify the value as the Veteran's gross income from FARM,  RANCH,  PROPERTY OR BUSINESS."
//  * financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, "Data element is not a form captured element but provides the income type to identify the value as the Veteran's other income (from Soc Sec.,   Compensation,  Pension,  Interest,   Divididends)"
//  * "financialsInfo / financialStatementInfo / incomeCollection / incomeInfo / type ", Not applicable, Yes, Data element is not a form captured element but provides the income type to identify the value as the Veteran's gross income from employment.
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount Asset Type = CODE_CASH", Cannot be a Null value if spouse is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount Asset Type = CODE_CASH", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount Asset Type = Land", Cannot be a Null value if spouse is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount Asset Type = Land", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount Asset Type = Other Prop", Cannot be a Null value if spouse is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount Asset Type = Other Prop", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount AssetType = CODE_CASH", "Dollar amounts:  0 <= 9999999.99", "Req if Marr/Sep,  or any 3 spouse questions answered on this Panel", This amount field must be accompanied by the income type.
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount AssetType = Land", "Dollar amounts:  0 <= 9999999.99", "Req if Marr/Sep,  or any 3 spouse questions answered on this Panel", This amount field must be accompanied by the income type.
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / amount AssetType = Other Prop", "Dollar amounts:  0 <= 9999999.99", "Req if Marr/Sep,  or any 3 spouse questions answered on this Panel", This amount field must be accompanied by the income type.
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / assetType, Not applicable, Yes, Data element is not a form captured element but provides the asset type to identify the value of the Spouse's Cash and amount in bank accounts.
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / assetType, "Dollar amounts:  0 <= 9999999.99", Yes, Data element is not a form captured element but provides the asset type to identify the market value of the Spouse's other residences and land.
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / assetCollection / assetInfo / assetType, "Dollar amounts:  0 <= 9999999.99", Yes, Data element is not a form captured element but provides the asset type to identify the Spouse's Other assets and property.
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amount IncomeType=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", Cannot be a Null value if spouse is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amount IncomeType=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amount IncomeType=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", "Dollar amounts:  0 <= 9999999.99", "Req if Marr/Sep,  or any 3 spouse questions answered on this Panel", This amount field must be accompanied by the income type.
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, "Data element is not a form captured element but provides the income type to identify the value as the Spouse's other income (from Soc Sec.,   Compensation,  Pension,  Interest,   Divididends)"
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / livedWithPatient, , No,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / addressTypeCode, Not applicable, Req. if employed, Data element is not a form captured element but provides the address type for the Spouse's permanent address.
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / city, alphanumeric (1-30), Req if Spouse Entered,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / country, , Req if Spouse Entered,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / line1, alphanumeric (1-30), Req if Spouse Entered, "On the FEB 2011 Form,  this is ""Street"""
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / phoneNumber, (999) 999-9999, No,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / state  (if country is USA) financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / provinceCode (if country is not USA)", drop-down, Req if Spouse Entered,
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / zipCode  (if country is USA) financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / postalCode (if country is not USA)", "alphanumeric 1-50 99999", Req if Spouse Entered,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / addressInfo / zipPlus4, "alphanumeric 1-50 9999", No,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / dob, mm/dd/yyyy, "Req if Marr/Sep,  or spouse entered.",
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / addressTypeCode ", Not applicable, Req. if employed, Data element is not a form captured element but provides the address type for the Spouse's Employer.
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / city, alphanumeric (1-30), Req. if employed or retired, Required only in the vet is married and the spouse is employed
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / country, drop-down, Req. if employed or retired, Required only in the vet is married and the spouse is employed
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / line1, alphanumeric (1-30), Req. if employed, Required only in the vet is married and the spouse is employed
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / state (if country is USA) financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo /  provinceCode (if country is not USA)", drop-down, Req. if employed or retired, Required only in the vet is married and the spouse is employed
//  * "financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / zipcode (if country is USA) financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo /  postalCode (if country is not USA)", "alphanumeric:  9998", Req. if employed, Required only in the vet is married and the spouse is employed
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / addressInfo / zipPlus4, "alphanumeric:  9999", No, No
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / employerName, alphanumeric (1-30), Req. if employed or retired, Required only in the vet is married and the spouse is employed
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / employmentInfo / employerPhone, (999) 999-9999, No,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / familyName, alphanumeric (1-30), Req if Marr/Sep,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / givenName, alphanumeric (1-30), "Req if Marr/Sep,  or spouse entered.",
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / maidenName, alphanumeric (1-30), No,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / middleName, alphanumeric (1-30), No,
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / ssns / ssn / type, , , This element is not a form element but provides the ssn type = spouse
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / ssns / ssnText, 999-99-9999, "Req if Marr/Sep,  or spouse entered.",
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseinfo / startDate, mm/dd/yyyy, "Yr required if Marr/Sep,  or spouse entered.",
//  * financialsInfo / financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / spouseInfo / suffix, drop-down, No, Suffix is not asked for on the FEB 2011 Form version
//  * financialsInfo / financialStatementInfo / spouseFinancialsInfo / spouseInfo / employmentInfo / employmentStatus, drop-down, Req if Marr/Sep,
//  * financialsInfo / financialStatementInfo / spouseFinancialsInfo / spouseInfo / employmentInfo / retirementDate, mm/dd/yyyy, "If Retired,  Yr is required",
//  * financialsInfo / incomeTestInfo / discloseFinancialInformation, Checkbox, Yes, This is a Yes/No question.
//  * financialsInfo/financialStatementInfo/contributionToSpouse, null allowed; value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/dob, Check for ate format mm/dd/yyyy, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/dob, Future date value, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/familyName, Required if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/familyName, Value must be must be an alphanumeric from 1 -30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/givenName, Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/givenName, Value must be must be an alphanumeric from 1 -30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/middleName, Null allowed;  if not null then value must be must be an alphanumeric from 1 - 30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/relationship, Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/relationship, Not a valid reference value, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/ssns/ssn, Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/ssns/ssn, Value not 9 digits and contains a non number., Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/expenseInfo/amount Type=Child's Educational Expenses", null allowed; value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/incapableOfSelfSupport , Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/incomes/income/amount Type=IncomeType.INCOME_TYPE_TOTAL_INCOME_FROM_EMPLOYMENT", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/livedWithPatient, Null value, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/city, Required if spouse is entered;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/Country, Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/Country, Not a valid reference value, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/line1, Required if spouse is entered;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/phoneNumber, "Null allowed; when a value is present,  only numbers allowed and must be 10 digits", Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/state or financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/provinceCode", "If country is USA,  state cannot be a null value.  If country is Canada or Mexico,  provinceCode cannot be a null value.", Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/state or financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/provinceCode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/zipCode, "If country is USA,  cannot be a Null value.", Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/zipCode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/addressInfo/zipPlus4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/dob, Cannot be a Null value if Veteran is married or separated, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/dob, Date format mm/dd/yyyy and cannot be a future date, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/city, Required if spouse is employed, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/city, Null allowed;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/country, Required if spouse is employed, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/country, Not a valid reference value, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/line1, Required is spouse is employed, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/line1, Null allowed;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, ,
//  * "financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/state or financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/provinceCode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", ,
//  * "financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/state or financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/provinceCode", "Required is spouse is employed and spouse employer country is USA,  Canada,  or Mexico.", ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/zipcode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/zipcode, Cannot be a Null value if country is USA., ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/addressInfo/zipPlus4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/employerName, "In the spouse is employed,  this field is required. ", ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/employerName, Null allowed;  if not null then value must be must be an alphanumeric from 1 -30 characters in length if value is not null, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/employmentInfo/employerPhone, "Null value is allowed;  Only numbers are allowed if value is present - must be 10 digit number minimum,  plus 0 to 5 digits for extension", ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/familyName, Required if Veteran is married or separated, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/familyName, Value must be must be an alphanumeric from 1 -30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/givenName, Required if Veteran is married or separated, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/givenName, Value must be must be an alphanumeric from 1 -30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/maidenName, Null allowed;  if not null then value must be must be an alphanumeric from 1 - 30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/middleName, Null allowed;  if not null then value must be must be an alphanumeric from 1 - 30 characters in length, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/ssns/ssn, Cannot be a Null value if Veteran is married or separated, Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseInfo/ssns/ssn, Value not 9 digits and contains a non number., Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsCollection/spouseFinancialsInfo/spouseinfo/startDate, "Null allowed; If a value exists,  check for format yyyy or mm/dd/yyyy and cannot be a future date", Required only if Veteran indicates they will will provide financial information,
//  * financialsInfo/financialStatementInfo/spouseFinancialsInfo/spouseInfo/employmentInfo/employmentStatus, Required if Veteran is married or separated, ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsInfo/spouseInfo/employmentInfo/retirementDate, "Required if Veteran is married or separated and spouse is Retired,  at least the year is required; ", ,
//  * financialsInfo/financialStatementInfo/spouseFinancialsInfo/spouseInfo/employmentInfo/retirementDate, Check for format yyyy or mm/dd/yyyy and cannot be a future date, ,
//  * "financialsInfo / financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / dependentInfo / dob", "Date,  cannot be in the future. Date Child Became Your Dependent cannot be before Child's Date of Birth", Required if child is entered, Required only if vet has a child.
//  * "financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/dob", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/startDate", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/startDate", Check for format yyyy or mm/dd/yyyy, Required only if Veteran indicates they will will provide financial information,
//  * "financialsInfo/financialStatementInfo/dependentFinancialsCollection/dependentFinancialsInfo/dependentInfo/startDate", Future date value, Required only if Veteran indicates they will will provide financial information,
//  * dependentFinancialsInfo/amountContributedToSupport, null allowed; value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * dependentFinancialsInfo/livedWithPatient, Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amount IncomeType=Net Income from Farm,   Ranch,  Property,  Business)", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amount IncomeType=Net Income from Farm,   Ranch,  Property,  Business)", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amount IncomeType=Net Income from Farm,   Ranch,  Property,  Business)", "Dollar amounts:  0 <= 9999999.99", Req if child entered, "A value is needed for each child from the dependent screen.  This amount field must be accompanied by the income type."
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amount  Income Type=Total Employment Income (Wages,   Bonuses,  Tips)", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amount  Income Type=Total Employment Income (Wages,   Bonuses,  Tips)", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amount  Income Type=Total Employment Income (Wages,   Bonuses,  Tips)", "Dollar amounts:  0 <= 9999999.99", Req if child entered, "A value is needed for each child from the dependent screen.  This amount field must be accompanied by the income type. "
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amountIncome Type=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", Cannot be a Null value if child is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amountIncome Type=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / amountIncome Type=Other Income Amounts (Soc Sec.,   Compensation,  Pension,  Interest,   Divid.)", "Dollar amounts:  0 <= 9999999.99", Req if child entered, "A value is needed for each child from the dependent screen.  This amount field must be accompanied by the income type."
//  * financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, Data element is not a form captured element but provides the income type to identify the value as the Child's gross income from employment.
//  * financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, "Data element is not a form captured element but provides the income type to identify the value as the Child's gross income from FARM,  RANCH,  PROPERTY OR BUSINESS."
//  * financialStatementInfo / dependentFinancialsCollection / dependentFinancialsInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, "Data element is not a form captured element but provides the income type to identify the value as the Child's other income (from Soc Sec.,   Compensation,  Pension,  Interest,   Divididends)"
//  * "financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amount Income Type=Total Employment Income (Wages,   Bonuses,  Tips)", Cannot be a Null value if spouse is entered, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amount Income Type=Total Employment Income (Wages,   Bonuses,  Tips)", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amount Income Type=Total Employment Income (Wages,   Bonuses,  Tips)", "Dollar amounts:  0 <= 9999999.99", "Req if Marr/Sep,  or any 3 spouse questions answered on this Panel", This amount field must be accompanied by the income type.
//  * "financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amountIncomeType=Net Income from Farm,   Ranch,  Property,  Business IncomeType=Net Income from Farm,   Ranch,  Property,  Business", Cannot be a Null value, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amountIncomeType=Net Income from Farm,   Ranch,  Property,  Business IncomeType=Net Income from Farm,   Ranch,  Property,  Business", value outside range of 0 - 9999999.99, Required only if Veteran indicates they will will provide financial information,
//  * "financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / amountIncomeType=Net Income from Farm,   Ranch,  Property,  Business IncomeType=Net Income from Farm,   Ranch,  Property,  Business", "Dollar amounts:  0 <= 9999999.99", "Req if Marr/Sep,  or any 3 spouse questions answered on this Panel", This amount field must be accompanied by the income type.
//  * financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, Data element is not a form captured element but provides the income type to identify the value as the Spouse's gross income from employment.
//  * financialStatementInfo / spouseFinancialsCollection / spouseFinancialsInfo / incomeCollection / incomeInfo / type, Not applicable, Yes, "Data element is not a form captured element but provides the income type to identify the value as the Spouse's gross income from FARM,  RANCH,  PROPERTY OR BUSINESS."
function veteranToFinancialsInfo(_veteran) {
  return undefined;
}

// Produces an employmentInfo compatible type from a veteran resource.
//
// <xs:complexType name="employmentInfo">
//   <xs:all>
//     <xs:element name="employerAddress" type="addressInfo" minOccurs="0"/>
//     <xs:element name="employerName" type="xs:string" minOccurs="0"/>
//     <xs:element name="employerPhone" type="xs:string" minOccurs="0"/>
//     <xs:element name="employmentStatus" type="xs:string" minOccurs="0"/>
//     <xs:element name="occupation" type="xs:string" minOccurs="0"/>
//     <xs:element name="retirementDate" type="xs:string" minOccurs="0"/>
//   </xs:all>
// </xs:complexType>
//
// @param {Object} veteran - REST resource describing the veteran.
// @returns {Object} Object matching the employmentInfo schema.
//
// TODO(awong): Reconcile the spreadsheet dump below with the code and then delete from comment.
//  * employmentInfo / addressinfo / addressTypeCode, Not applicable, Req. if employed, Data element is not a form captured element but provides the address type for the Veteren's Employer.
//  * employmentInfo / addressinfo / city, alphanumeric (1-30), Req. if employed or retired, Required only if employed
//  * employmentInfo / addressinfo / country, drop-down, Req. if employed or retired, Required only if employed
//  * employmentInfo / addressinfo / line1, alphanumeric (1-30), Req. if employed, Required only if employed
//  * "employmentInfo / addressinfo / state  (if country is USA) employmentInfo / addressinfo / provinceCode (if country is not USA)", drop-down, Req. if employed or retired, Required only if employed
//  * "employmentInfo / addressinfo / zipCode  (if country is USA) employmentInfo / addressinfo / postalCode  (if country is not USA)", digits:  99999, Req. if employed, Required only if employed
//  * employmentInfo / addressinfo / zipPlus4, digits:  9999, No, Required only if employed
//  * employmentInfo / employerName, alphanumeric (1-30), Req. if employed or retired, Required only if employed
//  * employmentInfo / employerPhone, "Only numbers allowed,  10 digit number plus 0 to 5 digits for extension", ,
//  * employmentInfo / employerPhone, (999) 999-9999, No,
//  * employmentInfo / employmentStatus, drop-down, Yes,
//  * employmentInfo / retirementDate, "Date,  only displayed if RETIRED. Cannot be in the future.", "If Retired,  Yr is required",
//  * employmentInfo/adressInfo/city, Required if employed, ,
//  * employmentInfo/adressInfo/country, Cannot be a Null value, ,
//  * employmentInfo/adressInfo/country, Not a valid reference value, ,
//  * employmentInfo/adressInfo/line1, Cannot be more than 30 alphanumeric , ,
//  * "employmentInfo/adressInfo/line1 ", Required if employed, ,
//  * "employmentInfo/adressInfo/state or employmentInfo/adressInfo/provinceCode", "If country is USA,  state cannot be a null value.  If country is Canada or Mexico,  provinceCode cannot be a null value.", ,
//  * "employmentInfo/adressInfo/state or employmentInfo/adressInfo/provincecode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", ,
//  * employmentInfo/adressInfo/zipCode, "If country is USA,  cannot be a Null value.", ,
//  * employmentInfo/adressInfo/zipCode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", ,
//  * employmentInfo/adressInfo/zipPlus4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", ,
//  * employmentInfo/employerName, "Required if employed (Employment status = ""Full Time"" or ""Part Time"")", ,
//  * employmentInfo/employmentStatus, Cannot be a Null value, ,
//  * employmentInfo/employmentStatus, Not a valid reference value, ,
//  * employmentInfo/retirementDate, "If Retired,  at least the year is required. (Employment Status = ""Retired"")", ,
//  * employmentInfo/retirementDate, Check for format yyyy or mm/dd/yyyy and cannot be a future date, ,
// function veteranToEmploymentInfo(veteran) {
//   return undefined;
// }
//
// TODO(awong): Do we collect employment info? I don't think so...

// Produces an associationCollection compatible type from a veteran resource.
//
// <xs:complexType name="associationCollection">
//   <xs:sequence>
//     <xs:element name="association" type="associationInfo" nillable="true" minOccurs="0" maxOccurs="unbounded"/>
//   </xs:sequence>
// </xs:complexType>
//
// <xs:complexType name="associationInfo">
//   <xs:all>
//     <xs:element name="address" type="baseAddressInfo" minOccurs="0"/>
//     <xs:element name="alternatePhone" type="xs:string" minOccurs="0"/>
//     <xs:element name="contactType" type="xs:string" minOccurs="0"/>
//     <xs:element name="familyName" type="xs:string" minOccurs="0"/>
//     <xs:element name="givenName" type="xs:string" minOccurs="0"/>
//     <xs:element name="lastUpdateDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="middleName" type="xs:string" minOccurs="0"/>
//     <xs:element name="organizationName" type="xs:string" minOccurs="0"/>
//     <xs:element name="prefix" type="xs:string" minOccurs="0"/>
//     <xs:element name="primaryPhone" type="xs:string" minOccurs="0"/>
//     <xs:element name="relationship" type="xs:string" minOccurs="0"/>
//     <xs:element name="suffix" type="xs:string" minOccurs="0"/>
//   </xs:all>
// </xs:complexType>
//
// @param {Object} veteran - REST resource describing the veteran.
// @returns {Object} Object matching the associationCollection schema.
//
// TODO(awong): Reconcile the spreadsheet dump below with the code and then delete from comment.
//  * associationCollection / associationInfo / alternatePhone, numeric; must be 10 digits, No, "can include a 5 digit extention  Contact Type Code = 1"
//  * associationCollection / associationInfo / alternatePhone, numeric; must be 10 digits, No, Contact Type Code = 3
//  * associationCollection / associationInfo / baseAddressInfo / city, alphanumeric (1-30), No, Contact Type Code = 1
//  * associationCollection / associationInfo / baseAddressInfo / city, alphanumeric (1-30), No, Contact Type Code = 3
//  * associationCollection / associationInfo / baseAddressInfo / country, drop-down, No, Contact Type Code = 1
//  * associationCollection / associationInfo / baseAddressInfo / country, drop-down, No, Contact Type Code = 3
//  * associationCollection / associationInfo / baseAddressInfo / line1, alphanumeric (1-30), No, Contact Type Code = 1
//  * associationCollection / associationInfo / baseAddressInfo / line1, alphanumeric (1-30), No, Contact Type Code = 3
//  * "associationCollection / associationInfo / baseAddressInfo / state (if country is USA) associationCollection / associationInfo / baseAddressInfo / provinceCode (if country is not USA)", drop-down, No, Contact Type Code = 1
//  * "associationCollection / associationInfo / baseAddressInfo / state (if country is USA) associationCollection / associationInfo / baseAddressInfo / provinceCode (if country is not USA)", alphanumeric (1-30), No, Contact Type Code = 3
//  * "associationCollection / associationInfo / baseAddressInfo / zipCode  (if country = USA) associationCollection / associationInfo / baseAddressInfo / postalCode  (if country is not USA)", digits; 99999 , No, Contact Type Code = 1
//  * "associationCollection / associationInfo / baseAddressInfo / zipCode  (if country = USA) associationCollection / associationInfo / baseAddressInfo / postalCode  (if country is not USA)", alphanumeric (1-30), No, Contact Type Code = 3
//  * associationCollection / associationInfo / baseAddressInfo / zipCode4, digits; 99999 , No, Contact Type Code = 1
//  * associationCollection / associationInfo / baseAddressInfo / zipCode4, alphanumeric (1-30), No, Contact Type Code = 3
//  * associationCollection / associationInfo / contactType , Not Applicable, No, "Contact Type that identifies the person association as the ""Next of Kin""."
//  * associationCollection / associationInfo / contactType , Not Applicable, No, "Contact Type that identifies the person association as the ""Emergency Contact"" (code=3)"
//  * associationCollection / associationInfo / familyName, alphanumeric (1-30), Yes, Contact Type Code = 1
//  * associationCollection / associationInfo / familyName, alphanumeric (1-30), Yes, Contact Type Code = 3
//  * associationCollection / associationInfo / givenName, alphanumeric (1-30), Yes, Contact Type Code = 1
//  * associationCollection / associationInfo / givenName, alphanumeric (1-30), Yes, Contact Type Code = 3
//  * associationCollection / associationInfo / primaryPhone, numeric; must be 10 digits, No, Contact Type Code = 1
//  * associationCollection / associationInfo / primaryPhone , numeric; must be 10 digits, No, Contact Type Code = 3
//  * associationCollection / associationInfo / relationship, drop-down, Yes, "Contact Type Code = 1; This element holds the text value (i.e,  name) of the relationship,  not a code value.  "
//  * associationCollection / associationInfo / relationship, drop-down, Yes, "Contact Type Code = 3; This element holds the text value (i.e,  name) of the relationship,  not a code value.  "
//  * associationCollection/associationInfo/alternatePhone, "Null value is allowed;  Only numbers are allowed if value is present - must be 10 digit number minimum,  plus 0 to 5 digits for extension", Contact type code = 1,
//  * associationCollection/associationInfo/alternatePhone, "Null value is allowed;  Only numbers are allowed if value is present - must be 10 digit number minimum,  plus 0 to 5 digits for extension", Contact type code = 3,
//  * associationCollection/associationInfo/baseAddressInfo/city, Null allowed;  if not null then value must be an alphanumeric from 1 -30 characters in length, Contact type code = 1,
//  * associationCollection/associationInfo/baseAddressInfo/city, Null allowed;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, Contact type code = 3,
//  * associationCollection/associationInfo/baseAddressInfo/country, Cannot be a Null value, Contact type code = 1,
//  * associationCollection/associationInfo/baseAddressInfo/country, Not a valid reference value, Contact type code = 1,
//  * associationCollection/associationInfo/baseAddressInfo/country, Cannot be a Null value, Contact type code = 3,
//  * associationCollection/associationInfo/baseAddressInfo/country, Not a valid reference value, Contact type code = 3,
//  * associationCollection/associationInfo/baseAddressInfo/line1, Null allowed;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, Contact type code = 3,
//  * "associationCollection/associationInfo/baseAddressInfo/state or associationCollection/associationInfo/baseAddressInfo/provinceCode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", Contact type code = 1,
//  * "associationCollection/associationInfo/baseAddressInfo/state or associationCollection/associationInfo/baseAddressInfo/provinceCode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", Contact type code = 3,
//  * associationCollection/associationInfo/baseAddressInfo/zipCode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", Contact type code = 1,
//  * associationCollection/associationInfo/baseAddressInfo/zipCode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", Contact type code = 3,
//  * associationCollection/associationInfo/baseAddressInfo/zipCode4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", Contact type code = 1,
//  * associationCollection/associationInfo/baseAddressInfo/zipCode4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", Contact type code = 3,
//  * associationCollection/associationInfo/baseAdressInfo/line1, Null allowed;  if not null then value must be must be an alphanumeric from 1 -30 characters in length, Contact type code = 1,
//  * associationCollection/associationInfo/familyName, Cannot be a Null value, Contact type code = 1,
//  * associationCollection/associationInfo/familyName, Cannot be a Null value, Contact type code = 3,
//  * associationCollection/associationInfo/givenName, Cannot be a Null value, Contact type code = 1,
//  * associationCollection/associationInfo/givenName, Cannot be a Null value, Contact type code = 3,
//  * associationCollection/associationInfo/primaryPhone , "Null value is allowed;  Only numbers allowed and must be 10 digits. ", Contact type code = 1,
//  * associationCollection/associationInfo/primaryPhone , Only numbers allowed and must be 10 digits, Contact type code = 3,
//  * associationCollection/associationInfo/relationship, Cannot be a Null value, Contact type code = 1,
//  * associationCollection/associationInfo/relationship, Only alphanumeric characters are allowed., Contact type code = 1,
//  * associationCollection/associationInfo/relationship, Cannot be a Null value; , Contact type code = 3,
//  * associationCollection/associationInfo/relationship, Only alphanumeric characters are allowed., Contact type code = 3,
function veteranToAssociationCollection(_veteran) {
  return undefined;
}

// Produces an demographicInfo compatible type from a veteran resource.
//
// <xs:complexType name="demographicInfo">
//   <xs:all>
//     <xs:element name="appointmentRequestDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="appointmentRequestResponse" type="xs:boolean" minOccurs="0"/>
//     <xs:element name="claimFolderLocation" type="xs:string" minOccurs="0"/>
//     <xs:element name="claimFolderNumber" type="xs:string" minOccurs="0"/>
//     <xs:element name="contactInfo" type="contactInfo" minOccurs="0"/>
//     <xs:element name="ethnicity" type="xs:string" minOccurs="0"/>
//     <xs:element name="maritalStatus" type="xs:string" minOccurs="0"/>
//     <xs:element name="preferredFacility" type="xs:string" minOccurs="0"/>
//     <xs:element name="assignmentDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="unassignmentDate" type="xs:dateTime" minOccurs="0"/>
//     <xs:element name="races" type="raceCollection" minOccurs="0"/>
//     <xs:element name="religion" type="xs:string" minOccurs="0"/>
//     <xs:element name="preferredFacilities" type="preferredFacilityCollection" minOccurs="0"/>
//     <xs:element name="acaIndicator" type="xs:boolean" minOccurs="0"/>
//   </xs:all>
// </xs:complexType>
//
// @param {Object} veteran - REST resource describing the veteran.
// @returns {Object} Object matching the demographicInfo schema.
//
// TODO(awong): Reconcile the spreadsheet dump below with the code and then delete from comment.
//
//  * demographicInfo / appointmentRequestResponse, Checkbox, No,
//  * demographicInfo / claimFolderNumber, Not applicable, Not in VOA UI,
//  * demographicInfo / contactInfo / emailCollection / emailInfo / address, "alphanumeric 3-50.  an""@"" character cannot be the first or last character position.", No,
//  * demographicInfo / contactInfo / emailCollection / emailInfo / type, Not applicable, Yes, Data element is not a form captured element but provides the address type for the Veteren's Permanent Address.
//  * "demographicInfo / contactInfo / phoneInfo / phoneNumber Type=HOME", numeric; must be 10 digits, No,
//  * "demographicInfo / contactInfo / phoneInfo / phoneNumber Type=Mobile", numeric; must be 10 digits, No,
//  * demographicInfo / contactInfo / phoneinfo / type, Not applicable, No, Data element is not a form captured element but provides the phone type value for Veteren Home Telephone Number.
//  * demographicInfo / contactInfo / phoneinfo / type, Not applicable, No, Data element is not a form captured element but provides the phone type value for the Veteran Cellular Telephone Number.
//  * demographicInfo / ethnicity, Checkbox, No,
//  * demographicInfo / maritalStatus, drop-down, Yes,
//  * demographicInfo / preferredFacility, State and Center/Clinic are both drop-downs. , Yes, This appers to be 2 differerent values passed and yes/no for each 1. Enrollment Health services and 2. Dental
//  * demographicInfo / raceCollection / race, Checkboxes, No, Multiple may be indicated
//  * demographicInfo / religion, drop-down, No,
//  * demographicInfo/contactInfo/emailCollection/emailInfo/address, "Null allowed; If not null then the value must be at least 3 characters but no more than 50 characters in length,  with ""@"" not in the first or last character", ,
//  * "demographicInfo/contactInfo/phoneInfo/phoneNumber Type=HOME", Only numbers allowed and must be 10 digits. , ,
//  * "demographicInfo/contactInfo/phoneInfo/phoneNumber Type=Mobile", Only numbers allowed and must be 10 digits. , ,
//  * demographicInfo/ethnicity, Not a valid reference value, ,
//  * demographicInfo/maritalStatus, Cannot be a Null value, ,
//  * demographicInfo/maritalStatus, Not a valid reference value, ,
//  * demographicInfo/preferredFacility, Cannot be a Null value, ,
//  * demographicInfo/preferredFacility, Not a valid reference value, ,
//  * demographicInfo/religion, Not a valid reference value, ,
//  * demographicsInfo / contactinfo / addressInfo / addressTypeCode, Not applicable, Yes, Data element is not a form captured element but provides the address type for the Veteren's Permanent Address.
//  * demographicsInfo / contactinfo / addressInfo / city, alphanumeric 1-51, Yes,
//  * demographicsInfo / contactinfo / addressInfo / country, drop-down, Yes,
//  * demographicsInfo / contactinfo / addressInfo / county, alphanumeric (1-30), No,
//  * demographicsInfo / contactinfo / addressInfo / line1, alphanumeric 1-50, Yes,
//  * "demographicsInfo / contactinfo / addressInfo / state  (if country is USA) demographicsInfo / contactinfo / addressInfo / provinceCode (if country is not USA)", alphanumeric 1-51, Yes,
//  * "demographicsInfo / contactinfo / addressInfo / zipCode  (if country = USA) demographicsInfo / contactinfo / addressInfo / postalCode  (if country is not USA)", "alphanumeric 1-50 99999", Yes,
//  * demographicsInfo / contactinfo / addressInfo / zipPlus4, "alphanumeric 1-50 9999", No,
//  * demographicsInfo/contactinfo/addressInfo/city, Cannot be a Null value, ,
//  * demographicsInfo/contactinfo/addressInfo/country, Cannot be a NULL value, ,
//  * demographicsInfo/contactinfo/addressInfo/country, Not a valid reference value, ,
//  * demographicsInfo/contactinfo/addressInfo/line1, Cannot be a Null value, ,
//  * "demographicsInfo/contactinfo/addressInfo/state or demographicsInfo/contactinfo/addressInfo/provinceCode", "If country is USA,  state cannot be a null value.  If country is Canada or Mexico,  provinceCode cannot be a null value.", ,
//  * "demographicsInfo/contactinfo/addressInfo/state or demographicsInfo/contactinfo/addressInfo/provinceCode", "If country is USA,  state is not a valid referance value.  If country is Canada or Mexico,  provinceCode not a valid reference value", ,
//  * demographicsInfo/contactinfo/addressInfo/zipCode, "If country is USA,  cannot be a Null value.", ,
//  * demographicsInfo/contactinfo/addressInfo/zipCode, "If country is USA,  check for format: 99999.   Only numbers are allowed. ", ,
//  * demographicsInfo/contactinfo/addressInfo/zipPlus4, "If country is USA,  check for format: 9999  Only numbers are allowed. ", ,
function veteranToDemographicsInfo(veteran) {
  return {
    appointmentRequestResponse: true, // FIX
    contactInfo: {
      addresses: {
        address: {
          city: veteran.veteranAddress.city,
          country: veteran.veteranAddress.country,
          line1: veteran.veteranAddress.street,
          state: veteran.veteranAddress.state,
          zipCode: veteran.veteranAddress.zipcode,
          addressTypeCode: 'P',  // FIX
        }
      },
    },
    ethnicity: '2186-5', // FIX
    maritalStatus: maritalStatusToSDSCode(veteran.maritalStatus),
    preferredFacility: veteran.vaMedicalFacility,
    races: {
      race: '2106-3' // FIX
    },
    acaIndicator: veteran.isCoveredByHealthInsurance, // FIX
  };
}

// Produces an eeSummary compatible type from a veteran resource.
//
// <xs:complexType name="eeSummary">
//   <xs:all>
//     <xs:element name="associations" type="associationCollection" minOccurs="0"/>
//     <xs:element name="deathRecond" type="deathRecondInfo" minOccurs="0"/>
//     <xs:element name="demographics" type="demographicInfo" minOccurs="0"/>
//     <xs:element name="eligibilityVerificationInfo" type="eligibilityVerificationInfo" minOccurs="0"/>
//     <xs:element name="employmentInfo" type="employmentInfo" minOccurs="0"/>
//     <xs:element name="enrollmentDeterminationInfo" type="enrollmentDeterminationInfo" minOccurs="0"/>
//     <xs:element name="feeBasisList" type="feeBasisCollection" minOccurs="0"/>
//     <xs:element name="financialsInfo" type="financialsInfo" minOccurs="0"/>
//     <xs:element name="incompetenceRulingInfo" type="incompetenceRulingInfo" minOccurs="0"/>
//     <xs:element name="insuranceList" type="insuranceCollection" minOccurs="0"/>
//     <xs:element name="militaryServiceInfo" type="militaryServiceInfo" minOccurs="0"/>
//     <xs:element name="prisonerOfWarInfo" type="prisonerOfWarInfo" minOccurs="0"/>
//     <xs:element name="purpleHeart" type="purpleHeartInfo" minOccurs="0"/>
//     <xs:element name="relations" type="relationCollection" minOccurs="0"/>
//     <xs:element name="sensitivityInfo" type="sensitivityInfo" minOccurs="0"/>
//     <xs:element name="spinalCordInjuryInfo" type="spinalCordInjuryInfo" minOccurs="0"/>
//     <xs:element name="personInfo" type="personInfo" maxOccurs="1" minOccurs="0"/>
//     <xs:element name="consentInfo" type="consentInfo" maxOccurs="1" minOccurs="0"/>
//   </xs:all>
// </xs:complexType>
//
// @param {Object} veteran - REST resource describing the veteran.
// @returns {Object} Object matching the eeSummary schema.
//
// TODO(awong): Reconcile the spreadsheet dump below with the code and then delete from comment.
//  * form / attachments / document / content, Not Applicable, No, Data element is not a form captured element but provides attached document in binary form.
//  * form / attachments / document / format/ formatType, Not Applicable, No, "Data element is not a form captured element but provides the format type of the attached document. (e.g.,  PDF)"
//  * form / attachments / document / name, Not Applicable, No, Data element is not a form captured element but provides the name of the attached document.
//  * form / attachments / document / type / attachmentType, Not Applicable, No, "Data element is not a form captured element but provides the eligible document type of the attachment. (e.g.,  DD-214)"
function veteranToSummary(veteran) {
  return {
    associations: veteranToAssociationCollection(veteran),
    demographics: veteranToDemographicsInfo(veteran),
    enrollmentDeterminationInfo: veteranToEnrollmentDeterminationInfo(veteran),
    financialsInfo: veteranToFinancialsInfo(veteran),
    insuranceList: veteranToInsuranceCollection(veteran),
    militaryServiceInfo: veteranToMilitaryServiceInfo(veteran),

    //  * "prisonerOfWarInfo / powIndicator", Checkbox, No,
    prisonerOfWarInfo: { powIndicator: veteran.isFormerPow },

    //  * purpleHeartInfo / indicator, Checkbox, No,
    purpleHeart: { indicator: veteran.purpleHeartRecipient },

    personInfo: veteranToPersonInfo(veteran),

  };
}

// === UNKNOWN FIELDS ====
//  * names / nameInfo / otherName, alphanumeric (1-30), No, "Element is accepted but not used as this element will not be stored in ADR,  it must come from MPI (the authoritative source)."
//  * names/nameInfo/otherName, Null allowed; if not null then value must be alphanumeric from 1- 30 characters in length, ,
//  * eeSummary, Not Applicable, Yes, Contains the form data from the eeSummary.xsd.


/**
 * Transforms veteran Java object into an Enrollment system friendly submission.
 *
 * This function is the bridge between the REST Veteran resource and the Enrollment System SOAP
 * form submission endpoint message format. It assumes the passed in veteran model has passed
 * validation.
 *
 * See the WSDL fort the enrollment system for the most authoritative description of the SOAP
 * endpoint.
 *
 *    https://vaww.esr.aac.va.gov/voa/voaSvc?wsdl
 *
 * TODO(alexose): Add link to authoritative file describing the Veteran resource format.
 *
 * @param {Object} veteran - REST resource describing the veteran.
 * @returns {Object} Object representing soap message for use with VoaService.saveSubmitForm.
 */
function veteranToSaveSubmitForm(veteran) {
  if (!veteran || typeof veteran !== Object || _.isEmpty(veteran)) {
    return {};
  }
  const request = Object.assign({}, formTemplate);
  request.form.summary = veteranToSummary(veteran);
  request.form.applications = {
    applicationInfo: {
      // FIX. Use current date.
      //  * form / applications / applicationInfo / appDate, "Application date cannot be a null value when the form identifier type is ""100 -- 1010EZ""", ,
      //  * form / applications / applicationInfo / benefitType, "Neither Health Benefits or Dental is indicated,  at least one is required; both may be indicated.", ,
      //  * form / applications / applicationInfo / benefitType, Checkboxes, Yes, This is one question of the form but is currently passed as 2 differerent values with a yes/no for each 1. Enrollment Health services and 2. Dental
      appDate: '2016-05-13',
      appMethod: '1'
    }
  };
  return JSON.parse(JSON.stringify(request, (i, d) => {
    if (d === true) {
      return 'true';
    } else if (d === false) {
      return 'false';
    } else if (typeof (d) === 'number') {
      return `${d}`;
    }
    return d;
  }));
}

module.exports = { veteranToSaveSubmitForm };
