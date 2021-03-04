import { APIWorker } from '../../axios';

export async function GetAllProjects_Action(PageNumber, ItemPerPage, SearchString){
    const query = `PageNumber=${PageNumber}&ItemPerPage=${ItemPerPage}`;
    const search = SearchString ? `&ProjectName=${SearchString}` : '';
    const results = await APIWorker.callAPI('get', `/main-business/v1/project-management/projects?` + query + search);
          
    return results;
}