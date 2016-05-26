Template.navigation.helpers({
    companyName() {
        if (process.env.COMPANY_NAME) return process.env.COMPANY_NAME;
        else return "foodservice-pro";
    }
})