const getLocalData=(key)=>{
    try{
        let data=localStorage.getItem(key)
        data=JSON.parse(data)
        return data
    } catch(err){
        return null
    }
}

const saveLocalData=(key,value)=>{
    localStorage.setItem(key,JSON.stringify(value))
}

function convertDateFormat(inputDate) {
    if (!inputDate){
        return
    }
    // Split the input date string by the hyphen
    const [year, month, day] = inputDate.split('-');
    
    // Return the date in the dd/mm/yyyy format
    return `${day}/${month}/${year}`;
  }

export {getLocalData, saveLocalData,convertDateFormat}