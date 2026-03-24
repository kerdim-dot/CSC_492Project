function GraduationConverter(date){
    
    const splitDate = date.split("-");
    if(2<splitDate[1] || splitDate[1] >7){
        return "1/"+splitDate[0];
    }
    else{
        return "2/"+splitDate[0];
    }
}

export {GraduationConverter};