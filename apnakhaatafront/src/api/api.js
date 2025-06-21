import axios from 'axios';
export const api = axios.create({ baseURL: 'http://localhost:8085' });

console.log(api)
// Accounts
export const fetchAccounts = () => api.get('/accounts/list').then(r => r.data);
export const createAccount = data => api.post('/accounts/create', data).then(r => r.data);

// Drafts
export const fetchDrafts = () => api.get('/draftBill/list').then(r => r.data);
export const fetchDraft = id => api.get(`/draftBill/${id}`).then(r => r.data);
export const createDraft = data => api.post('/draftBill/create', data).then(r => r.data);
export const updateDraft = data => api.post('/draftBill/update', data).then(r => r.data);

// Release & Bills
export const releaseBill = ({ draftId, reductionPercentage }) =>
    api.post('/bills/release', { draftId, reductionPercentage }).then(r => r.data);
export const fetchBill = id => api.get(`/bills/${id}`).then(r => r.data);

// Address Caps
export const fetchAddressCaps = () =>
    api.get('/addressCap/listCaps').then(r => r.data);
export const upsertAddressCap = cap =>
    api.post('/addressCap/insertCap', cap).then(r => r.data);

export const fetchAddressCap = address =>
    api.get(`/addressCap/${encodeURIComponent(address)}`).then(res => res.data);

// Raw Materials
export const fetchRawMaterials = () =>
    api.get('/rawMaterial/list').then(r => r.data);
export const createRawMaterial = data =>
    api.post('/rawMaterial/insert', {
        name:            data.name,
        quantityOnHand:  data.initialQuantity,
        minThreshold:    data.minThreshold
    }).then(r => r.data);

export const adjustRawMaterial = m =>
    api.post('/rawMaterial/adjust', m).then(r => r.data);

export const fetchRawMaterial      = id => api.get(`/rawMaterial/${id}`).then(r => r.data);

// Recipes
export const fetchRecipes = () => api.get('/recipe/list').then(r => r.data);
export const createRecipe = data => api.post('/recipe/create', data).then(r => r.data);

export const fetchRecipe = id => api.get(`/recipe/${id}`).then(r => r.data);
export const updateRecipe  = data => api.put('/recipe/create', data).then(r => r.data);

// Alerts
export const fetchAlerts = () => api.get('/alert/check').then(r => r.data);

export const fetchOverview     = () => api.get('/overview/list').then(r => r.data);
export const fetchActivities   = () => api.get('/activity/list').then(r => r.data);

// at bottom of file
export const fetchAccount       = id => api.get(`/accounts/${id}`).then(r => r.data);
export const fetchAccountTxns   = id => api.get(`/accounts/transactions/${id}`).then(r => r.data);

// Bills (released)
export const fetchBills = () =>
    api.get('/bills/list').then(r => r.data);


export const fetchSalesOverview = () => {
    return api.get('/reports/overview').then(r => r.data)
}

export const fetchSalesTrends = period => {
    return api.get(`/reports/trends/${period}`).then(r => r.data)
}

export const fetchInventoryStatus = () => {
    return api.get('/reports/inventory').then(r => r.data)
}

export const fetchConsumption = period => {
    return api.get(`/reports/consumption/${period}`).then(r => r.data)
}

export const fetchItemTrend = period => {
    return api.get(`/reports/itemTrends/${period}`).then(r => r.data)
}

