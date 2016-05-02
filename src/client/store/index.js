export function pathToData(state, path) {
  switch (path) {
    case '/introduction':
      return {};

    case '/who-are-you/panel1':
      return state;

    case '/who-are-you/panel2':
      return state;

    case '/who-are-you/panel3':
      return state;

    // case '/who-are-you/demographic-information':
    //   return state.demographicInformation;

    // case '/who-are-you/veteran-address':
    //   return state.veteranAddress;

    // case '/insurance-information/general':
    //   return state.insuranceInformation;

    // case '/insurance-information/medicare-medicaid':
    //   return state.medicareMedicaid;

    // case 'military-service/panel1':
    //   return state.serviceInformation;

    // case '/military-service/panel3':
    //   return state.militaryAdditionalInfo;

    // case '/financial-assessment/financial-disclosure':
    //   return state.financialDisclosure;

    // case '/financial-assessment/panel3':
    //   return state.spouseInformation;

    case '/financial-assessment/panel4':
      return state;

    // case '/financial-assessment/panel1':
    //   return state.annualIncome;

    // case '/financial-assessment/panel2':
    //   return state.deductibleExpenses;

    // case '/review-and-submit':
    //   return {};

    default:
      return state;
  }
}
