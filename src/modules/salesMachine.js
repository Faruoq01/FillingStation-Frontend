import APIs from '../services/api';
const events = require('events');

const SalesMachine = function(data){
    
    this.stateLabel = '';
    this.error = null;
    this.machine = this;
    this.events = new events.EventEmitter();
    this.data = data;

    this.start = () => {
        this.changeState('Sales', this, true);
    }

    this.changeState = (name, machine, retry) => {
        if(name === 'done'){
            this.stateLabel = '';
            this.error = null;
            this.machine = this;
            this.events.emit('change', {
                label: "done", 
                machine: this,
                error: this.error,
            });
            this.events = new events.EventEmitter();

        }else{
            this.stateLabel = name;
            this.events.emit('change', {
                label: this.stateLabel, 
                machine: this,
                error: this.error,
            });
            const getState = this[name.split(' ').join('').toLowerCase()]
            getState(machine, retry);
        }
    }

    this.onStateChange = function(getUpdatedRecords){
        this.events.on('change', function(data){
            getUpdatedRecords({
                label: data.label, 
                mch: data.machine, 
                error: data.error, 
            });
        });
    }

    this.sales = (mch, retry) => {
        try{
            const payload = data.load['1'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'sales',
                    currentDate: data.date,
                    sales: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {console.log(data, 'sales record')
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Return to tank', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error.message,
                state: mch.currentState
            });
        }
    }

    this.returntotank = (mch, retry) => {
        try{
            const payload = data.load['2'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'rt',
                    currentDate: data.date,
                    rt: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('esales', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.esales = (mch, retry) => {
        try{
            const payload = data.load['3'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'esales',
                    currentDate: data.date,
                    lpo: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Expenses', mch, false);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error.message,
                state: mch.currentState
            });
        }
    }

    this.expenses = (mch, retry) => {
        try{
            const payload = data.load['4'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'expenses',
                    currentDate: data.date,
                    expenses: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Payments', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.payments = (mch, retry) => {
        try{
            const payload = data.load['5'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'payments',
                    currentDate: data.date,
                    payments: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Dipping', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.dipping = (mch, retry) => {
        try{
            const payload = data.load['6'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'dipping',
                    currentDate: data.date,
                    dipping: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Balance Carried Forward', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
            
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.balancecarriedforward = (mch, retry) => {
        try{
            const payload = data.load['1'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'balanceCF',
                    currentDate: data.date,
                    balanceCF: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === "success"){
                        mch.changeState('Tank Levels', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );

        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }

    this.tanklevels = (mch, retry) => {
        try{
            const payload = data.load['7'];
            const result = new Promise(async function(resolve, reject){
                const load = {
                    label: 'tankLevels',
                    currentDate: data.date,
                    tankLevels: payload,
                    outletID: data.outletID,
                    org: data.org,
                    retry: retry
                }

                await APIs.post('/daily-sales/create', load)
                .then(( {data} ) => {
                    if(data.code === 200){
                        resolve("success");
                    }
                }).catch(e => {
                    reject(e)
                });
            });

            result.then(
                (value) => {
                    if(value === 'success'){
                        mch.changeState('done', mch, retry);
                    }
                },
                (error) => {
                    if(error){
                        mch.error = error;
                        mch.events.emit('change', {
                            label: mch.stateLabel, 
                            machine: mch,
                            error: error,
                            state: mch.currentState
                        });
                    }
                }
            );
        }catch(e){
            mch.error = e;
            mch.events.emit('change', {
                label: mch.stateLabel, 
                machine: mch,
                error: mch.error,
                state: mch.currentState
            });
        }
    }
}

export default SalesMachine;

//Buffer.from(data, 'base64').toString('ascii'); to decode
//Buffer.from(JSON.stringify(mch)).toString('base64') to encode