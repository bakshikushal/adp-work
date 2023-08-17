import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import TAX_OBJECT from "@salesforce/schema/Tax_Profile__c";
import YEAR_FIELD from "@salesforce/schema/Tax_Profile__c.Year__c";
import QUARTER_FIELD from "@salesforce/schema/Tax_Profile__c.Quarter__c";
import PROFILE_FIELD from "@salesforce/schema/Tax_Profile__c.Profile__c";
import TAXTYPE_FIELD from "@salesforce/schema/Tax_Profile__c.Tax_Type__c";
import getAllTaxProfiles from '@salesforce/apex/TaxProfilesService.getAllTaxProfiles';
import getFiltertedTaxProfiles from '@salesforce/apex/TaxProfilesService.getFiltertedTaxProfiles';

const COLS = [
    { label: 'Company', fieldName: 'AccountName' },
    { label: 'Year', fieldName: 'Year__c'},
    { label: 'Quarter', fieldName: 'Quarter__c'},
    { label: 'Profile', fieldName: 'Profile__c'},
    { label: 'Seasonal', fieldName: 'Seasonal__c'},
    { label: 'EFC Indicator', fieldName: 'EFC_Indicator__c' },
    { label: 'ER Type', fieldName: 'ER_Type__c'},
    { label: 'FEIN', fieldName: 'FEIN__c'},
    { label: 'Filing Id', fieldName: 'Filing_Id__c'},
    { label: 'Kind Of ER', fieldName: 'Kind_Of_ER__c'},
    { label: 'Pay Frequency c', fieldName: 'Pay_Frequency__c'},
    { label: 'Tax Type', fieldName: 'Tax_Type__c'},
    { label: 'X1099 Type ', fieldName: 'X1099_Type__c'},
];

export default class TaxProfiles extends LightningElement {
    yearSelected = '';
    quarterSelected = '';
    profileSelected = [];
    taxTypeSelected = '';
    defaultRecordId;
    yearOptions;
    quarterOptions;
    profileOptions;
    taxTypeOptions;
    taxData;
    taxDataFull;
    columns = COLS;
    

    @wire(getObjectInfo, { objectApiName: TAX_OBJECT })
    getRecordType({data, error}){
        if(data){
            this.defaultRecordId = data.defaultRecordTypeId;
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$defaultRecordId', fieldApiName: YEAR_FIELD })
    yearFieldOptions(data){
       if(data){
           this.yearOptions = data?.data?.values;
       }
    }

    @wire(getPicklistValues, { recordTypeId: '$defaultRecordId', fieldApiName: QUARTER_FIELD })
    quarterFieldOptions(data){
       if(data){
           this.quarterOptions = data?.data?.values;
       }
    }

    @wire(getPicklistValues, { recordTypeId: '$defaultRecordId', fieldApiName: PROFILE_FIELD })
    profileFieldOptions(data){
       if(data){
           this.profileOptions = data?.data?.values;
       }
    }

    @wire(getPicklistValues, { recordTypeId: '$defaultRecordId', fieldApiName: TAXTYPE_FIELD })
    taxFieldOptions(data){
       if(data){
           this.taxTypeOptions = data?.data?.values;
       }
    }

    @wire(getAllTaxProfiles, {})
    getAllTaxProfiles ({error, data}) {
        if (error) {
        }
        if (data) {
            const tempData = data;
            this.taxData = tempData.map((tax)=>{
                return {
                    ...tax,
                    "AccountName" : tax.Company__r.Name
                }
            });
            this.taxDataFull = [...this.taxData];
        }
    }

    handleYearChange(event){
        this.yearSelected = event.target.value;
    }
    handleProfileChange(event){
        this.profileSelected = event.target.value;
    }
    handleQuarterChange(event){
        this.quarterSelected = event.target.value;
    }
    handleTaxChange(event){
        this.taxTypeSelected = event.target.value;
    }

    handleProfileChangeCheckbox(event){
        console.log('Profile Selected Checked : ',JSON.stringify(event.target.value));
        this.profileSelected = event.target.value;
    }

    handleApply(){
        console.log('Selected Year : ',this.yearSelected);
        console.log('Selected Profile : ',this.profileSelected);
        console.log('Selected Quarter : ',this.quarterSelected);
        console.log('Selected Tax : ',this.taxTypeSelected);
        getFiltertedTaxProfiles({year:this.yearSelected, quarter:this.quarterSelected, profile:this.profileSelected, taxType: this.taxTypeSelected})
            .then(result => {
                console.log('SOQL QUERY RETURNED: ',result);
                const tempData = result;
                this.taxData = tempData.map((tax)=>{
                return {
                    ...tax,
                    "AccountName" : tax.Company__r.Name
                }
            });
            })
            .catch(error => {
                console.log('ERROR FROM APEX CLASS : ',error);
            });
    }

    handleReset(){
        console.log('IN RESET : ');
        this.yearSelected = '';
        this.profileSelected = [];
        this.quarterSelected = '';
        this.taxTypeSelected = '';
        
        console.log('Tax Data : ',this.taxData);
        console.log('Tax Data FULL: ',this.taxDataFull);

        this.taxData = [...this.taxDataFull];
    }

    

}