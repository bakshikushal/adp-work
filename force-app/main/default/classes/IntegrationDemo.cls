public with sharing class IntegrationDemo {
    @AuraEnabled
    public static string getDemoData(string branch, string companyCode, integer year, integer quarter ){
        try {
// ?branch=ST&companyCode=BI01&year=2019&quarterStart=1&quarterEnd=1
            http http = new http();
            httpRequest req = new httpRequest();
            System.debug('&&&&&&********INPUTS RECEIVED '+branch + companyCode + year + quarter);
            req.setEndpoint('callout:Tax_Profile'+'?branch='+ branch+ '&companyCode=' + companyCode+ '&year=' + year+ '&quarterStart=' + quarter+ '&quarterEnd=' + quarter);
            req.setMethod('GET');
            req.setHeader('Content-Type', 'application/json');
            req.setHeader('Accept', 'application/json');
            System.debug('Request TO TAX PROFILE API: ' + req);
            HttpResponse resp = http.send(req);
            return resp.getBody();
            
        } catch (Exception e) {
            System.debug('ERROR Response from Mock API: ' + e.getCause() + e.getMessage());
            return e.getMessage();
        }
        
    }  

    public static string getAccessToken(){
        http http = new http();
        httpRequest req = new httpRequest();
        req.setEndpoint('https://login.microsoftonline.com/4c2c8480-d3f0-485b-b750-807ff693802f/oauth2/v2.0/token');
        string body = 'grant_type=client_credentials&client_id=3d4d13a0-6a2c-4034-a9db-6709da75c923&client_secret=sz48Q~9ZaPUcZ4gL9yUHcsKD8-z5EF0aHaLl9cxf&scope=api://3d4d13a0-6a2c-4034-a9db-6709da75c923/.default';
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setMethod('POST');
        req.setBody(body);
        System.debug('Request TO Token API: ' + req.getBody());
        HttpResponse resp = http.send(req);
        System.debug('Response from token API: ' + resp.getBody());
        Map<String,Object> token_response = (Map<String,Object>) Json.deserializeUntyped(resp.getBody());
        string accessToken = (String) token_response.get('access_token');
        return accessToken;

    }

    public static void callStatesApi(String token){
        http http = new http();
        httpRequest req = new httpRequest();
        req.setEndpoint('https://ws.crmp.fit.es.oneadp.com/salesforce/ceh/taxprofile/tax-profile/v1/local/stateslist?branch=ST&companyCode=BI01&year=2019&quarterStart=1&quarterEnd=1');
        string body = 'grant_type=client_credentials&client_id=3d4d13a0-6a2c-4034-a9db-6709da75c923&client_secret=sz48Q~9ZaPUcZ4gL9yUHcsKD8-z5EF0aHaLl9cxf&scope=api://3d4d13a0-6a2c-4034-a9db-6709da75c923/.default';
        req.setHeader('Authorization', 'Bearer '+ token);
        req.setHeader('Application', 'SBS-POC');
        req.setHeader('adpaid', '123');
        req.setMethod('GET');
        // req.setBody(body);
        System.debug('Request TO WISELY API: ' + req);
        System.debug('passed access token: ' + req.getHeader('Authorization'));
        HttpResponse resp = http.send(req);
        System.debug('Response from WISELY API: ' + resp.getBody());

    }

   


}