# Healthcare Application

## Project Background

### Back-end

The backend receives a JSON object from the front-end containing a Vet's 1010ez request and
sends it to an ES endpoint. The ES endpoint response is then returned to the front-end.

The backend uses _Express/Strongloop/loopback_ and the associated `loopback-soap-connector` module
to serve the REST API to the front-end, convert JSON structures into SOAP-friendly XML, and manage
connections and responses from end endpoint.

#### High-level design
![Network Diagram](diagrams/hca-top.png)

![Sequence Diagram](diagrams/hca-seq-01.png)

(TODO: some words to go along with these diagrams)

### Development setup

#### Node.js

##### The requirements for running this application are Node.js 4.4.4 and npm 3.8.9.
You should use Node Version Manager (nvm) to manage the versions of node.js on your local machine.
To install please visit: https://github.com/creationix/nvm
_If you are on a mac and use [homebrew](http://brew.sh/), you can install nvm by typing: brew update && brew install nvm_

Once you have nvm installed you should now install node.js version 4.4.4 by running: 

```bash
nvm install 4.4.4
```

Once you have node.js version 4.4.4 installed install npm version 3.8.9 by running:

```bash
npm i -g npm@3.8.9
```
##### Verify your local requirements are set
```bash
node --version // 4.4.4
npm --version  // 3.8.9
```

Checkout the repository: 

```bash
git clone git@github.com:department-of-veterans-affairs/healthcare-application.git
```

Install the node.js project dependencies:

```bash
npm install
```

#### Development example of interaction with ES servers

* Make sure you have `healthcare.application.crt` and `healthcare.application.key` in `hca-api-stub`
* Choose which endpoint you want to use in `hca-api-stub/voa-rest.js:20` (the `url` entry).
* Start backend-via `npm start`
* On a web-browser, navigate to http://localhost:3000/explorer/
* Click on _VoaService_

##### Submit a form
* Find and click on _GET /VoaServices/submit_ to expand section
* In the _form_ field, enter:
```json
{
  "form": {
    "formIdentifier": {
      "type": "100",
      "value": "1010EZ"
    },
    "summary": {
      "demographics": {
        "appointmentRequestResponse": "true",
        "contactInfo": {
          "addresses": {
            "address": {
              "city": "Jacksonville",
              "country": "USA",
              "line1": "232 FAKE Dr",
              "state": "NC",
              "zipCode": "28540",
              "addressTypeCode": "P"
            }
          }
        },
        "ethnicity": "2186-5",
        "maritalStatus": "M",
        "preferredFacility": "608",
        "races": {
          "race": "2106-3"
        },
        "acaIndicator": "false"
      },
      "enrollmentDeterminationInfo": {
        "eligibleForMedicaid": "false",
        "noseThroatRadiumInfo": {
          "receivingTreatment": "false"
        },
        "serviceConnectionAward": {
          "serviceConnectedIndicator": "false"
        },
        "specialFactors": {
          "agentOrangeInd": "false",
          "envContaminantsInd": "false",
          "campLejeuneInd": "false",
          "radiationExposureInd": "false"
        }
      },
      "insuranceList": {
        "insurance": {
          "companyName": "Medicare",
          "enrolledInPartA": "false",
          "enrolledInPartB": "false",
          "insuranceMappingTypeName": "MDCR"
        }
      },
      "militaryServiceInfo": {
        "disabilityRetirementIndicator": "false",
        "dischargeDueToDisability": "false",
        "militaryServiceSiteRecords": {
          "militaryServiceSiteRecord": {
            "militaryServiceEpisodes": {
              "militaryServiceEpisode": {
                "endDate": "06/28/2015",
                "serviceBranch": "4",
                "startDate": "08/08/2004",
                "dischargeType": "1"
              }
            },
            "site": "565GC"
          }
        }
      },
      "prisonerOfWarInfo": {
        "powIndicator": "false"
      },
      "purpleHeart": {
        "indicator": "false"
      },
      "personInfo": {
        "firstName": "JOE",
        "middleName": "F",
        "lastName": "SNUFFY",
        "ssnText": "101111001",
        "gender": "F",
        "dob": "12/31/1969",
        "mothersMaidenName": "Young",
        "placeOfBirthCity": "Mt Vernon",
        "placeOfBirthState": "MO"
      }
    },
    "applications": {
      "applicationInfo": {
        "appDate": "2015-12-21",
        "appMethod": "1"
      }
    }
  },
  "identity": {
    "authenticationLevel": {
      "type": "100",
      "value": "anonymous"
    }
  }
}
```
* Click _Try it out!_
* If the submit succeeds, you should see a section called _Response Body_ with a JSON response similar to:
```json
{
  "status": "100",
  "formSubmissionId": 3623515904,
  "message": {
    "type": "Form successfully received for EE processing"
  },
  "timeStamp": "2016-05-11T15:48:24.216-05:00"
}
```

##### Retrieve a status
* Find and click on _GET /VoaServices/status_ to expand section
* In the _request_ field, enter `{"formSubmissionId":3623515904}` (this is the value that came from the previous _submit)
* Click _Try it out!_
* If the request succeeds, you should see a section called _Response Body_ with a JSON response similar to:
```json
{
  "status": "104",
  "formSubmissionId": 3623515904,
  "timeStamp": "2016-05-11T15:49:10.885-05:00"
}
```

##### Get a fault code from a form submission
* Find and click on _GET /VoaServices/submit_ to expand section
* From copy the form from the previous _submit_ example and change `"dob": "12/31/1969"` to `"dob": "1/1/1969"`
* Click _Try it out!_
* You should see a section called _Response Body_ with a JSON response similar to:
```json
{
  "error": {
    "name": "Error",
    "status": 500,
    "message": "S:Server: formSubmissionException",
    "root": {
      "Envelope": {
        "Body": {
          "Fault": {
            "faultcode": "S:Server",
            "faultstring": "formSubmissionException",
            "detail": {
              "VoaFaultException": {
                "faultExceptions": {
                  "faultException": {
                    "code": "VOA_0238",
                    "message": "Invalid Veteran date of birth."
                  }
                }
              }
            }
          }
        }
      }
    },
    "response": {
      "statusCode": 500,
      "body": "<?xml version='1.0' encoding='UTF-8'?><S:Envelope xmlns:S=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Body><S:Fault xmlns:ns4=\"http://www.w3.org/2003/05/soap-envelope\"><faultcode>S:Server</faultcode><faultstring>formSubmissionException</faultstring><detail><VoaFaultException:VoaFaultException xmlns:ns2=\"http://jaxws.webservices.esr.med.va.gov/schemas\" xmlns=\"http://va.gov/schema/esr/voa/v1\" xmlns:VoaFaultException=\"http://va.gov/schema/esr/voa/v1\"><faultExceptions><faultException><code>VOA_0238</code><message>Invalid Veteran date of birth.</message></faultException></faultExceptions></VoaFaultException:VoaFaultException></detail></S:Fault></S:Body></S:Envelope>",
      "headers": {
        "date": "Wed, 11 May 2016 20:50:19 GMT",
        "server": "Apache/2.2.3 (Red Hat) DAV/2 mod_auth_pgsql/2.0.3 PHP/5.1.6 mod_python/3.2.8 Python/2.4.3 mod_ssl/2.2.3 OpenSSL/0.9.8e-fips-rhel5 SVN/1.6.11 mod_perl/2.0.4 Perl/v5.8.8",
        "x-wily-servlet": "Clear appServerIp=10.224.132.209&agentName=MS01&servletName=WSServlet&agentHost=vhaesrapp4&agentProcess=WebLogic",
        "x-powered-by": "Servlet/2.5 JSP/2.1",
        "x-wily-info": "Clear guid=A195A4110AE084D159BE1CDFAD15F0D4",
        "connection": "close",
        "transfer-encoding": "chunked",
        "content-type": "text/xml; charset=utf-8"
      },
      "request": {
        "uri": {
          "protocol": "https:",
          "slashes": true,
          "auth": null,
          "host": "vaww.esrpre-prod.aac.va.gov",
          "port": 443,
          "hostname": "vaww.esrpre-prod.aac.va.gov",
          "hash": null,
          "search": null,
          "query": null,
          "pathname": "/voa/voaSvc",
          "path": "/voa/voaSvc",
          "href": "https://vaww.esrpre-prod.aac.va.gov/voa/voaSvc"
        },
        "method": "POST",
        "headers": {
          "User-Agent": "loopback-connector-soap/2.4.0",
          "Accept": "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
          "Accept-Encoding": "none",
          "Accept-Charset": "utf-8",
          "Connection": "close",
          "Host": "vaww.esrpre-prod.aac.va.gov",
          "Content-Length": 4769,
          "Content-Type": "text/xml; charset=utf-8",
          "SOAPAction": "\"\""
        }
      }
    },
    "body": "<?xml version='1.0' encoding='UTF-8'?><S:Envelope xmlns:S=\"http://schemas.xmlsoap.org/soap/envelope/\"><S:Body><S:Fault xmlns:ns4=\"http://www.w3.org/2003/05/soap-envelope\"><faultcode>S:Server</faultcode><faultstring>formSubmissionException</faultstring><detail><VoaFaultException:VoaFaultException xmlns:ns2=\"http://jaxws.webservices.esr.med.va.gov/schemas\" xmlns=\"http://va.gov/schema/esr/voa/v1\" xmlns:VoaFaultException=\"http://va.gov/schema/esr/voa/v1\"><faultExceptions><faultException><code>VOA_0238</code><message>Invalid Veteran date of birth.</message></faultException></faultExceptions></VoaFaultException:VoaFaultException></detail></S:Fault></S:Body></S:Envelope>",
    "stack": "Error: S:Server: formSubmissionException\n    at WSDL.xmlToObject (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-connector-soap/node_modules/soap/lib/wsdl.js:1449:19)\n    at /Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-connector-soap/node_modules/soap/lib/client.js:270:25\n    at /Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-datasource-juggler/lib/observer.js:171:22\n    at doNotify (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-datasource-juggler/lib/observer.js:98:49)\n    at SOAPConnector.ObserverMixin._notifyBaseObservers (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-datasource-juggler/lib/observer.js:121:5)\n    at SOAPConnector.ObserverMixin.notifyObserversOf (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-datasource-juggler/lib/observer.js:96:8)\n    at cbForWork (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-datasource-juggler/lib/observer.js:161:14)\n    at Request._callback (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-connector-soap/lib/http.js:93:9)\n    at Request.self.callback (/Users/vhaisbstewaj/hca/wha/healthcare-application/node_modules/loopback-connector-soap/node_modules/request/request.js:200:22)\n    at emitTwo (events.js:87:13)"
  }
}
```

Fault codes can be found in the spreadsheet: `Copy.of.VOA.Data.Elements.and.Validation.4.1.xlsx`. (In github as:
https://github.com/department-of-veterans-affairs/vets.gov-team/tree/master/Products/HealthApplication/Discovery/spelunking )

##### `faults.js`
```javascript
const faults = {
  "Fault Code": "Fault Text",
  "0001": "Missing required Field: Veteran Last Name",
  "0002": "Missing required Field: Veteran First Name",
  "0003": "Invalid middle name",
  "0005": "Invalid Veteran other names used",
  "0006": "Invalid Veteran's mother's maiden name",
  "0007": "Missing required Field:  Veteran SSN",
  "0008": "Invalid Veteran SSN value",
  "0009": "Missing required Field:  Veteran Date of Birth",
  "0238": "Invalid Veteran date of birth",
  "0011": "Veteran Date of Birth cannot be a  future date.",
  "0012": "Missing required Field: Veteran's gender",
  "0013": "Invalid Gender value for Veteran",
  "0014": "Invalid City of birth for Veteran",
  "0015": "Invalid State value.",
  "0016": "Missing required Field",
  "0017": "Invalid Marital Status.",
  "0018": "Missing required Field: Type of benefit applied for. ",
  "0020": "Missing required Field: Preferred VA Facility",
  "0021": "Invalid VA Facility",
  "0022": "Invalid ethnicity",
  "0029": "Invalid religion.",
  "0030": "Missing required Field:  Street for Veteran Permanent Address",
  "0031": "Missing required Field:  City for Veteran Permanent Address",
  "0032": "Missing required Field: State or Province for Veteran Permanent Address",
  "0033": "Invalid State or Province for Veteran Permanent Address",
  "0240": "Missing required Field: Country for Veteran Permanent Address",
  "0223": "Invalid country for Veteran Permanent Address",
  "0034": "Missing required Field: Veteran Permanent Address Zip Code",
  "0035": "Invalid Zip Code for  Veteran Permanent Address",
  "0230": "Invalid Zip Code plus 4 for  Veteran Permanent Address",
  "0036": "Invalid Veteran email address. ",
  "0037": "Invalid Veteran Home Phone Number",
  "0038": "Invalid Veteran cellular phone Number",
  "0039": "Missing required Field:  Next of kin last name",
  "0040": "Missing required Field: Next of kin first name",
  "0041": "Invalid street address for next of kin",
  "0042": "Invalid City  for next of kin address",
  "0043": "Invalid State or Province for Next of Kin state",
  "0241": "Missing required Field: Country Next of Kin",
  "0224": "Invalid country for Next of Kin address",
  "0044": "Invalid Zip Code for next of kin Address",
  "0231": "Invalid Zip Code plus 4 for next of kin Address",
  "0045": "Missing required Field: Relationship to Veteran of next of kin",
  "0046": "Invalid relationship value for next of kin",
  "0047": "Invalid next of kin home telephone number",
  "0048": "Invalid next of kin work telephone number",
  "0049": "Missing required Field: Emergency contact last name",
  "0050": "Missing required Field: Emergency contact first name",
  "0051": "Invalid street address for Veteran's emergency contact",
  "0052": "Invalid City  for Veteran's emergency contact address",
  "0053": "Invalid State or Province for Emergency contact address",
  "0242": "Missing required Field:  Country for Emergency contact address",
  "0225": "Invalid country for Emergency contact address",
  "0054": "Invalid Zip Code for emergency contact address",
  "0232": "Invalid Zip Code for emergency contact address",
  "0055": "Missing required Field:  Relationship for emergency contact",
  "0222": "Invalid relationship value for emergency Contact",
  "0056": "Invalid home telephone number for emergency contact",
  "0057": "Invalid emergency contact work phone number.",
  "0059": "Missing required Field: Name of Insurance Company",
  "0060": "Invalid street address for Insurance company",
  "0061": "Invalid City for Insurance company address",
  "0062": "Invalid state or province for insurance company",
  "0243": "Missing required Field: Country for Insurance Company",
  "0226": "Invalid country for insurance company",
  "0063": "Invalid zip code for insurance company",
  "0233": "Invalid zip code plus 4 for insurance company",
  "0064": "Invalid phone number for insurance company",
  "0065": "Missing required Field:  Name of Insurance policy holder",
  "0066": "Missing required Field:  Insurance policy number or group code",
  "0068": "Missing required Field: Medicaid eligibility",
  "0069": "Missing required Field: Medicare Insurance Part A enrollment.",
  "0070": "Missing required Field: Effective date of Medicare Insurance Part A enrollment ",
  "0071": "Invalid Medicare part A effective date",
  "0072": "Missing required Field: Medicare Insurance Part B enrollment.",
  "0227": "Invalid medicare enrollment.  If enrolled in Medicare Part B, then Part A enrollment and Part A enrollment effective date must be provided.  ",
  "0073": "Missing required Field: Effective date of Medicare Insurance Part B enrollment ",
  "0074": "Missing required Field: Name on Medicare card",
  "0075": "Missing required Field: Medicare claim number",
  "0076": "Missing required Field:  Veteran's employment status",
  "0077": "Invalid employment status ",
  "0078": "Missing required field: Veteran date of retirement",
  "0079": "Invalid date of retirement for Veteran",
  "0080": "Missing required field: Name of Veteran's employer",
  "0081": "Missing required field: Address of Veteran's employer",
  "0082": "Invalid street address for Veteran’s employer",
  "0083": "Missing required field: City of Veteran's employer",
  "0084": "Missing required field: State or province for Veteran's employer",
  "0085": "Invalid state or province for Veteran's employer",
  "0244": "Missing required field: Country for Veteran's employer",
  "0228": "Invalid country for Veteran's employer",
  "0086": "Missing required field: Zip Code of Veteran's employer",
  "0087": "Invalid zip code for Veteran's employer",
  "0234": "Invalid zip code plus 4 for Veteran's employer",
  "0088": "Invalid phone number for  Veteran's employer",
  "0089": "Missing required field: Spouse's employment status",
  "0090": "Missing required field: Spouse's date of retirement",
  "0091": "Invalid date of retirement for spouse",
  "0092": "Missing required field: Name of Spouse's employer ",
  "0093": "Invalid value for the Name of Spouse's employer ",
  "0094": "Missing required field: Street address of Spouse's employer",
  "0095": "Invalid value for Street address of Spouse's employer",
  "0096": "Missing required field: City of Spouse's employer",
  "0097": "Invalid value for City of Spouse's employer",
  "0098": "Invalid value for State or Province for Spouse's employer",
  "0099": "Missing required field: State or Pronince for Spouse's employer",
  "0237": "Missing required field: Country of Spouse's employer",
  "0245": "Invalid country for Spouse's employer",
  "0100": "Invalid zip code for Spouse's employer",
  "0235": "Invalid zip code plus 4 for Spouse's employer",
  "0101": "Missing required field: Zip code for Spouse's employer",
  "0102": "Invalid phone number for Spouse's employer",
  "0103": "Missing required Field:  Last branch of service",
  "0104": "Invalid Branch of service entered",
  "0105": "Missing required Field:  Last service entry date",
  "0106": "Invalid format for Last Service Entry Date",
  "0107": "Missing required Field:  Last service discharge date",
  "0108": "Invalid format for Last Service Discharge Date",
  "0109": "Missing required Field: Type of Discharge",
  "0110": "Invalid discharge type value",
  "0111": "Invalid value for military service number. Value must be between 1 and 10 characters in length. ",
  "0113": "Missing required field:  Spouse last name",
  "0114": "Invalid Spouse last name",
  "0115": "Missing required field:  Spouse first name",
  "0116": "Invalid Spouse first name",
  "0117": "Invalid Spouse middle name",
  "0119": "Invalid Spouse maiden name or other names used",
  "0120": "Missing required field:  Spouse Social Security Number",
  "0121": "Invalid value for Spouse's Social Security Number",
  "0122": "Missing required field:  Spouse's Date of Birth",
  "0123": "Invalid Spouse date of birth",
  "0124": "Yr required if Marr/Sep, or spouse entered.",
  "0125": "Missing required Field: Did your spouse live with you last year",
  "0127": "Value outside range of  0 to 9999999.99 for amount you contributed last calendar year to support spouse",
  "0128": "Missing required Field: Spouse street address",
  "0129": "Missing required Field: City for Spouse address",
  "0130": "Missing required field: State or province for Spouse address",
  "0131": "Invalid state or province for Spouse address",
  "0246": "Missing required field: Country for Spouse address",
  "0229": "Invalid country for Spouse address",
  "0132": "Missing required field: Zip code for Spouse address",
  "0133": "Invalid Zip Code for spouse's address",
  "0236": "Invalid Zip Code plus 4 for spouse's address",
  "0134": "Invalid phone number for spouse",
  "0135": "Missing required field:  child's last name",
  "0136": "Invalid value for Child's last name",
  "0137": "Missing required field:  Child's first name",
  "0138": "Invalid value for Child's first name",
  "0139": "Invalid value for Child's middle name",
  "0141": "Missing required Field: Child's relationship to Veteran ",
  "0142": "Invalid value for child's relationship to Veteran ",
  "0143": "Missing required Field: Child's SSN ",
  "0144": "Invalid Child's SSN value ",
  "0145": "Missing required Field: Date child became your dependent ",
  "0146": "Invalid date when child became dependent ",
  "0147": "Date child became dependent cannot be a future date ",
  "0148": "Missing required Field: Child's date of birth ",
  "0149": "Invalid child's date of birth ",
  "0150": "Child's date of birth cannot be a future date ",
  "0151": "Missing required Field: Was child permanently and totally disabled before age of 18 ",
  "0154": "Value outside range of  0 to 9999999.99 for expenses paid by child for college, vocational rehabilitation or training",
  "0156": "Missing required Field: Did your child live with you last year",
  "0158": "Value outside range of  0 to 9999999.99 for amount you contributed last calendar year to support child",
  "0160": "Missing required Field: Gross annual income from employment for Veteran",
  "0161": "Value outside range of  0 to 9999999.99 for gross annual income from employment for Veteran",
  "0163": "Missing required Field: Gross annual income from employment for spouse ",
  "0164": "Value outside range of  0 to 9999999.99 for gross annual income from employment for spouse ",
  "0166": "Missing required Field: Gross annual income from employment for child ",
  "0167": "Value outside range of  0 to 9999999.99 for gross annual income from employment for child ",
  "0169": "Missing required Field: Net income from property or business for Veteran",
  "0170": "Value outside range of  0 to 9999999.99 for net income from property or business for Veteran",
  "0172": "Missing required Field: Net income from property or business for spouse ",
  "0173": "Value outside range of  0 to 9999999.99 for net income from property or business for spouse ",
  "0175": "Missing required Field: Net income from property or business for child ",
  "0176": "Value outside range of  0 to 9999999.99 for  net income from property or business for child ",
  "0178": "Missing required Field: List other income amounts for Veteran",
  "0179": "Value outside range of  0 to 9999999.99 for list other income amounts for Veteran",
  "0181": "Missing required Field:  List other income amounts for spouse ",
  "0182": "Value outside range of  0 to 9999999.99 for list other income amounts for spouse ",
  "0184": "Missing required Field: List other income amounts for child ",
  "0185": "Value outside range of  0 to 9999999.99 for list other income amounts for child ",
  "0187": "Missing required Field: Total non-reimbursed medical expense paid by Veteran or spouse",
  "0188": "Value outside range of  0 to 9999999.99 for  total non-reimbursed medical expense paid by Veteran or spouse",
  "0190": "Missing required Field: Amount you paid last calendar year for burial expenses",
  "0191": "Value outside range of  0 to 9999999.99 for amount you paid last calendar year for burial expenses",
  "0193": "Missing required Field: Amount you paid last calendar year for educational expenses",
  "0194": "Value outside range of  0 to 9999999.99 for amount you paid last calendar year for educational expenses",
  "0196": "Missing required field: Cash, amount in back accounts for Veteran",
  "0197": "Value outside range of  0 to 9999999.99 for cash, amount in back accounts for Veteran",
  "0199": "Missing required field: Cash, amount in back accounts for spouse ",
  "0200": "Value outside range of  0 to 9999999.99 for cash, amount in back accounts for spouse  ",
  "0202": "Missing required field: Cash, amount in back accounts for child ",
  "0203": "Value outside range of  0 to 9999999.99 for cash, amount in back accounts for child  ",
  "0205": "Missing required field: Market value of land/buildings/lien for Veteran",
  "0206": "Value outside range of  0 to 9999999.99 for market value of land/buildings/lien for Veteran",
  "0208": "Missing required field: Market value of land/buildings/lien for spouse ",
  "0209": "Value outside range of  0 to 9999999.99 for market value of land/buildings/lien for spouse ",
  "0211": "Missing required field: Market value of land/buildings/lien for child ",
  "0212": "Value outside range of  0 to 9999999.99 for market value of land/buildings/lien for child ",
  "0214": "Missing required field: Value of other property or assets for Veteran",
  "0215": "Value outside range of  0 to 9999999.99 for value of other property or assets for Veteran",
  "0217": "Missing required field:  Value of other property or assets for spouse ",
  "0218": "Value outside range of  0 to 9999999.99 for  value of other property or assets for spouse ",
  "0220": "Missing required field: Value of other property or assets for child ",
  "0221": "Value outside range of  0 to 9999999.99 for value of other property or assets for child ",
  "0239": "VOA system is currently not available",
  "0248": "Missing required field for 10-10EZ Application:  Application Date",
  "0249": "VOA Anonymous/Level1 Process Indicator is false:  Please forward the application to facility",
  "0250": "Missing required field: Authentication Level for VOA Application is required:  Please enter your authentication level",
  "0251": "Missing required field: Fully qualified Identifier is required for Assurance Level 1 and above:  Please enter your ID",
  "0252": "Missing required field: COVERAGE UNDER THE AFFORDABLE CARE ACT",
  "0253?": "Missing required field: Demobilizing State",
  "0254?": "Invalid Demobilizing State",
  "0255?": "Missing required field: Demobilizing Site",
  "0256?": "Invalid Demobilizing Site",
  "0257?": "Missing Required field: Date released from Active duty",
  "0258?": "Invalid Date released from Active duty",
  "0259? Confirm with George/ Shaopeng first": "Invalid Race",
};
```

### Docker
#### Environment setup
Docker is being used for production deploys of this application. The Dockerfile
builds an Alpine Linux based node environment.

On OsX and Windows, Docker does not yet have native kernel support. Instead, a
wrapper program `docker-machine` is used to boot a minimal linux virtual machine
that then executes the docker commands. To set this up, just run
```
docker-machine start
```

This starts the `default` Docker virtual machine (previously known as boot2docker)
This should only need to be done once per boot of your actual machine since the
VM continues to run in the background.

Note that the result of all docker builds are actually housed within this
virtual machine and over time you can run it out of diskspace. Search
online for instructions for handling such a situation.

Aftr the machine has started, ensure the environment variables necessary for
connecting to the machine are set by running
```
eval $(docker-machine env)
```

To find the IP address of the docker-machine, run
```
docker-machine ip
```


#### Building the container
To build a new container tagged `awongdev/hca-staging`, from the root of the repostiory run:

```
scripts/make-docker.sh
```


#### Running the container
To run the built container:
```
scripts/run-docker.sh
```
