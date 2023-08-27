public with sharing class demoIntegrationForWisely {
    @AuraEnabled
    public static string getMockData(){
        try {
            Http http = new http();
            HttpRequest req = new HttpRequest();
            req.setMethod('GET');
            req.setEndpoint('https://wisely-fit.mule.adp.com/Demo1/demo1');
            req.setHeader('Host', 'wisely-fit.mule.adp.com');            
            req.setHeader('Postman-Token', 'f1d8209c-23c5-4dc6-ac7c-b38543e655c8');
            req.setHeader('Connection', 'keep-alive');

            System.debug('REQUEST--------> '+ req);
            HttpResponse resp = http.send(req);
            
            System.debug('Response from API--------> '+ resp.getBody());
            

            
            
        } catch (Exception e) {
            System.debug('ERROOOOR Response from API--------> '+ e.getCause() + e.getMessage());
        }
        return null;
    }
}