// Static for content for the 1010EZ.
const formTemplate = {
  form: {
    formIdentifier: {
      type: '100',
      value: '1010EZ'
    },
    identity: {
      authenticationLevel: {
        type: '100',
        value: 'anonymous'
      }
    }
  }
};

function veteranToPersonInfo(veteran) {
  return {
    firstName: veteran.veteranFullName.first,
    middleName: veteran.veteranFullName.middle,
    lastName: veteran.veteranFullName.last,
    ssnText: veteran.veteranSocialSecurityNumber,
    gender: veteran.gender,
    dob: veteran.veteranDateOfBirth,
    mothersMaidenName: veteran.mothersMaidenName,
    placeOfBirthCity: veteran.cityOfBirth,
  };
}

function veteranToMilitaryServiceInfo(veteran) {
  return {
    disabilityRetirementIndicator: false, // FIX
    dischargeDueToDisability: false, // FIX
    militaryServiceSiteRecords: {
      militaryServiceSiteRecord: {
        militaryServiceEpisode: {
          endDate: veteran.lastDischargeDate,
          serviceBranch: veteran.lastServiceBranch,
          startDate: veteran.lastEntryDate,
          dischargeType: veteran.dischargeType,
        }
      },
      site: '565GC',  // FIX
    }
  };
}

function veteranToInsuranceList(veteran) {
  return {
    // FIX
    insurance: {
      companyName: 'Medicare',
      enrolledInPartA: veteran.isEnrolledMedicarePartA,
      enrolledInPartB: false, // FIX
      insuranceMappingTypeName: 'MDCR' // FIX
    }
  };
}

function veteranToEnrollmentDetermination(veteran) {
  return {
    eligibleForMedicaid: veteran.isMedicaidEligible,
    noseThroatRadiumInfo: {
      receivingTreatment: veteran.radiumTreatments,
    },
    serviceConnectionAward: {
      serviceConnectedIndicator: veteran.isVaServiceConnected,
    },
    specialFactors: {
      agentOrangeInd: false, // FIX
      envContaminantsInd: false, // FIX
      campLejeuneInd: veteran.campLejeune,
      radiationExposureInd: veteran.exposedToRadiation,
    }
  };
}

function veteranToDemographics(veteran) {
  return {
    appointmentRequestResponse: true, // FIX
    addresses: {
      address: {
        city: veteran.veteranAddress.city,
        country: veteran.veteranAddress.country,
        line1: veteran.veteranAddress.street,
        state: veteran.veteranAddress.state,
        zipcode: veteran.veteranAddress.zipcode,
      }
    },
    ethnicity: '2186-5', // FIX
    maritalStatus: veteran.maritalStatus,
    preferredFacility: veteran.vaMedicalFacility,
    races: {
      race: '2106-3' // FIX
    },
    acaIndicator: veteran.isCoveredByHealthInsurance, // FIX
  };
}

function veteranToSummary(veteran) {
  return {
    demographics: veteranToDemographics(veteran),
    enrollmentDeterminationInfo: veteranToEnrollmentDetermination(veteran),
    insuranceList: veteranToInsuranceList(veteran),
    militaryServiceInfo: veteranToMilitaryServiceInfo(veteran),
    prisonerOfWarInfo: veteran.isFormerPow,
    purpleHeart: veteran.purpleHeartRecipient,
    personInfo: veteranToPersonInfo(veteran),
    // FIX
    applications: {
      applicationInfo: {
        appDate: '2015-12-21',
        appMethod: '1'
      }
    }
  };
}

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
  return Object.assign({}, formTemplate, { summary: veteranToSummary(veteran) });
}

module.exports = { veteranToSaveSubmitForm };
