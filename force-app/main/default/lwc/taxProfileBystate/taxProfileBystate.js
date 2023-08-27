import { LightningElement, api, wire} from 'lwc';
import getDemoData from '@salesforce/apex/IntegrationDemo.getDemoData';

const COLS = [
    { label: 'Type', fieldName: 'type' },
    { label: 'State Name(Long)', fieldName: 'longName'},
    { label: 'State Name', fieldName: 'stateName'},
    { label: 'State Code', fieldName: 'state'},
    { label: 'Code', fieldName: 'stateCode'}
];

export default class TaxProfileBystate extends LightningElement {
    yearSelected = '';
    quarterSelected = '';
    profileSelected = '';
    taxTypeSelected = '';
    stateSelected = '';
    defaultRecordId;
    // yearOptions;
    // quarterOptions;
    // profileOptions;
    // taxTypeOptions;
    taxData=[];
    taxDataFull;
    columns = COLS;
    isLoading= false;
    showData=false;
    showError=false;
    showStateLookup = false;
    stateOptions;
    
    get yearOptions() {
        return [
            { label: '2019', value: '2019' },
            { label: '2020', value: '2020' },
            { label: '2021', value: '2021' },

        ];
    }

    get quarterOptions() {
        return [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' }
        ];
    }

    get profileOptions() {
        return [
            { label: 'State', value: 'ST' },
            { label: 'Federal', value: 'FD' },
            { label: 'Local', value: 'LC' },
        ];
    }

    get taxTypeOptions() {
        return [
            { label: 'BI01', value: 'BI01' }
        ];
    }

    handleYearChange(event){
        this.yearSelected = event.target.value;
    }
    handleProfileChange(event){
        // console.log('PROFILE SELECTED: ', JSON.stringify(event.target.value));
        let profile = event.detail.value;
        // this.profileSelected= profile[1];
        console.log('profile : ',profile);
        this.profileSelected = profile[0];
        console.log('profileSelected : ',this.profileSelected);

    }
    handleQuarterChange(event){
        this.quarterSelected = event.target.value;
    }
    handleTaxChange(event){
        this.taxTypeSelected = event.target.value;
    }

    handleStateChange(event){
        this.stateSelected = event.target.value;
    }

    handleApply(){
        console.log('Selected Year : ',this.yearSelected);
        console.log('Selected Profile : ',this.profileSelected);
        console.log('Selected Quarter : ',this.quarterSelected);
        console.log('Selected Tax : ',this.taxTypeSelected);
        this.isLoading = true;
        getDemoData({branch:this.profileSelected, companyCode: this.taxTypeSelected, year:this.yearSelected,  quarter:this.quarterSelected})
            .then(result => {
                console.log('SOQL QUERY RETURNED: ',result);
                let response = JSON.parse(result);
                console.log('SOQL QUERY RETURNED: ',response);
                console.log('SOQL QUERY RETURNED: ',response.states);
                this.taxData = response.states;
                this.isLoading = false;
                this.showData=true;
                this.showError=false;
                const stateopts = this.taxData.map(state => {
                    return { label: state.longName, value: state.stateCode }
                })
                this.stateOptions = stateopts;
                this.showStateLookup = true;
            })
            .catch(error => {
                console.log('ERROR FROM APEX CLASS : ',error);
                this.isLoading = false;
                this.showData=false;
                this.showError=true;
                this.showStateLookup = false;
            });
    }

    handleReset(){
        console.log('IN RESET : ');
        this.yearSelected = '';
        this.profileSelected = '';
        this.quarterSelected = '';
        this.taxTypeSelected = '';
        
        console.log('Tax Data : ',this.taxData);
        console.log('Tax Data FULL: ',this.taxDataFull);

        this.taxData = [];
        this.showData=false;
        this.showStateLookup = false;
    }



}