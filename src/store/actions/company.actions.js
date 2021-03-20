import {companyService} from 'services';
import {companyConstants} from 'store/constants';

export const companyActions= {
  getCompanies,
  addCompany,
  updateCompany,
  updateCompanyStatus
}

function getCompanies(auth){
  return dispatch => {
    return companyService.getCompanies(auth).then(companies=>{
      dispatch({ type: companyConstants.GET_COMPANIES, companies })
      return companies;
    })
  }
}

function addCompany(auth, company){
  return dispatch => {
    return companyService.addCompany(auth, company).then(company=>{
      dispatch({ type: companyConstants.ADD_COMPANY, company })
      return company;
    })
  }
}

function updateCompanyStatus(auth, id, status){
  return dispatch => {
    return companyService.updateCompanyStatus(auth, id, status).then((company)=>{
      dispatch({ type: companyConstants.UPDATE_COMPANY, company })
      return company
    })
  }
}

function updateCompany(auth, id, companyInfos){
  return dispatch => {
    return companyService.updateCompany(auth, id, companyInfos).then((company)=>{
      dispatch({ type: companyConstants.UPDATE_COMPANY, company })
      return company
    })
  }
}