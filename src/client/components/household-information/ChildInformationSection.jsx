import React from 'react';
import { connect } from 'react-redux';

import Child from './Child';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import { makeField } from '../../reducers/fields';
import { veteranUpdateField, ensureFieldsInitialized } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class ChildInformationSection extends React.Component {
  // TODO(awong): Pull this out into a model.
  createBlankChild() {
    return {
      childFullName: {
        first: makeField(''),
        middle: makeField(''),
        last: makeField(''),
        suffix: makeField('')
      },
      childRelation: makeField(''),
      childSocialSecurityNumber: makeField(''),
      childBecameDependent: {
        month: makeField(''),
        day: makeField(''),
        year: makeField('')
      },
      childDateOfBirth: {
        month: makeField(''),
        day: makeField(''),
        year: makeField('')
      },
      childDisabledBefore18: false,
      childAttendedSchoolLastYear: false,
      childEducationExpenses: makeField(''),
      childCohabitedLastYear: false,
      childReceivedSupportLastYear: false
    };
  }

  render() {
    let childrenContent;
    let content;
    let children;
    const fields = ['childFullName', 'childRelation', 'childSocialSecurityNumber', 'childBecameDependent', 'childDateOfBirth', 'childDisabledBefore18', 'childAttendedSchoolLastYear', 'childEducationExpenses', 'childCohabitedLastYear', 'childReceivedSupportLastYear'];

    if (this.props.data.children) {
      const childList = this.props.data.children;
      let reactKey = 0;
      children = childList.map((obj) => {
        const childFirstName = obj.childFullName.first.value;
        const childMiddleName = obj.childFullName.middle.value;
        const childLastName = obj.childFullName.last.value;
        const childSuffix = obj.childFullName.suffix.value;
        const childRelation = obj.childRelation.value;
        const childSocialSecurityNumber = obj.childSocialSecurityNumber.value;
        const childBecameDependentMonth = obj.childBecameDependent.month.value;
        const childBecameDependentDay = obj.childBecameDependent.day.value;
        const childBecameDependentYear = obj.childBecameDependent.year.value;
        const childDateOfBirthMonth = obj.childDateOfBirth.month.value;
        const childDateOfBirthDay = obj.childDateOfBirth.day.value;
        const childDateOfBirthYear = obj.childDateOfBirth.year.value;
        const childDisabledBefore18 = obj.childDisabledBefore18;
        const childAttendedSchoolLastYear = obj.childAttendedSchoolLastYear;
        const childEducationExpenses = obj.childEducationExpenses.value;
        const childCohabitedLastYear = obj.childCohabitedLastYear;
        const childReceivedSupportLastYear = obj.childReceivedSupportLastYear;
        return (<table key={++reactKey} className="review usa-table-borderless">
          <thead>
            <tr>
              <td scope="col">Child - {childFirstName} {childMiddleName} {childLastName} {childSuffix}</td>
              <td scope="col"></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Relationship to you:</td>
              <td>{childRelation}</td>
            </tr>
            <tr>
              <td>Social Security Number:</td>
              <td>{childSocialSecurityNumber}</td>
            </tr>
            <tr>
              <td>Date Child Became Dependent:</td>
              <td>{childBecameDependentMonth}/{childBecameDependentDay}/{childBecameDependentYear}</td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td>{childDateOfBirthMonth}/{childDateOfBirthDay}/{childDateOfBirthYear}</td>
            </tr>
            <tr>
              <td>Was child permanently and totally disabled before the age of 18?:</td>
              <td>{`${childDisabledBefore18 ? 'Yes' : 'No'}`}</td>
            </tr>
            <tr>
              <td>If child is between 18 and 23 years of age, did child attend school last calendar year?:</td>
              <td>{`${childAttendedSchoolLastYear ? 'Yes' : 'No'}`}</td>
            </tr>
            <tr>
              <td>Expenses paid by your dependent child for college, vocational rehabilitation or training (e.g., tuition, books, materials):</td>
              <td>{childEducationExpenses}</td>
            </tr>
            <tr>
              <td>Did your child live with you last year?:</td>
              <td>{`${childCohabitedLastYear ? 'Yes' : 'No'}`}</td>
            </tr>
            <tr>
              <td>If your dependent child did not live with you last year, did you provide support?:</td>
              <td>{`${childReceivedSupportLastYear ? 'Yes' : 'No'}`}</td>
            </tr>
          </tbody>
        </table>);
      });
    }

    if (this.props.data.hasChildrenToReport === true) {
      childrenContent = (
        <div className="input-section">
          <hr/>
          <GrowableTable
              component={Child}
              createRow={this.createBlankChild}
              data={this.props.data}
              initializeCurrentElement={() => {this.props.initializeFields(fields);}}
              onRowsUpdate={(update) => {this.props.onStateChange('children', update);}}
              path="/household-information/child-information"
              rows={this.props.data.children}/>
        </div>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Do you have any children to report?:</td>
              <td>{`${this.props.data.hasChildrenToReport ? 'Yes' : 'No'}`}</td>
            </tr>
          </tbody>
        </table>
      {children}
      </div>);
    } else {
      content = (<fieldset>
        <legend>Children Information</legend>
        <div>
          <p>Please fill these out to the best of your knowledge. The more accurate your responses, the faster your application can proceed.</p>
          <div className="input-section">
            <ErrorableCheckbox
                label="Do you have any children to report?"
                checked={this.props.data.hasChildrenToReport}
                onValueChange={(update) => {this.props.onStateChange('hasChildrenToReport', update);}}/>
          </div>
          {childrenContent}
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
    isSectionComplete: state.uiState.sections['/household-information/child-information'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    initializeFields: (fields) => {
      dispatch(ensureFieldsInitialized(fields, 'children'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ChildInformationSection);
export { ChildInformationSection };
