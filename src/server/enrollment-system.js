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
  return veteran;
}

module.exports = { veteranToSaveSubmitForm };
