import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import VaMedicalFacility from './VaMedicalFacility';
import { veteranUpdateField } from '../../actions';
import { states, vaMedicalFacilities } from '../../utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../utils/validations';
import { displayLabel } from '../../store/calculated';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AdditionalInformationSection extends React.Component {
  render() {
    let content;
    const selectedFacilityState = this.props.data.facilityState.value;
    const FacilitiesWithinState = vaMedicalFacilities[selectedFacilityState];
    const selectedVaMedicalFacility = this.props.data.vaMedicalFacility.value;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I am enrolling to obtain minimal essential coverage under the affordable care act:</td>
            <td>{`${this.props.data.isEssentialAcaCoverage ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Preferred VA Medical Facility:</td>
            <td>{displayLabel(FacilitiesWithinState, selectedVaMedicalFacility)}</td>
          </tr>
          <tr>
            <td>Do you want VA to contact you to schedule your first appointment?:</td>
            <td>{`${this.props.data.wantsInitialVaContact ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        {/* TODO: Change the headings to something related to the questions. */}
        <legend>Additional Information</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <ErrorableCheckbox
              label="I am enrolling to obtain minimal essential coverage under the affordable care act"
              checked={this.props.data.isEssentialAcaCoverage}
              onValueChange={(update) => {this.props.onStateChange('isEssentialAcaCoverage', update);}}/>
        </div>

        <div className="input-section">
          <h4>Select the VA Medical Facility which will be your preferred facility</h4>
          <ErrorableSelect required
              errorMessage={validateIfDirty(this.props.data.facilityState, isNotBlank) ? undefined : 'Please select a state'}
              label="State"
              options={states.USA}
              value={this.props.data.facilityState}
              onValueChange={(update) => {this.props.onStateChange('facilityState', update);}}/>
          <VaMedicalFacility required
              value={this.props.data.vaMedicalFacility}
              facilityState={this.props.data.facilityState}
              onValueChange={(update) => {this.props.onStateChange('vaMedicalFacility', update);}}/>
          OR <a target="_blank" href="http://www.va.gov/directory/guide/home.asp">Go to the VA Facility Locator</a>
        </div>

        <div className="input-section">
          <ErrorableCheckbox
              label="Do you want VA to contact you to schedule your first appointment?"
              checked={this.props.data.wantsInitialVaContact}
              onValueChange={(update) => {this.props.onStateChange('wantsInitialVaContact', update);}}/>
        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/insurance-information/va-facility'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AdditionalInformationSection);
export { AdditionalInformationSection };
