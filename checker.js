const fetch = require("node-fetch");
const axios = require('axios')

let AME = [];
let EUR = [];
let ASI = [];
let AME_prev = [];
let EUR_prev = [];
let ASI_prev = [];
let AME_state = true;
let EUR_state = true;
let ASI_state = true;

async function intervalFunc() {
    console.log('Execute')

    await fetch('https://bda-p2-server.azurewebsites.net/retrieve_data?continent=AME&collection=user')
    .then(response => response.json())
    .then(data => AME = data);

    await fetch('https://bda-p2-server.azurewebsites.net/retrieve_data?continent=EUR&collection=user')
    .then(response => response.json())
    .then(data => EUR = data);

    await fetch('https://bda-p2-server.azurewebsites.net/retrieve_data?continent=ASI&collection=user')
    .then(response => response.json())
    .then(data => ASI = data);

    if(EUR.name == 'MongoNetworkError'){
        EUR_state = false
        console.log('EUR Error')
    } else{
        EUR_state = true
    }

    if(AME.name == 'MongoNetworkError'){
        AME_state = false
        console.log('AME Error')
    } else{
        AME_state = true
    }

    if(ASI.name == 'MongoNetworkError'){
        ASI_state = false
        console.log('ASI Error')
    } else{
        ASI_state = true
    }

    if(AME_prev[0] == undefined && AME_state){
        console.log('AME Initialized')
        AME_prev = AME
    }

    if(EUR_prev[0] == undefined && EUR_state){
        console.log('EUR Initialized')
        EUR_prev = EUR
    }

    if(ASI_prev[0] == undefined && ASI_state){
        console.log('ASI Initialized')
        ASI_prev = ASI
    }

    if((JSON.stringify(EUR_prev) != JSON.stringify(EUR)) || ((JSON.stringify(EUR).length > JSON.stringify(AME).length) || (JSON.stringify(EUR).length > JSON.stringify(ASI).length)) || (JSON.stringify(EUR) != JSON.stringify(AME) || JSON.stringify(EUR) != JSON.stringify(ASI))){
        if(AME_state){
            if(JSON.stringify(EUR).length > JSON.stringify(AME).length){
                let newUsers = EUR.filter(a => !AME.map(b=>b.name).includes(a.name))
                for (i in newUsers){
                    await axios
                    .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=AME', newUsers[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            } if(JSON.stringify(EUR) != JSON.stringify(AME)){
                for(i in EUR){
                    if(JSON.stringify(EUR[i]) != JSON.stringify(AME[i])){
                        await axios
                        .put('https://bda-p2-server.azurewebsites.net/update_missing?continent=AME', EUR[i])
                        .then(res => {
                            i = i + 1
                            console.log(res)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                    }
                }
            }
            AME = EUR
        }
        if(ASI_state){
            if(JSON.stringify(EUR).length > JSON.stringify(ASI).length){
                let newUsers = EUR.filter(a => !ASI.map(b=>b.name).includes(a.name))
                for (i in newUsers){
                    await axios
                    .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=ASI', newUsers[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            } if(JSON.stringify(EUR) != JSON.stringify(ASI)){
                for(i in EUR){
                    if(JSON.stringify(EUR[i]) != JSON.stringify(ASI[i])){
                        await axios
                        .put('https://bda-p2-server.azurewebsites.net/update_missing?continent=ASI', EUR[i])
                        .then(res => {
                            i = i + 1
                            console.log(res)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                    }
                }
            }
            ASI = EUR
        }
        EUR_prev = EUR
        
    }

    if((JSON.stringify(AME_prev) != JSON.stringify(AME)) || ((JSON.stringify(AME).length > JSON.stringify(EUR).length) || (JSON.stringify(AME).length > JSON.stringify(ASI).length)) || (JSON.stringify(AME) != JSON.stringify(EUR) || JSON.stringify(AME) != JSON.stringify(ASI))){
        if(EUR_state){
            if(JSON.stringify(AME).length > JSON.stringify(EUR).length){
                let newUsers = AME.filter(a => !EUR.map(b=>b.name).includes(a.name))
                for (i in newUsers){
                    await axios
                    .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=EUR', newUsers[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            } if(JSON.stringify(AME) != JSON.stringify(EUR)){
                for(i in AME){
                    if(JSON.stringify(AME[i]) != JSON.stringify(EUR[i])){
                        await axios
                        .put('https://bda-p2-server.azurewebsites.net/update_missing?continent=EUR', AME[i])
                        .then(res => {
                            i = i + 1
                            console.log(res)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                    }
                }
            }
            EUR = AME
        }
        if(ASI_state){
            if(JSON.stringify(AME).length > JSON.stringify(ASI).length){
                let newUsers = AME.filter(a => !ASI.map(b=>b.name).includes(a.name))
                for (i in newUsers){
                    await axios
                    .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=ASI', newUsers[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            }
            ASI = AME
        } if(JSON.stringify(AME) != JSON.stringify(ASI)){
            for(i in AME){
                if(JSON.stringify(AME[i]) != JSON.stringify(ASI[i])){
                    await axios
                    .put('https://bda-p2-server.azurewebsites.net/update_missing?continent=ASI', AME[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            }
        }
        AME_prev = AME
        
    }

    if((JSON.stringify(ASI_prev) != JSON.stringify(ASI)) || ((JSON.stringify(ASI).length > JSON.stringify(AME).length) || (JSON.stringify(ASI).length > JSON.stringify(EUR).length)) || (JSON.stringify(ASI) != JSON.stringify(AME) || JSON.stringify(ASI) != JSON.stringify(EUR))){
        if(AME_state){
            if(JSON.stringify(ASI).length > JSON.stringify(AME).length){
                let newUsers = ASI.filter(a => !AME.map(b=>b.name).includes(a.name))
                for (i in newUsers){
                    await axios
                    .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=AME', newUsers[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            }
            AME = ASI
        } if(JSON.stringify(ASI) != JSON.stringify(AME)){
            for(i in ASI){
                if(JSON.stringify(ASI[i]) != JSON.stringify(AME[i])){
                    await axios
                    .put('https://bda-p2-server.azurewebsites.net/update_missing?continent=AME', ASI[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            }
        }
        if(EUR_state){
            if(JSON.stringify(ASI).length > JSON.stringify(EUR).length){
                let newUsers = ASI.filter(a => !EUR.map(b=>b.name).includes(a.name))
                for (i in newUsers){
                    await axios
                    .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=EUR', newUsers[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            }
            EUR = ASI
        } if(JSON.stringify(ASI) != JSON.stringify(EUR)){
            for(i in ASI){
                if(JSON.stringify(ASI[i]) != JSON.stringify(EUR[i])){
                    await axios
                    .put('https://bda-p2-server.azurewebsites.net/update_missing?continent=EUR', ASI[i])
                    .then(res => {
                        i = i + 1
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })
                }
            }
        }
        ASI_prev = ASI
        
    }

    //EUR_prev = EUR
    //AME_prev = AME
    //ASI_prev = ASI



    
        /*axios
        .post('https://bda-p2-server.azurewebsites.net/register_missing?continent=AME', EUR[22])
        .then(res => {
            i = i + 1
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })*/
    
}
  
setInterval(intervalFunc, 30000);