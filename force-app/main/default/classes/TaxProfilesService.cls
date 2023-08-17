public with sharing class TaxProfilesService {
    @AuraEnabled(cacheable=true)
    public static List<Tax_Profile__c> getAllTaxProfiles(){
        return [SELECT Company__c, Company__r.Name, EFC_Indicator__c, ER_Type__c, FEIN__c, Filing_Id__c, Id,
        Kind_Of_ER__c, Name, Pay_Frequency__c, Profile__c, Quarter__c, Seasonal__c, 
        SystemModstamp, Tax_Type__c, X1099_Type__c, Year__c
        FROM Tax_Profile__c with security_enforced ORDER BY Year__c ASC , Quarter__c ASC , Profile__c ASC];
    }

    @AuraEnabled
    public static List<Tax_Profile__c>  getFiltertedTaxProfiles(string year, string quarter, string profile, string taxType){
        try {
            string query = 'SELECT Company__c, Company__r.Name, EFC_Indicator__c, ER_Type__c, FEIN__c, Filing_Id__c, Id, Kind_Of_ER__c, Name,' 
            + 'Pay_Frequency__c, Profile__c, Quarter__c, Seasonal__c, '
            + 'Tax_Type__c, X1099_Type__c, Year__c FROM Tax_Profile__c ';

            System.debug('Input YEAR '+ year);
            System.debug('Input quarter '+ quarter);
            System.debug('Input profile '+ profile);
            System.debug('Input taxType '+ taxType);

            if(year != ''){
                query = query + ' where year__c = :year ';
            }
            if (quarter != ''){
                if(query.contains('where')){
                    query = query + 'and Quarter__c = :quarter ';
                }
                else{
                    query = query + 'where Quarter__c = :quarter ';
                }
            }
            if (profile != ''){
                if(query.contains('where')){
                    query = query + 'and Profile__c = :profile ';
                }
                else{
                    query = query + 'where Profile__c = :profile ';
                }
            }
            if (taxType != ''){
                if(query.contains('where')){
                    query = query + 'and Tax_Type__c = :taxType ';
                }
                else{
                    query = query + 'where Tax_Type__c = :taxType ';
                }
            }
            System.debug('SOQL QUERY: '+ query);
            List<Tax_Profile__c> returnList = Database.query(query);
            return returnList;
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}